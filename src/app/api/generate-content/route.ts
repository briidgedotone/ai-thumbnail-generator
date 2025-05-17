import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { videoDescription, style, contentType } = body;

    if (!videoDescription) {
      return NextResponse.json(
        { error: 'Missing required field: videoDescription' },
        { status: 400 }
      );
    }

    // Check if Gemini API key is available
    if (!GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not configured, using fallback approach for safety.');
      // Return fallback content
      return NextResponse.json({ 
        success: false,
        message: 'API key not configured',
        titles: [`${style || 'Video'}: ${videoDescription.slice(0, 30)}...`],
        descriptions: [videoDescription],
        tags: videoDescription.split(' ').slice(0, 5).map((tag: string) => tag.toLowerCase().replace(/[^a-z0-9]/g, '')),
        bestTitle: 0,
        bestDescription: 0
      });
    }

    // Create a prompt for Gemini based on contentType
    let geminiPrompt = '';
    
    if (contentType === 'titles') {
      // Prompt specialized for titles only
      geminiPrompt = `
      You are a YouTube content optimization expert. A content creator has provided a brief description of their video and needs help creating compelling titles for maximum engagement and SEO.

      Video Description: "${videoDescription}"
      ${style ? `Style: ${style}` : ''}

      Please generate the following:

      Five (5) engaging YouTube titles (max 100 characters each):
      - Make them clickable but not clickbait
      - Include relevant keywords for SEO
      - Make them emotionally compelling
      - If the video is a comparison, tutorial, or review, reflect that in the title

      Format your response as a valid JSON object with this exact structure:
      {
        "titles": ["title1", "title2", "title3", "title4", "title5"],
        "bestTitle": 1
      }

      Your response should ONLY include this JSON object, nothing else.
      `;
    } else if (contentType === 'descriptions') {
      // Prompt specialized for descriptions only
      geminiPrompt = `
      You are a YouTube content optimization expert. A content creator has provided a brief description of their video and needs help creating compelling descriptions for maximum engagement and SEO.

      Video Description: "${videoDescription}"
      ${style ? `Style: ${style}` : ''}

      Please generate the following:

      Five (5) optimized descriptions (max 300 characters each):
      - Include relevant keywords naturally
      - Add a clear call-to-action for engagement
      - Format with paragraph breaks (use \\n for line breaks)
      - Include hashtags at the end

      Format your response as a valid JSON object with this exact structure:
      {
        "descriptions": ["desc1", "desc2", "desc3", "desc4", "desc5"],
        "bestDescription": 1
      }

      Your response should ONLY include this JSON object, nothing else.
      `;
    } else if (contentType === 'tags') {
      // Prompt specialized for tags only
      geminiPrompt = `
      You are a YouTube content optimization expert. A content creator has provided a brief description of their video and needs help creating effective tags for maximum SEO.

      Video Description: "${videoDescription}"
      ${style ? `Style: ${style}` : ''}

      Please generate the following:

      8-12 SEO-optimized tags:
      - Include a mix of broad and specific tags
      - Add tags for related topics and channels
      - Keep each tag between 1-5 words
      - Avoid overly generic tags

      Format your response as a valid JSON object with this exact structure:
      {
        "tags": ["tag1", "tag2", "tag3", etc.]
      }

      Your response should ONLY include this JSON object, nothing else.
      `;
    } else {
      // Default prompt for all content types
      geminiPrompt = `
      You are a YouTube content optimization expert. A content creator has provided a brief description of their video and needs help creating compelling titles, descriptions, and tags for maximum engagement and SEO.

      Video Description: "${videoDescription}"
      ${style ? `Style: ${style}` : ''}

      Please generate the following:

      1. Five (5) engaging YouTube titles (max 100 characters each):
      - Make them clickable but not clickbait
      - Include relevant keywords for SEO
      - Make them emotionally compelling
      - If the video is a comparison, tutorial, or review, reflect that in the title

      2. Five (5) optimized descriptions (max 300 characters each):
      - Include relevant keywords naturally
      - Add a clear call-to-action for engagement
      - Format with paragraph breaks (use \\n for line breaks)
      - Include hashtags at the end

      3. 8-12 SEO-optimized tags:
      - Include a mix of broad and specific tags
      - Add tags for related topics and channels
      - Keep each tag between 1-5 words
      - Avoid overly generic tags

      4. Indicate which title and description you think is best (by number 1-5)

      Format your response as a valid JSON object with this exact structure:
      {
        "titles": ["title1", "title2", "title3", "title4", "title5"],
        "descriptions": ["desc1", "desc2", "desc3", "desc4", "desc5"],
        "tags": ["tag1", "tag2", "tag3", etc.],
        "bestTitle": 1,
        "bestDescription": 1
      }

      Your response should ONLY include this JSON object, nothing else.
      `;
    }

    // Make the request to the Gemini API with retry mechanism
    let response;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: geminiPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        });
        
        // If the request was successful, break out of the retry loop
        if (response.ok) {
          break;
        }
        
        // If we got a 503 error (service temporarily unavailable), retry
        if (response.status === 503) {
          attempts++;
          console.warn(`Gemini API returned 503, retrying (${attempts}/${maxAttempts})...`);
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
          continue;
        }
        
        // For other error codes, don't retry
        const errorText = await response.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`Gemini API error: ${response.status}`);
        
      } catch (fetchError) {
        attempts++;
        
        // If we've used all our retry attempts, throw the error
        if (attempts >= maxAttempts) {
          throw fetchError;
        }
        
        console.warn(`Fetch error, retrying (${attempts}/${maxAttempts})...`, fetchError);
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
      }
    }
    
    if (!response || !response.ok) {
      throw new Error('Failed to get a successful response from Gemini API after multiple attempts');
    }

    const geminiResponse = await response.json();
    
    // Extract the generated text from Gemini's response
    const generatedText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!generatedText) {
      throw new Error('No valid response from Gemini API');
    }

    // Parse the JSON response
    try {
      // Check if the response is wrapped in a markdown code block and extract the JSON
      let jsonText = generatedText;
      
      // If it starts with ```json or any other markdown code indicator, extract the JSON content
      const codeBlockMatch = generatedText.match(/```(?:json)?\s*\n([\s\S]*?)```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        jsonText = codeBlockMatch[1].trim();
      }
      
      const contentData = JSON.parse(jsonText);
      
      // Validate the response structure based on contentType
      if (contentType === 'titles') {
        if (!contentData.titles || !Array.isArray(contentData.titles)) {
          throw new Error('Invalid response structure: missing titles array');
        }
      } else if (contentType === 'descriptions') {
        if (!contentData.descriptions || !Array.isArray(contentData.descriptions)) {
          throw new Error('Invalid response structure: missing descriptions array');
        }
      } else if (contentType === 'tags') {
        if (!contentData.tags || !Array.isArray(contentData.tags)) {
          throw new Error('Invalid response structure: missing tags array');
        }
      } else {
        // For full content generation, validate all fields
        if (!contentData.titles || !contentData.descriptions || !contentData.tags || 
            !Array.isArray(contentData.titles) || !Array.isArray(contentData.descriptions) || !Array.isArray(contentData.tags)) {
          throw new Error('Invalid response structure from Gemini API');
        }
      }

      // Return the structured content
      return NextResponse.json({ 
        success: true,
        ...contentData
      });
      
    } catch (parseError) {
      console.error('Error parsing Gemini response as JSON:', parseError);
      console.error('Received text:', generatedText);
      throw new Error('Failed to parse Gemini response');
    }
    
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 