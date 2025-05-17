import { ExtractedThemes } from '../theme-extractor';

/**
 * Generates a detailed prompt for Clickbait Style thumbnails using Gemini API
 */
export const generateClickbaitStylePrompt = async (
  description: string, 
  themes: ExtractedThemes, 
  aiChatInput: string
): Promise<string> => {
  try {
    // Call Gemini API to analyze the description and AI chat input for clickbait style
    const response = await fetch('/api/analyze-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        aiChatInput, // Include AI chat input
        style: 'clickbait-style',
        themes: JSON.stringify(themes) // Pass themes for context if Gemini needs it
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API call failed for clickbait style:', errorData?.error || response.statusText);
      // If Gemini fails, return a simple, generic prompt as a last resort.
      // This ensures the application doesn't break if the Gemini endpoint has issues.
      return `Clickbait style thumbnail for: "${description}". Focus on key elements like ${themes.mainSubject} with a ${themes.mood} mood.`;
    }

    const result = await response.json();
    
    if (result.structuredPrompt) {
      console.log('[Gemini Generated Clickbait Prompt]', result.structuredPrompt);
      return result.structuredPrompt;
    } else {
      console.warn('[Gemini Response Issue - Clickbait] No structured prompt returned, using basic fallback.');
      return `Create a clickbait YouTube thumbnail for a video about: "${description}"

COMPOSITION:
- Design with a bold, attention-grabbing layout that immediately draws the eye
- Organize elements to create maximum visual impact while remaining clear on different devices
- Use strategic empty space that accommodates text while keeping the main subject prominent
- Create a composition that stands out in YouTube's crowded recommendation feeds

SUBJECTS & EXPRESSIONS:
- Feature subjects with varied emotional expressions beyond just shock/surprise - use curiosity, amazement, focus, or enthusiasm
- Consider diverse poses and expressions that create interest without defaulting to the standard surprised open-mouth look
- Position subjects to break the fourth wall when appropriate, creating direct connection with natural expressions
- Use dynamic body language that suggests action, reaction, or authentic emotional response suited to the content

VISUAL TREATMENT:
- Use bright, attention-grabbing colors that pop against YouTube's interface
- Apply strategic color contrast to emphasize key elements and create visual hierarchy
- Consider strategic graphic elements (arrows, highlights, etc.) where they enhance understanding
- Implement lighting that creates drama and directs attention to the most important elements

STORYTELLING ELEMENTS:
- Create a visual moment that generates immediate curiosity about what happens in the video
- Suggest something surprising, unexpected, or impressive that encourages clicking
- Balance engaging 'clickability' with authentic representation of the actual content
- Design to trigger viewer interest while accurately representing what they'll find in the video

TECHNICAL SPECIFICATIONS:
- Render with high clarity and excellent detail that works at all YouTube display sizes
- Use subtle motion effects or dynamic elements where appropriate to suggest action
- Ensure perfect focus on the key emotional or narrative elements
- Create a polished final image with enhanced details that feels professionally produced

The thumbnail should be instantly intriguing and communicate the curiosity of: "${description}"`;
    }

  } catch (error: any) {
    console.error('Error calling Gemini for clickbait prompt generation:', error.message);
    // Fallback to a very basic prompt if the API call itself fails (e.g., network issue)
    return `Error during clickbait prompt generation. Video content: "${description}". Key subject: ${themes.mainSubject}.`;
  }
}; 