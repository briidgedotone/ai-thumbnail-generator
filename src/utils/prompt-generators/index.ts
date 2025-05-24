// Import from theme extractor
import { extractKeyThemes, type ExtractedThemes } from './theme-extractor';

// Import from base prompt
import { createPromptFromTemplate, type PromptSection } from './base-prompt';

// Import text overlay generator
import { generateTextOverlayPrompt } from './text-overlay';

// Import style-specific generators
import { generateBeastStylePrompt } from './style-prompts/beast-style';
import { generateMinimalistStylePrompt } from './style-prompts/minimalist-style';
import { generateCinematicStylePrompt } from './style-prompts/cinematic-style';
import { generateClickbaitStylePrompt } from './style-prompts/clickbait-style';

// Re-export everything for external use
export { 
  type ExtractedThemes,
  extractKeyThemes,
  type PromptSection,
  createPromptFromTemplate,
  generateTextOverlayPrompt,
  generateBeastStylePrompt,
  generateMinimalistStylePrompt,
  generateCinematicStylePrompt,
  generateClickbaitStylePrompt
};

/**
 * Main function to generate a thumbnail prompt based on style, description, and optional text
 */
export const generateThumbnailPrompt = async (
  description: string, 
  style: string,
  thumbnailText?: string,
  textStyle?: string,
  aiChatInput: string = ''
): Promise<string> => {
  // Generate base style prompt
  let prompt: string;
  
  switch(style) {
    case 'beast-style':
      // Only Beast style uses local NLP theme extraction
      const keyThemes = extractKeyThemes(description);
      prompt = generateBeastStylePrompt(description, keyThemes, aiChatInput);
      
      // Add special comparison guidance if price comparison is detected
      if (keyThemes.hasPriceComparison) {
        prompt += `\n\nVALUE COMPARISON GUIDANCE:
- This appears to be a thumbnail comparing values, prices, or timeframes
- Consider using a layout with clear division between the two sides
- Make the numerical values prominent (like $1 vs $1000, Day 1 vs Day 30)
- Use stark visual contrast between the sides (dull/bright, poor/luxurious, etc.)
- Match facial expressions to each side - serious/concerned on the low value side, excited/happy on the high side
- Add visual cues that enhance the comparison (worn objects vs new shiny objects, etc.)`;
      }
      break;
      
    case 'minimalist-style':
      // Gemini handles all analysis - no local theme extraction needed
      prompt = await generateMinimalistStylePrompt(description, aiChatInput);
      break;
      
    case 'cinematic-style':
      // Gemini handles all analysis - no local theme extraction needed
      prompt = await generateCinematicStylePrompt(description, aiChatInput);
      break;
      
    case 'clickbait-style':
      // Gemini handles all analysis - no local theme extraction needed
      prompt = await generateClickbaitStylePrompt(description, aiChatInput);
      break;
      
    default:
      // Default to beast style with local NLP
      const defaultThemes = extractKeyThemes(description);
      prompt = generateBeastStylePrompt(description, defaultThemes, aiChatInput);
  }

  // Handle text overlay - either add specific text or explicitly prevent it
  if (thumbnailText && textStyle) {
    const textOverlayPrompt = generateTextOverlayPrompt(thumbnailText, textStyle);
    prompt += '\n\n' + textOverlayPrompt;
  } else {
    // Explicitly prevent text when not requested
    prompt += `\n\nIMPORTANT TEXT INSTRUCTION:
- Do NOT add any text, words, numbers, or written content to this thumbnail
- Keep the image purely visual without any text overlays
- Focus on visual storytelling through imagery, expressions, and composition only`;
  }
  
  return prompt;
}; 