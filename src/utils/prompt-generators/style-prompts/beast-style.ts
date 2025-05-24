import { ExtractedThemes } from '../theme-extractor';
import { PromptSection, createPromptFromTemplate } from '../base-prompt';

/**
 * Generates a detailed prompt for Beast Style thumbnails following high-impact visual guidelines
 */
export const generateBeastStylePrompt = (description: string, themes: ExtractedThemes): string => {
  const beastStylePrompt: PromptSection = {
    composition: [
      "Use dynamic scale differences - make subjects prominent in frame, filling 60-80% of the composition",
      "Position elements for strong visual impact with clear focal hierarchy",
      "Create depth through layered composition - foreground subject, middle ground context, background environment",
      "Use diagonal lines and dynamic angles to create energy and movement",
      "Frame subjects with environmental elements that enhance the story (doorways, windows, natural frames)"
    ],
    subjects: [
      "Focus on authentic, engaging facial expressions that match the content's emotional tone",
      "Capture subjects in dynamic poses that suggest action or movement",
      "Use hand gestures and body language to enhance the emotional message",
      "Show subjects interacting with relevant objects or environment",
      "Include multiple subjects when content involves comparisons or group dynamics"
    ],
    visualTreatment: [
      "Apply high contrast lighting with dramatic shadows and highlights",
      "Use warm, saturated colors with strategic color blocking for visual impact",
      "Create visual hierarchy through scale, contrast, and strategic placement",
      "Add environmental details that support and enhance the main narrative",
      "Use practical lighting effects (neon signs, screen glow, fire light) for atmosphere"
    ],
    storytelling: [
      "Show clear before/after or comparison elements when relevant to content",
      "Include visual props and environmental cues that hint at the video's topic",
      "Create visual tension through contrasting elements (luxury vs budget, new vs old)",
      "Use environmental storytelling - backgrounds that reinforce the main message",
      "Incorporate visual metaphors that make abstract concepts tangible"
    ],
    technical: [
      "Maintain sharp focus on main subjects with subtle background blur for depth",
      "Use professional lighting setup with key light, fill light, and rim lighting",
      "Apply color grading for consistency and enhanced visual appeal",
      "Ensure all important elements stay within the safe viewing area",
      "Optimize for mobile viewing - elements should be clearly visible at small sizes"
    ],
    styleAdjective: "high-impact professional YouTube",
    styleNoun: "thumbnail"
  };

  const promptTemplate = createPromptFromTemplate(
    description, 
    themes, 
    "High-Impact YouTube",
    beastStylePrompt
  );
  
  // Add special comparison guidance if price comparison is detected
  if (themes.hasPriceComparison) {
    return promptTemplate + `\n\nCOMPARISON LAYOUT GUIDANCE:
- Use a split-screen layout with a clear diagonal or vertical line dividing the thumbnail
- Make the comparison values prominent text elements in the thumbnail (e.g., "$1" vs "$500,000")
- Left side: Show the lower value with more muted colors, concerned facial expressions, basic items
- Right side: Show the higher value with bright colors, excited facial expressions, luxury items
- Use strong visual contrast - one side should look distinctly different from the other
- Include visual props that clearly communicate the difference (basic items vs luxury items, old vs new)
- Facial expressions should match each side - concerned/serious on lower side, happy/amazed on higher side
- Make the dividing line prominent with contrasting colors or clear graphics`;
  }
  
  return promptTemplate;
}; 