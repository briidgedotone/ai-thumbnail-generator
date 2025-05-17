import { ExtractedThemes } from '../theme-extractor';
import { PromptSection, createPromptFromTemplate } from '../base-prompt';

/**
 * Generates a detailed prompt for Beast Style thumbnails following specific format guidelines
 */
export const generateBeastStylePrompt = (description: string, themes: ExtractedThemes): string => {
  const beastStylePrompt: PromptSection = {
    composition: [
      "Consider using a split-screen or before/after comparison layout that shows contrast (expensive vs cheap, day 1 vs day 30, etc.)",
      "Use rule of thirds with the main subject positioned for maximum impact, adapting as needed for the specific content",
      "Create clean, professional compositions with clear subject focus and minimal distracting elements",
      "Consider YouTube's display format, keeping essential elements within the central viewing area for both mobile and desktop"
    ],
    subjects: [
      "Feature subjects with emotions that match the video's content - avoid defaulting to shocked expressions unless specifically appropriate",
      "For human subjects, use a diverse range of authentic emotions like joy, concentration, determination, curiosity, or thoughtfulness",
      "If showing a person, frame them from mid-chest up to maximize emotional connection and recognition",
      "Position subjects to directly engage the viewer, looking toward the camera when appropriate"
    ],
    visualTreatment: [
      "Use vibrant, contrasting colors - particularly bold yellows, reds, blues - that grab attention while remaining appropriate to the subject",
      "Implement dramatic lighting with bold highlights and deep shadows to create visual hierarchy",
      "Consider stark color contrast between different sides if using a split-screen layout",
      "Use lighting techniques to direct attention to the most important elements in the composition"
    ],
    storytelling: [
      "Include bold numerical values or price points when relevant ($1 vs $1M, Day 1 vs Day 30, etc.)",
      "Create a clear visual story that instantly communicates what the video is about",
      "Design to stand out when displayed alongside competing videos in search results and recommendations",
      "Balance drama and authenticity - make it eye-catching without feeling misleading"
    ],
    technical: [
      "Render with excellent clarity and detail that remains legible even at smaller display sizes",
      "Use clean, professional editing with sharp edges and defined borders between elements",
      "Ensure strong visual contrast between elements to maintain impact at any scale",
      "Create a polished, professional image that feels intentional and high-quality"
    ],
    styleAdjective: "eye-catching, professional",
    styleNoun: "content"
  };

  const promptTemplate = createPromptFromTemplate(
    description, 
    themes, 
    "high-impact, attention-grabbing",
    beastStylePrompt
  );
  
  // Add special MrBeast comparison guidance if price comparison is detected
  if (themes.hasPriceComparison) {
    return promptTemplate + `\n\nVALUE COMPARISON GUIDANCE:
- This appears to be a thumbnail comparing values, prices, or timeframes
- Consider using a split-screen layout with clear division between the two sides
- Make the numerical values prominent (like $1 vs $1000, Day 1 vs Day 30)
- Use stark visual contrast between the sides (dull/bright, poor/luxurious, etc.)
- Match facial expressions to each side - serious/concerned on the low value side, excited/happy on the high value side
- Add visual cues that enhance the comparison (worn objects vs new shiny objects, etc.)`;
  }
  
  return promptTemplate;
}; 