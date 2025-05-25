import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { checkRateLimit, rateLimitConfigs, getRateLimitHeaders } from '@/lib/rate-limiter';

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
function sanitizePrompt(prompt: string): string {
  if (typeof prompt !== 'string') {
    throw new Error('Prompt must be a string');
  }
  
  // Remove potentially harmful content
  const sanitized = prompt
    .trim()
    .slice(0, 4000) // Limit length to prevent abuse
    .replace(/[<>]/g, '') // Remove HTML-like tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/data:/gi, '') // Remove data: protocols
    .replace(/vbscript:/gi, ''); // Remove vbscript: protocols
  
  if (sanitized.length === 0) {
    throw new Error('Prompt cannot be empty after sanitization');
  }
  
  return sanitized;
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    // Input validation and sanitization
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { 
        status: 400,
        headers: corsHeaders 
      });
    }

    let sanitizedPrompt: string;
    try {
      sanitizedPrompt = sanitizePrompt(prompt);
    } catch (sanitizationError) {
      const errorMessage = sanitizationError instanceof Error ? sanitizationError.message : 'Invalid prompt format';
      return NextResponse.json({ error: errorMessage }, { 
        status: 400,
        headers: corsHeaders 
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('OpenAI API key not found.');
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { 
        status: 500,
        headers: corsHeaders 
      });
    }

    // Create a Supabase client for server-side operations
    const supabase = createRouteHandlerClient({ cookies });

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
    const rateLimitResult = checkRateLimit(user.id, rateLimitConfigs.aiGeneration);
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

    // Check user credits
    const { data: creditsData, error: creditsError } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (creditsError || !creditsData || creditsData.balance < 1) {
      console.error('Insufficient credits or error fetching credits:', creditsError);
      return NextResponse.json({ error: 'Insufficient credits' }, { 
        status: 400,
        headers: { ...corsHeaders, ...rateLimitHeaders }
      });
    }

    // Store original balance for potential refund
    const originalBalance = creditsData.balance;

    // Deduct 1 credit
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ balance: creditsData.balance - 1 })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return NextResponse.json({ error: 'Failed to update credits' }, { 
        status: 500,
        headers: { ...corsHeaders, ...rateLimitHeaders }
      });
    }

    // Call OpenAI API with sanitized prompt
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: sanitizedPrompt,
        n: 1,
        size: '1536x1024',
        quality: 'high',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      
      // Check if this is a content policy violation
      const isContentPolicyViolation = errorData?.error?.code === 'moderation_blocked' || 
                                      errorData?.error?.type === 'image_generation_user_error' ||
                                      (errorData?.error?.message && errorData?.error?.message.includes('safety system'));
      
      if (isContentPolicyViolation) {
        // Refund the credit since OpenAI blocked the request
        await supabase
          .from('user_credits')
          .update({ balance: originalBalance })
          .eq('user_id', user.id);
        
        return NextResponse.json({ 
          error: 'CONTENT_POLICY_VIOLATION',
          message: 'Your request was blocked by our safety system. Please try rephrasing your description to avoid references to copyrighted characters, violent content, or inappropriate material.',
          details: {
            reason: 'Content blocked by safety system',
            suggestions: [
              'Remove references to specific copyrighted characters (e.g., Spider-Man, Marvel characters)',
              'Avoid violent or shocking language',
              'Focus on general gaming content instead of specific franchises',
              'Use descriptive words about emotions and reactions without extreme language'
            ]
          },
          creditRefunded: true
        }, { 
          status: 400,
          headers: { ...corsHeaders, ...rateLimitHeaders }
        });
      }
      
      // For other OpenAI errors, also refund credit and provide helpful message
      await supabase
        .from('user_credits')
        .update({ balance: originalBalance })
        .eq('user_id', user.id);
      
      return NextResponse.json({ 
        error: 'OPENAI_API_ERROR',
        message: 'Failed to generate thumbnail due to an API error. Your credit has been refunded.',
        details: errorData,
        creditRefunded: true
      }, { 
        status: response.status,
        headers: { ...corsHeaders, ...rateLimitHeaders }
      });
    }

    const data = await response.json();
    
    // gpt-image-1 returns data in the format: { created: number, data: [{ b64_json: string }, ...] }
    const imageBase64 = data?.data?.[0]?.b64_json;

    if (!imageBase64) {
      console.error('Image data not found in OpenAI response:', data);
      
      // Refund credit if image generation failed
      await supabase
        .from('user_credits')
        .update({ balance: originalBalance })
        .eq('user_id', user.id);
      
      return NextResponse.json({ 
        error: 'IMAGE_GENERATION_FAILED',
        message: 'Image generation completed but no image data was returned. Your credit has been refunded.',
        creditRefunded: true
      }, { 
        status: 500,
        headers: { ...corsHeaders, ...rateLimitHeaders }
      });
    }

    // Convert base64 to a data URL the frontend can use directly
    const imageUrl = `data:image/png;base64,${imageBase64}`;
    
    return NextResponse.json({ imageUrl }, {
      headers: { ...corsHeaders, ...rateLimitHeaders }
    });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Try to refund credit on any unexpected errors if we have user context
    try {
      const supabase = createRouteHandlerClient({ cookies });
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get current balance and refund if it was deducted
        const { data: creditsData } = await supabase
          .from('user_credits')
          .select('balance')
          .eq('user_id', user.id)
          .single();
          
        if (creditsData) {
          await supabase
            .from('user_credits')
            .update({ balance: creditsData.balance + 1 })
            .eq('user_id', user.id);
        }
      }
    } catch (refundError) {
      console.error('Failed to refund credit on error:', refundError);
    }
    
    // Check if error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ 
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred while generating your thumbnail. Your credit has been refunded.',
      details: errorMessage,
      creditRefunded: true
    }, { 
      status: 500,
      headers: corsHeaders
    });
  }
} 