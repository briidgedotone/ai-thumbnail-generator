import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensures the route is always dynamically rendered

export async function POST(request: Request) {
  // Create a Supabase client for server-side operations
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ 
        error: 'Authentication failed',
        code: 'UNAUTHORIZED',
        details: authError?.message || 'User not authenticated'
      }, { status: 401 });
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
      return NextResponse.json({ 
        error: 'Image URL is required',
        code: 'MISSING_FIELD',
        details: 'The imageUrl field is required for saving a project'
      }, { status: 400 });
    }
    
    // Check if the image URL is a base64 data URL
    if (imageUrl.startsWith('data:image')) {
      // Extract the base64 data from the data URL
      const base64Data = imageUrl.split(',')[1];
      if (!base64Data) {
        return NextResponse.json({ 
          error: 'Invalid image data',
          code: 'INVALID_IMAGE_DATA',
          details: 'The image data URL is malformed or does not contain valid base64 data'
        }, { status: 400 });
      }
      
      // Convert base64 to Uint8Array for Supabase Storage
      const binaryData = Buffer.from(base64Data, 'base64');
      
      // Generate a unique filename
      const filename = `thumbnail_${user.id}_${Date.now()}.png`;
      const storagePath = `thumbnails/${filename}`;
      
      // Upload the image to Supabase Storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('thumbnails') // The bucket name - make sure this exists in your Supabase project
        .upload(storagePath, binaryData, {
          contentType: 'image/png',
          upsert: false
        });
      
      if (storageError) {
        console.error('Storage error:', storageError);
        return NextResponse.json({ 
          error: 'Failed to upload image to storage',
          code: 'STORAGE_ERROR',
          details: storageError.message
        }, { status: 500 });
      }
      
      // Get the public URL for the uploaded image
      const { data: publicUrlData } = supabase
        .storage
        .from('thumbnails')
        .getPublicUrl(storagePath);
      
      const publicUrl = publicUrlData.publicUrl;
      
      // Save the project to the database
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          selected_style_id: selectedStyleId,
          thumbnail_storage_path: publicUrl,
          generated_yt_title: generatedTitle,
          generated_yt_description: generatedDescription,
          generated_yt_tags: generatedTags,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (projectError) {
        console.error('Database error:', projectError);
        return NextResponse.json({ 
          error: 'Failed to save project to database',
          code: 'DATABASE_ERROR',
          details: projectError.message
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        success: true, 
        projectId: projectData.id,
        thumbnailUrl: publicUrl
      });
    } else {
      // If the image is already a URL (not base64), just save the project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          selected_style_id: selectedStyleId,
          thumbnail_storage_path: imageUrl,
          generated_yt_title: generatedTitle,
          generated_yt_description: generatedDescription,
          generated_yt_tags: generatedTags,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (projectError) {
        console.error('Database error:', projectError);
        return NextResponse.json({ 
          error: 'Failed to save project to database',
          code: 'DATABASE_ERROR',
          details: projectError.message
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        success: true, 
        projectId: projectData.id,
        thumbnailUrl: imageUrl
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 