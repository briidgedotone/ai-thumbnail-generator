import { ExtractedThemes } from '../theme-extractor';
import { PromptSection, createPromptFromTemplate } from '../base-prompt';

/**
 * Generates a detailed prompt for Beast Style thumbnails following high-impact visual guidelines
 */
export const generateBeastStylePrompt = (description: string, themes: ExtractedThemes): string => {
  const beastStylePrompt: PromptSection = {
    composition: [
      "Prioritize split-screen or comparison layouts for maximum visual impact - divide the thumbnail clearly when showing contrasts",
      "Use dynamic scale differences - make subjects prominent in frame, filling 60-80% of the composition",
      "Position elements for strong visual tension - avoid centered, balanced layouts in favor of engaging positioning",
      "Create clear visual hierarchy where the most important element (face, money, product) dominates the frame",
      "Design for mobile-first viewing where thumbnails are seen at small sizes - everything must be bold and clear"
    ],
    subjects: [
      "Use engaging, expressive facial expressions - surprised, amazed, excited expressions with wide eyes are highly effective",
      "Show authentic emotional reactions that match the content's intensity and energy level",
      "Frame human subjects in close-ups showing mainly face and upper chest for maximum emotional connection",
      "Multiple people should show contrasting emotions (surprised vs confident, concerned vs excited) to create visual narrative",
      "Direct eye contact with camera is essential - subjects should feel like they're speaking directly to the viewer"
    ],
    visualTreatment: [
      "Use high color saturation - emphasize yellows, reds, and blues for eye-catching contrast",
      "Implement dramatic lighting with strong highlights and deep shadows for visual impact",
      "Create strong visual contrast between split-screen sides - one side should be noticeably different than the other",
      "Use color psychology: bright/warm colors for success/wealth, cooler/muted colors for challenges/poverty",
      "Apply dynamic color grading to make the image feel cinematic and larger-than-life"
    ],
    storytelling: [
      "Make numerical values and dollar amounts prominent text elements in the composition - they should be highly visible",
      "Create immediate visual curiosity - the thumbnail should make viewers want to know what happens",
      "Show a compelling moment or reveal from the video without giving everything away",
      "Use visual metaphors that are clear and immediately understandable (luxury vs basic, before vs after)",
      "Design to create interest - make viewers feel they'll discover something valuable by clicking"
    ],
    technical: [
      "Render in high quality with vibrant colors that remain effective on small screens",
      "Use thick black outlines on all text elements (8-10px outline minimum) for optimal readability",
      "Ensure the most important elements remain visible even when thumbnail is compressed to very small sizes",
      "Apply proper sharpening and contrast to make every element crystal clear",
      "Use drop shadows and glow effects on text and key elements to create depth and visual separation"
    ],
    styleAdjective: "high-impact, attention-grabbing, professional",
    styleNoun: "visual storytelling"
  };

  const promptTemplate = createPromptFromTemplate(
    description, 
    themes, 
    "high-impact professional YouTube",
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