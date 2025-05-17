import { ExtractedThemes } from '../theme-extractor';

/**
 * Generates a detailed prompt for Cinematic Style thumbnails using Gemini API
 */
export const generateCinematicStylePrompt = async (
  description: string, 
  themes: ExtractedThemes, 
  aiChatInput: string
): Promise<string> => {
  try {
    // Call Gemini API to analyze the description and AI chat input for cinematic style
    const response = await fetch('/api/analyze-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        aiChatInput, // Include AI chat input
        style: 'cinematic-style',
        themes: JSON.stringify(themes) // Pass themes for context if Gemini needs it
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API call failed for cinematic style:', errorData?.error || response.statusText);
      // If Gemini fails, return a simple, generic prompt as a last resort.
      // This ensures the application doesn't break if the Gemini endpoint has issues.
      return `Cinematic style thumbnail for: "${description}". Focus on key elements like ${themes.mainSubject} with a ${themes.mood} mood.`;
    }

    const result = await response.json();
    
    if (result.structuredPrompt) {
      console.log('[Gemini Generated Cinematic Prompt]', result.structuredPrompt);
      return result.structuredPrompt;
    } else {
      console.warn('[Gemini Response Issue - Cinematic] No structured prompt returned, using basic fallback.');
      return `Cinematic style thumbnail for: "${description}". Emphasize core visual elements. Main subject: ${themes.mainSubject}. Mood: ${themes.mood}.`;
    }

  } catch (error: any) {
    console.error('Error calling Gemini for cinematic prompt generation:', error.message);
    // Fallback to a very basic prompt if the API call itself fails (e.g., network issue)
    return `Error during cinematic prompt generation. Video content: "${description}". Key subject: ${themes.mainSubject}.`;
  }
}; 