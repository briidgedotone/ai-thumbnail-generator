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
  // Extract key subjects and themes from the description
  const keyThemes = extractKeyThemes(description);
  
  // Generate base style prompt
  let prompt: string;
  switch(style) {
    case 'beast-style':
      prompt = generateBeastStylePrompt(description, keyThemes);
      break;
    case 'minimalist-style':
      prompt = await generateMinimalistStylePrompt(description, keyThemes);
      break;
    case 'cinematic-style':
      prompt = await generateCinematicStylePrompt(description, keyThemes, aiChatInput);
      break;
    case 'clickbait-style':
      prompt = await generateClickbaitStylePrompt(description, keyThemes, aiChatInput);
      break;
    default:
      prompt = generateBeastStylePrompt(description, keyThemes); // Default to beast style
  }
  
  // Add special MrBeast comparison guidance if price comparison is detected
  if (keyThemes.hasPriceComparison && style === 'beast-style') {
    prompt += `\n\nVALUE COMPARISON GUIDANCE:
- This appears to be a thumbnail comparing values, prices, or timeframes
- Consider using a split-screen layout with clear division between the two sides
- Make the numerical values prominent (like $1 vs $1000, Day 1 vs Day 30)
- Use stark visual contrast between the sides (dull/bright, poor/luxurious, etc.)
- Match facial expressions to each side - serious/concerned on the low value side, excited/happy on the high value side
- Add visual cues that enhance the comparison (worn objects vs new shiny objects, etc.)`;
  }
  
  // Add text overlay instructions if provided
  if (thumbnailText && textStyle) {
    const textOverlayPrompt = generateTextOverlayPrompt(thumbnailText, textStyle);
    prompt += '\n\n' + textOverlayPrompt;
  }
  
  return prompt;
}; 