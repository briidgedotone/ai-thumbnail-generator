/**
 * Generates a detailed prompt for Cinematic Style thumbnails using Gemini API
 */
export const generateCinematicStylePrompt = async (
  description: string, 
  aiChatInput: string = ''
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
        style: 'cinematic-style'
        // No themes needed - Gemini will extract everything
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API call failed for cinematic style:', errorData?.error || response.statusText);
      return `Cinematic style thumbnail for: "${description}". ${aiChatInput ? `Additional context: ${aiChatInput}` : ''}`;
    }

    const result = await response.json();
    
    if (result.structuredPrompt) {
      console.log('[Gemini Generated Cinematic Prompt]', result.structuredPrompt);
      return result.structuredPrompt;
    } else {
      console.warn('[Gemini Response Issue - Cinematic] No structured prompt returned, using basic fallback.');
      return `Cinematic style thumbnail for: "${description}". ${aiChatInput ? `Additional context: ${aiChatInput}` : ''}`;
    }

  } catch (error: any) {
    console.error('Error calling Gemini for cinematic prompt generation:', error.message);
    return `Error during cinematic prompt generation. Video content: "${description}". ${aiChatInput ? `Additional context: ${aiChatInput}` : ''}`;
  }
}; 