import { ExtractedThemes } from '../theme-extractor';

/**
 * Generates a detailed prompt for Minimalist Style thumbnails using Gemini API
 */
export const generateMinimalistStylePrompt = async (description: string, themes: ExtractedThemes): Promise<string> => {
  try {
    // Call Gemini API to analyze the description and extract relevant details for minimalist style
    const response = await fetch('/api/analyze-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        style: 'minimalist-style',
        themes // Pass themes for context if Gemini needs it
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API call failed for minimalist style:', errorData?.error || response.statusText);
      // If Gemini fails, return a simple, generic prompt as a last resort.
      // This ensures the application doesn't break if the Gemini endpoint has issues.
      return `Minimalist style thumbnail for: "${description}". Focus on key elements like ${themes.mainSubject} with a ${themes.mood} mood.`;
    }

    const result = await response.json();
    
    if (result.structuredPrompt) {
      console.log('[Gemini Generated Minimalist Prompt]', result.structuredPrompt);
      return result.structuredPrompt;
    } else {
      console.warn('[Gemini Response Issue - Minimalist] No structured prompt returned, using basic fallback.');
      return `Minimalist style thumbnail for: "${description}". Emphasize core visual elements. Main subject: ${themes.mainSubject}. Mood: ${themes.mood}.`;
    }

  } catch (error: any) {
    console.error('Error calling Gemini for minimalist prompt generation:', error.message);
    // Fallback to a very basic prompt if the API call itself fails (e.g., network issue)
    return `Error during minimalist prompt generation. Video content: "${description}". Key subject: ${themes.mainSubject}.`;
  }
}; 