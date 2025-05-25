import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { checkRateLimit, rateLimitConfigs, getRateLimitHeaders } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic'; // Ensures the route is always dynamically rendered

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'
    : 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Input sanitization function
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  const sanitized = input
    .trim()
    .slice(0, 2000) // Limit length
    .replace(/[<>]/g, '') // Remove HTML-like tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/vbscript:/gi, ''); // Remove vbscript: protocols
  
  if (sanitized.length === 0) {
    throw new Error('Input cannot be empty after sanitization');
  }
  
  return sanitized;
}

// Special sanitization for image URLs (allows data: URLs)
function sanitizeImageUrl(imageUrl: string): string {
  if (typeof imageUrl !== 'string') {
    throw new Error('Image URL must be a string');
  }
  
  // Allow data URLs for images, but validate they're actually image data URLs
  if (imageUrl.startsWith('data:image/')) {
    return imageUrl; // Don't modify valid image data URLs
  }
  
  // For regular URLs, apply basic sanitization
  const sanitized = imageUrl
    .trim()
    .replace(/[<>]/g, '') // Remove HTML-like tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/vbscript:/gi, ''); // Remove vbscript: protocols
  
  if (sanitized.length === 0) {
    throw new Error('Image URL cannot be empty after sanitization');
  }
  
  return sanitized;
}

export async function POST(request: Request) {
  // Create a Supabase client for server-side operations
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders 
      });
    }

    // Apply rate limiting
    const rateLimitResult = checkRateLimit(user.id, rateLimitConfigs.general);
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please wait before making another request.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        }, 
        { 
          status: 429,
          headers: { ...corsHeaders, ...rateLimitHeaders }
        }
      );
    }
    
    // Parse the request body
    const { 
      imageUrl, 
      selectedStyleId, 
      generatedTitle, 
      generatedDescription, 
      generatedTags 
    } = await request.json();
    
    // Validate required fields
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { 
        status: 400,
        headers: { ...corsHeaders, ...rateLimitHeaders }
      });
    }

    // Input sanitization (except for imageUrl which can be a data URL)
    let sanitizedTitle = '';
    let sanitizedDescription = '';
    let sanitizedTags: string[] = [];
    let sanitizedStyleId = '';
    let sanitizedImageUrl = '';

    try {
      sanitizedImageUrl = sanitizeImageUrl(imageUrl);
      if (generatedTitle) {
        sanitizedTitle = sanitizeInput(generatedTitle);
      }
      if (generatedDescription) {
        sanitizedDescription = sanitizeInput(generatedDescription);
      }
      if (selectedStyleId) {
        sanitizedStyleId = sanitizeInput(selectedStyleId);
      }
      if (generatedTags && Array.isArray(generatedTags)) {
        sanitizedTags = generatedTags.map(tag => sanitizeInput(tag)).filter(Boolean);
      }
    } catch (sanitizationError) {
      const errorMessage = sanitizationError instanceof Error ? sanitizationError.message : 'Invalid input format';
      return NextResponse.json({ error: errorMessage }, { 
        status: 400,
        headers: { ...corsHeaders, ...rateLimitHeaders }
      });
    }
    
    // Check if the image URL is a base64 data URL
    if (sanitizedImageUrl.startsWith('data:image')) {
      // Extract the base64 data from the data URL
      const base64Data = sanitizedImageUrl.split(',')[1];
      if (!base64Data) {
        return NextResponse.json({ error: 'Invalid image data' }, { 
          status: 400,
          headers: { ...corsHeaders, ...rateLimitHeaders }
        });
      }
      
      // Convert base64 to Uint8Array for Supabase Storage
      const binaryData = Buffer.from(base64Data, 'base64');
      
      // Generate a unique filename
      const timestamp = Date.now();
      const fileName = `thumbnail-${timestamp}.png`;
      
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('thumbnails')
        .upload(fileName, binaryData, {
          contentType: 'image/png',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return NextResponse.json({ error: 'Failed to upload thumbnail' }, { 
          status: 500,
          headers: { ...corsHeaders, ...rateLimitHeaders }
        });
      }
      
      // Get the public URL for the uploaded image
      const { data: publicUrlData } = supabase
        .storage
        .from('thumbnails')
        .getPublicUrl(fileName);
      
      const publicUrl = publicUrlData.publicUrl;
      
      // Save the project to the database
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          selected_style_id: sanitizedStyleId,
          thumbnail_storage_path: publicUrl,
          generated_yt_title: sanitizedTitle,
          generated_yt_description: sanitizedDescription,
          generated_yt_tags: sanitizedTags,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (projectError) {
        console.error('Database error:', projectError);
        return NextResponse.json({ error: 'Failed to save project' }, { 
          status: 500,
          headers: { ...corsHeaders, ...rateLimitHeaders }
        });
      }
      
      return NextResponse.json({ 
        success: true, 
        projectId: projectData.id,
        thumbnailUrl: publicUrl
      }, {
        headers: { ...corsHeaders, ...rateLimitHeaders }
      });
    } else {
      // If the image is already a URL (not base64), just save the project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          selected_style_id: sanitizedStyleId,
          thumbnail_storage_path: sanitizedImageUrl,
          generated_yt_title: sanitizedTitle,
          generated_yt_description: sanitizedDescription,
          generated_yt_tags: sanitizedTags,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (projectError) {
        console.error('Database error:', projectError);
        return NextResponse.json({ error: 'Failed to save project' }, { 
          status: 500,
          headers: { ...corsHeaders, ...rateLimitHeaders }
        });
      }
      
      return NextResponse.json({ 
        success: true, 
        projectId: projectData.id,
        thumbnailUrl: sanitizedImageUrl
      }, {
        headers: { ...corsHeaders, ...rateLimitHeaders }
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { 
      status: 500,
      headers: corsHeaders
    });
  }
} 