import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent'; // Old URL
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'; // Updated URL with gemini-2.0-flash

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    // Assuming 'description' from the client IS the detailed visual brief for the thumbnail.
    // If there's a separate "overall video topic/title", that needs to be passed separately.
    const { description, style, themes } = body;

    if (!description || !style) {
      return NextResponse.json(
        { error: 'Missing required fields: description (visual brief) and style' },
        { status: 400 }
      );
    }

    // Check if Gemini API key is available
    if (!GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not configured, using fallback approach for safety.');
      // Return a null prompt which will trigger frontend fallback
      return NextResponse.json({ structuredPrompt: null });
    }

    // Convert the themes JSON string back to an object if needed
    const parsedThemes = typeof themes === 'string' ? JSON.parse(themes) : themes;

    // Refined prompt for Gemini
    const geminiPrompt = `
    You are a prompt engineering expert for an AI image generation system. 
    Your goal is to analyze the user's detailed visual brief for a thumbnail and the pre-extracted themes to generate a structured prompt for a ${style} YouTube thumbnail. 
    Prioritize literal details from the User's Visual Brief.

    User's Visual Brief for the Thumbnail (Primary Source): "${description}"
    Style: ${style}
    Pre-Extracted Themes from Visual Brief (Supplementary Context): ${JSON.stringify(parsedThemes, null, 2)}

    Your task is to generate a detailed prompt following this exact structure, filling in the bracketed placeholders based on your analysis of the User's Visual Brief primarily:

    ---
    The primary visual content for this ${style} YouTube thumbnail is: "${description}" // DO NOT CHANGE OR SUMMARIZE THIS VISUAL BRIEF. USE IT AS IS FOR THE THUMBNAIL'S CORE DESCRIPTION.

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

    The thumbnail should be [style-appropriate adjectives for ${style}] and instantly communicate the visual scene described by: "${description}" // DO NOT CHANGE OR SUMMARIZE THIS VISUAL BRIEF. REFER TO IT LITERALLY.

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
    return NextResponse.json({ structuredPrompt });
  } catch (error) {
    console.error('Error analyzing prompt with Gemini:', error);
    return NextResponse.json(
      { error: 'Failed to analyze prompt', structuredPrompt: null },
      { status: 500 }
    );
  }
} 