import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, rateLimitConfigs, getRateLimitHeaders } from '@/lib/rate-limiter';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent'; // Old URL
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'; // Updated URL with gemini-2.0-flash

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
    .replace(/data:/gi, '') // Remove data: protocols
    .replace(/vbscript:/gi, ''); // Remove vbscript: protocols
  
  if (sanitized.length === 0) {
    throw new Error('Input cannot be empty after sanitization');
  }
  
  return sanitized;
}

interface RequestBody {
  description: string;
  style: string;
  themes?: string | Record<string, unknown>;
  aiChatInput?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { description, style, themes, aiChatInput }: RequestBody = await request.json();

    // Input validation and sanitization
    if (!description || !style) {
      return NextResponse.json(
        { error: 'Missing required fields: description (visual brief) and style' },
        { 
          status: 400,
          headers: corsHeaders 
        }
      );
    }

    let sanitizedDescription: string;
    let sanitizedStyle: string;
    let sanitizedAiChatInput: string | undefined;
    
    try {
      sanitizedDescription = sanitizeInput(description);
      sanitizedStyle = sanitizeInput(style);
      
      if (aiChatInput) {
        sanitizedAiChatInput = sanitizeInput(aiChatInput);
      }
    } catch (sanitizationError) {
      const errorMessage = sanitizationError instanceof Error ? sanitizationError.message : 'Invalid input format';
      return NextResponse.json({ error: errorMessage }, { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Validate style is one of the allowed values
    const allowedStyles = ['beast-style', 'minimalist-style', 'cinematic-style', 'clickbait-style'];
    if (!allowedStyles.includes(sanitizedStyle)) {
      return NextResponse.json(
        { error: 'Invalid style parameter' },
        { 
          status: 400,
          headers: corsHeaders 
        }
      );
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

    // Check if Gemini API key is available
    if (!GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not configured, using fallback approach for safety.');
      // Return a null prompt which will trigger frontend fallback
      return NextResponse.json({ structuredPrompt: null }, {
        headers: { ...corsHeaders, ...rateLimitHeaders }
      });
    }

    let parsedThemes: Record<string, unknown> = {}; // Default to empty object

    if (typeof themes === 'string') {
      try {
        parsedThemes = JSON.parse(themes);
      } catch (e) {
        console.error("Failed to parse themes JSON:", e);
        return NextResponse.json(
          { error: "Invalid 'themes' format. Expected a JSON string." },
          { 
            status: 400,
            headers: { ...corsHeaders, ...rateLimitHeaders }
          }
        );
      }
    } else if (themes != null) { // themes is not a string and not null/undefined
        console.warn("'themes' parameter was not a string, received:", typeof themes);
        // Optionally, you could return an error here if themes is provided but not a string
        // For now, we let it proceed with parsedThemes as {}
    }

    // Validate that parsedThemes is an object (it could be an array or primitive if JSON was valid but not an object)
    if (typeof parsedThemes !== 'object' || parsedThemes === null || Array.isArray(parsedThemes)) {
        console.error("Parsed 'themes' is not a valid object:", parsedThemes);
        return NextResponse.json(
            { error: "Invalid 'themes' content. Expected a JSON object." },
            { 
              status: 400,
              headers: { ...corsHeaders, ...rateLimitHeaders }
            }
        );
    }

    // Refined prompt for Gemini
    const geminiPrompt = `
    You are a prompt engineering expert for an AI image generation system. 
    Your goal is to analyze the user's detailed visual brief for a thumbnail and the pre-extracted themes to generate a structured prompt for a ${sanitizedStyle} YouTube thumbnail. 
    Prioritize literal details from the User's Visual Brief.

    User's Visual Brief for the Thumbnail (Primary Source): "${sanitizedDescription}"
    Style: ${sanitizedStyle}
    ${sanitizedAiChatInput ? `Additional Context: "${sanitizedAiChatInput}"` : ''}
    Pre-Extracted Themes from Visual Brief (Supplementary Context): ${JSON.stringify(parsedThemes, null, 2)}

    Your task is to generate a detailed prompt following this exact structure, filling in the bracketed placeholders based on your analysis of the User's Visual Brief primarily:

    ---
    The primary visual content for this ${sanitizedStyle} YouTube thumbnail is: "${sanitizedDescription}" // DO NOT CHANGE OR SUMMARIZE THIS VISUAL BRIEF. USE IT AS IS FOR THE THUMBNAIL'S CORE DESCRIPTION.

    FACIAL EXPRESSION GUIDANCE:
    - Important: Avoid defaulting to shocked/surprised expressions unless the User's Visual Brief specifically implies it.
    - Choose facial expressions that genuinely match the content's emotional tone and purpose as inferred from the User's Visual Brief.
    - Consider a diverse range of authentic emotions appropriate to the subject matter if humans are described.

    COMPOSITION:
    - [Derive 3-4 specific composition instructions directly from the User's Visual Brief. Focus on elements like subject placement, number of items (e.g., 'three iPhones'), specific framing (e.g., 'closeup'), rule of thirds, negative space, and perspective.]

    SUBJECTS & EXPRESSIONS:
    - [Derive 3-4 specific subject instructions directly from the User's Visual Brief. Detail the main subjects, their appearance, any interactions, and their expressions/emotions as explicitly described.]

    VISUAL TREATMENT:
    - [Derive 3-4 specific visual treatment instructions directly from the User's Visual Brief. Detail color palettes (e.g., 'green lighting'), lighting style (soft, dramatic), contrast, and overall mood described.]

    STORYTELLING ELEMENTS:
    - [Based on the User's Visual Brief, what 3-4 key things should the thumbnail visually communicate about the *content depicted in the thumbnail itself*?]

    TECHNICAL SPECIFICATIONS:
    - [Provide 3-4 standard technical guidelines for a high-quality YouTube thumbnail, e.g., 1280x720 resolution, excellent clarity, legibility at small sizes, sharp focus.]

    KEY ELEMENTS FROM THE VISUAL BRIEF: // Derive these PRIMARILY from the User's Visual Brief.
    - Main subject(s) depicted: [Identify the core subject(s) as literally described, e.g., 'three iPhone 16s in hand']
    - Main action depicted: [Identify the main action, e.g., 'being held', 'showcased']
    - Setting/Background depicted: [Identify the setting/background, e.g., 'subtle green soft lighting in the background']
    - Overall mood depicted: [Identify the overall mood from the brief, e.g., 'tech-focused', 'calm', 'subtle']
    - Key visual descriptors: [List key adjectives and nouns from the brief, e.g., 'three', 'iPhone 16', 'closeup', 'green lighting', 'soft', 'subtle']
    - Core visual topics: [List main topics depicted, e.g., 'iPhone 16', 'multiple devices', 'specific lighting']

    The thumbnail should be [style-appropriate adjectives for ${sanitizedStyle}] and instantly communicate the visual scene described by: "${sanitizedDescription}" // DO NOT CHANGE OR SUMMARIZE THIS VISUAL BRIEF. REFER TO IT LITERALLY.

    OVERRIDE INSTRUCTIONS: // Add these CRITICAL instructions based on your analysis of the User's Visual Brief.
    --- 
    // End of template. Below are the rules for adding OVERRIDE INSTRUCTIONS.

    RULES FOR ADDING OVERRIDE INSTRUCTIONS (analyze User's Visual Brief to apply these):
    1. If the User's Visual Brief mentions 'hand', 'in hand', or 'holding' an object, AND does NOT mention a person's face or full body, add: "CRITICAL: Show ONLY a hand holding the product - do NOT include any person, face, or body beyond the hand/arm"
    2. If the User's Visual Brief contains terms like 'closeup', 'close-up', or 'macro', add: "CRITICAL: Frame this as a true closeup focusing tightly on the subject(s) described - do not show the full product(s) unless specifically requested or implied by the tight closeup."
    3. If the User's Visual Brief mentions a specific background color OR a specific lighting color (e.g., 'green lighting in background', 'red background', 'blue glow'), identify that color and add: "CRITICAL: Background/Lighting MUST prominently feature the color [identified color] as specifically requested - this overrides any style defaults"
    4. Always add: "CRITICAL: Do NOT add any text, numbers, labels, or graphic elements unless the User's Visual Brief explicitly asks for them."
    5. Always add: "CRITICAL: Strictly follow the exact composition and subject details described in the User's Visual Brief - do not add additional elements or deviate based on common templates or patterns."

    Your response should ONLY include the structured prompt text, starting with "The primary visual content..." and ending after the OVERRIDE INSTRUCTIONS block. Do not include any other explanatory text before or after the prompt.
    `;

    // Make the request to the Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const geminiResponse = await response.json();
    
    // Extract the generated text from Gemini's response
    const structuredPrompt = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!structuredPrompt) {
      throw new Error('No valid response from Gemini API');
    }

    // Return the structured prompt
    return NextResponse.json({ structuredPrompt }, {
      headers: { ...corsHeaders, ...rateLimitHeaders }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in analyze-prompt API:', errorMessage);
    return NextResponse.json({ 
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred while analyzing the prompt.',
      details: errorMessage
    }, { 
      status: 500,
      headers: corsHeaders
    });
  }
} 