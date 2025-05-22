import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OpenAI API key not found.');
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  // Create a Supabase client for server-side operations
  const supabase = createRouteHandlerClient({ cookies });

  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('Authentication error:', authError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check user credits
  const { data: creditsData, error: creditsError } = await supabase
    .from('user_credits')
    .select('balance')
    .eq('user_id', user.id)
    .single();

  if (creditsError || !creditsData || creditsData.balance < 1) {
    console.error('Insufficient credits or error fetching credits:', creditsError);
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
  }

  // Deduct 1 credit
  const { error: updateError } = await supabase
    .from('user_credits')
    .update({ balance: creditsData.balance - 1 })
    .eq('user_id', user.id);

  if (updateError) {
    console.error('Error updating credits:', updateError);
    return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
  }

  // Check if the prompt includes text overlay instructions
  const hasTextOverlay = prompt.includes('TEXT OVERLAY INSTRUCTIONS');
  
  console.log('[API Route] Generating image with prompt:', prompt);
  console.log('[API Route] Model: gpt-image-1, Size: 1536x1024'); 
  if (hasTextOverlay) {
    console.log('[API Route] Text overlay detected in prompt');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '1536x1024', // Updated to landscape size
        quality: 'high',
        // Note: response_format is not needed for gpt-image-1 as it always returns base64
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      return NextResponse.json({ error: 'Failed to generate image from OpenAI', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    
    // gpt-image-1 returns data in the format: { created: number, data: [{ b64_json: string }, ...] }
    const imageBase64 = data?.data?.[0]?.b64_json;

    if (!imageBase64) {
      console.error('Image data not found in OpenAI response:', data);
      return NextResponse.json({ error: 'Image data not found in response' }, { status: 500 });
    }

    // Convert base64 to a data URL the frontend can use directly
    const imageUrl = `data:image/png;base64,${imageBase64}`;
    
    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Check if error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
} 