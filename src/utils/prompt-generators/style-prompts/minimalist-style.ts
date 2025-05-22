import { ExtractedThemes } from '../theme-extractor';
import { features } from '@/lib/env';

/**
 * Generates a detailed prompt for Minimalist Style thumbnails using Gemini API
 */
export const generateMinimalistStylePrompt = async (description: string, themes: ExtractedThemes): Promise<string> => {
  try {
    // Check if Gemini API is available using features utility
    if (!features.hasGemini()) {
      console.warn('[Minimalist Style] Gemini API not configured, using fallback prompt');
      return `Minimalist style thumbnail for: "${description}". 
      
COMPOSITION:
- Use clean, open space with ample negative space
- Arrange elements with mathematical precision and alignment
- Focus on a single focal point with the ${themes.mainSubject} as the hero element
- Consider using a simple grid system for organization

SUBJECTS & EXPRESSIONS:
- Present ${themes.mainSubject} in isolation against a simple background
- Reduce the subject to its essential form, eliminating unnecessary details
- If humans are shown, use subtle, natural expressions rather than exaggerated ones
- Allow the subject to breathe with space around it

VISUAL TREATMENT:
- Use a restrained color palette of no more than 2-3 colors
- Consider monochromatic or analogous color schemes
- Implement subtle, even lighting without harsh shadows
- Favor muted tones with occasional strategic color accent

STORYTELLING ELEMENTS:
- Communicate the ${themes.mood} mood through simplicity and restraint
- Let the negative space tell part of the story
- Focus on quality over quantity of elements
- Create visual interest through perfect proportions rather than busyness

TECHNICAL SPECIFICATIONS:
- Ensure excellent image quality with crisp edges
- Use proper YouTube thumbnail dimensions (1280x720)
- Maintain legibility even at small sizes
- Create subtle texture only where it enhances the minimal aesthetic

The thumbnail should be elegant, refined and instantly communicate the content described by: "${description}"

CRITICAL: Do NOT add any text, numbers, labels, or graphic elements unless the brief explicitly asks for them.
CRITICAL: Strictly follow the exact composition and subject details described in the brief - do not add additional elements or deviate based on common templates or patterns.`;
    }

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