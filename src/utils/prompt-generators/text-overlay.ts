/**
 * Generates specific instructions for text overlay based on the style
 */
export const generateTextOverlayPrompt = (text: string, style: string): string => {
  let styleInstructions = '';
  
  switch(style) {
    case 'Bold White':
      styleInstructions = 'large, bold white text with a thick black outline or drop shadow for maximum readability against any background - similar to popular YouTuber styles';
      break;
    case 'Bold Yellow':
      styleInstructions = 'large, bold yellow text with a heavy black outline that pops against any background - similar to top YouTube creators';
      break;
    case 'Minimalist':
      styleInstructions = 'clean, thin sans-serif text in white with subtle spacing between characters';
      break;
    case 'Pixel':
      styleInstructions = 'retro pixel-style text that resembles classic video games, with a blocky appearance';
      break;
    case 'Calligraphy':
      styleInstructions = 'elegant handwritten calligraphy style that appears flowing and artistic';
      break;
    case 'Cute':
      styleInstructions = 'playful, rounded letters with a cheerful appearance, possibly in pastel colors';
      break;
    default:
      styleInstructions = 'clear, readable text that contrasts with the background';
  }
  
  return `TEXT OVERLAY INSTRUCTIONS:
- Add the following text to the thumbnail: "${text}"
- Style the text using ${style} typography: ${styleInstructions}
- Position the text where it will have maximum impact and readability
- If text includes numbers (like "$1M" or "Day 30"), make them especially prominent and large
- For comparison thumbnails, position text to clearly label each side (left/right)
- Text should be extremely legible, even at small thumbnail sizes
- The text should be a focal point and integrate harmoniously with the overall design

IMPORTANT EXPRESSION NOTE:
- Avoid the default "shocked face with wide eyes and open mouth" expression unless the content specifically requires it
- Use facial expressions that genuinely match the video content's emotional tone
- Consider a range of authentic emotions: focused, determined, thoughtful, amused, confident, or curious`;
}; 