import { NextResponse } from 'next/server';

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

  console.log('[API Route] Generating image with prompt:', prompt);
  console.log('[API Route] Model: dall-e-2, Size: 1024x1024'); // Log other params for clarity

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-2', // Or 'dall-e-3' if you have access and prefer it
        prompt: prompt,
        n: 1, // Number of images to generate
        size: '1024x1024', // Or other supported sizes like '256x256', '512x512', '1024x1792', '1792x1024' for DALL-E 3
        response_format: 'url', // We want the URL of the generated image
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      return NextResponse.json({ error: 'Failed to generate image from OpenAI', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    
    // Assuming DALL-E returns data in the format: { created: number, data: [{ url: string }, ...] }
    const imageUrl = data?.data?.[0]?.url;

    if (!imageUrl) {
      console.error('Image URL not found in OpenAI response:', data);
      return NextResponse.json({ error: 'Image URL not found in response' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Check if error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
} 