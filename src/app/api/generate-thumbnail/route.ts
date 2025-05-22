import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OpenAI API key not configured in environment variables.');
    return NextResponse.json({ 
      error: 'OpenAI API key not configured', 
      code: 'MISSING_API_KEY' 
    }, { status: 500 });
  }

  // Check if the prompt includes text overlay instructions
  const hasTextOverlay = prompt.includes('TEXT OVERLAY INSTRUCTIONS');
  
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
      return NextResponse.json({ 
        error: 'Failed to generate image from OpenAI', 
        details: errorData,
        code: 'OPENAI_API_ERROR'
      }, { status: response.status });
    }

    const data = await response.json();
    
    // gpt-image-1 returns data in the format: { created: number, data: [{ b64_json: string }, ...] }
    const imageBase64 = data?.data?.[0]?.b64_json;

    if (!imageBase64) {
      console.error('Image data not found in OpenAI response:', data);
      return NextResponse.json({ 
        error: 'Image data not found in response',
        code: 'MISSING_IMAGE_DATA'
      }, { status: 500 });
    }

    // Convert base64 to a data URL the frontend can use directly
    const imageUrl = `data:image/png;base64,${imageBase64}`;
    
    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Check if error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: errorMessage,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
} 