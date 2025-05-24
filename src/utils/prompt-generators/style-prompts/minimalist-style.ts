/**
 * Generates a detailed prompt for Minimalist Style thumbnails using Gemini API
 */
export const generateMinimalistStylePrompt = async (description: string, aiChatInput: string = ''): Promise<string> => {
  try {
    // Call Gemini API to analyze the description and AI chat input for minimalist style
    const response = await fetch('/api/analyze-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        aiChatInput, // Include AI chat input
        style: 'minimalist-style'
        // No themes needed - Gemini will extract everything
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API call failed for minimalist style:', errorData?.error || response.statusText);
      return `Minimalist style thumbnail for: "${description}". ${aiChatInput ? `Additional context: ${aiChatInput}` : ''}`;
    }

    const result = await response.json();
    
    if (result.structuredPrompt) {
      console.log('[Gemini Generated Minimalist Prompt]', result.structuredPrompt);
      return result.structuredPrompt;
    } else {
      console.warn('[Gemini Response Issue - Minimalist] No structured prompt returned, using basic fallback.');
      return `Minimalist style thumbnail for: "${description}". ${aiChatInput ? `Additional context: ${aiChatInput}` : ''}`;
    }

  } catch (error: any) {
    console.error('Error calling Gemini for minimalist prompt generation:', error.message);
    return `Error during minimalist prompt generation. Video content: "${description}". ${aiChatInput ? `Additional context: ${aiChatInput}` : ''}`;
  }
}; 