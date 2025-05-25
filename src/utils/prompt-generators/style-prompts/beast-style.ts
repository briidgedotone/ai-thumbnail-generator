import { ExtractedThemes } from '../theme-extractor';
import { PromptSection, createPromptFromTemplate } from '../base-prompt';

/**
 * Generates a detailed prompt for Beast Style thumbnails following high-impact visual guidelines
 */
export const generateBeastStylePrompt = (description: string, themes: ExtractedThemes, aiChatInput: string = ''): string => {
  // If aiChatInput is provided, use it as additional context
  const effectiveDescription = aiChatInput ? `${description}. Additional context: ${aiChatInput}` : description;
  
  // Strong text prevention instruction at the start
  const textPreventionInstruction = `CRITICAL: This thumbnail must be COMPLETELY TEXT-FREE. Do not add any text, words, numbers, letters, or written content of any kind. Focus purely on visual elements.

`;
  
  const beastStylePrompt: PromptSection = {
    composition: [
      "Create PHOTOREALISTIC professional photography composition - not illustration, artwork, or cartoon style",
      "Use dynamic scale differences - make subjects prominent in frame, filling 60-80% of the composition",
      "Position elements for strong visual impact with clear focal hierarchy",
      "Create depth through layered composition - foreground subject, middle ground context, background environment",
      "Use diagonal lines and dynamic angles to create energy and movement",
      "Frame subjects with environmental elements that enhance the story"
    ],
    subjects: [
      "Photograph REAL HUMAN SUBJECTS with photorealistic skin textures, natural facial features, and realistic proportions",
      "Focus on HIGHLY EXPRESSIVE facial expressions - wide genuine smiles, excited wide eyes, or pure amazement",
      "Use energetic, enthusiastic expressions that convey excitement, joy, determination, or wonder",
      "Capture subjects in dynamic poses that suggest action or movement with high energy",
      "Use animated hand gestures and body language that amplifies the emotional message",
      "Show subjects interacting with relevant objects or environment with visible enthusiasm",
      "Include multiple subjects when content involves comparisons or group dynamics",
      "Avoid neutral, serious, or concerned expressions - lean into positive, high-energy emotions"
    ],
    visualTreatment: [
      "Apply professional photography lighting and color grading - never illustration or artistic rendering",
      "Use EXTREMELY BRIGHT, almost overexposed lighting that makes subjects and environments glow",
      "Don't use dark colors, Use bright colors",
      "Create extreme color saturation that appears almost glowing",
      "Apply strategic color blocking with at least 2-3 highly contrasting ELECTRIC colors",
      "Use high contrast lighting with dramatic shadows and highlights to enhance the electric color vibrancy",
      "Ensure EVERYTHING is brightly lit - no dark shadows or dim areas, make the entire scene luminous",
      "Create bright, sunny, well-lit environments that appear almost glowing or overexposed",
      "Ensure colors are so intensely bright they dominate the composition and grab immediate attention",
      "Create strong color separation between subject and background - colors should literally 'pop off the screen'",
      "Add environmental details that support the electric color scheme and enhance the main narrative"
    ],
    storytelling: [
      "Show clear before/after or comparison elements when relevant to content using realistic photography",
      "Include visual props and environmental cues that hint at the video's topic",
      "Create visual tension through contrasting elements (luxury vs budget, new vs old)",
      "Use environmental storytelling - backgrounds that reinforce the main message",
      "Incorporate visual metaphors that make abstract concepts tangible"
    ],
    technical: [
      "CRITICAL: Create PHOTOREALISTIC PHOTOGRAPHY ONLY - absolutely NO cartoon, illustration, digital art, or animated style",
      "Use DSLR camera quality with realistic depth of field, professional lighting setup, and natural shadows",
      "Apply BRIGHT, sunny lighting setup with multiple light sources to eliminate dark areas",
      "Use extremely well-lit photography with almost overexposed brightness that makes everything luminous",
      "Maintain sharp focus on main subjects with subtle background blur for depth",
      "Use professional lighting setup with key light, fill light, and rim lighting",
      "Apply color grading for consistency and enhanced visual appeal with emphasis on color saturation",
      "Ensure all important elements stay within the safe viewing area",
      "Optimize for mobile viewing - elements should be clearly visible at small sizes",
      "Create realistic human faces, skin textures, and natural proportions",
      "Apply professional photography quality with realistic lighting and shadows",
      "Ensure environments and objects appear realistic and three-dimensional",
      "Render as if shot with professional camera equipment in real-world settings"
    ],
    styleAdjective: "photorealistic high-impact professional YouTube",
    styleNoun: "thumbnail"
  };

  const promptTemplate = createPromptFromTemplate(
    effectiveDescription, 
    themes, 
    "High-Impact YouTube",
    beastStylePrompt
  );
  
  // Add special comparison guidance if price comparison is detected
  if (themes.hasPriceComparison) {
    return textPreventionInstruction + promptTemplate + `\n\nCOMPARISON LAYOUT GUIDANCE:
- Use a split-screen layout with a clear diagonal or vertical line dividing the thumbnail
- Left side: Show the lower value scenario with more muted colors, concerned facial expressions, basic items
- Right side: Show the higher value scenario with bright colors, excited facial expressions, luxury items
- Use strong visual contrast - one side should look distinctly different from the other
- Include visual props that clearly communicate the difference (basic items vs luxury items, old vs new)
- Facial expressions should match each side - concerned/serious on lower side, happy/amazed on higher side
- Make the dividing line prominent with contrasting colors or clear graphics
- Focus on visual storytelling through objects, environments, and expressions rather than text
- Use visual cues like quality differences, size differences, or environmental contrasts to show the comparison`;
  }
  
  return textPreventionInstruction + promptTemplate;
}; 