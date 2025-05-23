import { ExtractedThemes } from '../theme-extractor';

export const generateAestheticStylePrompt = async (
  description: string,
  themes: ExtractedThemes,
  aiChatInput: string = ''
): Promise<string> => {
  // Enhanced prompt structure for Aesthetic Style
  return `Create an aesthetic YouTube thumbnail for a video about: "${description}"

COMPOSITION:
- Use soft, pastel colors to create a calming and visually pleasing effect
- Incorporate minimalist design elements with a focus on simplicity and elegance
- Ensure the main subject is clearly defined and stands out against the background
- Balance text and images to create a harmonious layout

TYPOGRAPHY:
- Use bold, clear fonts with varying sizes to highlight key information
- Experiment with different font styles to add character

VISUAL ELEMENTS:
- Include subtle icons or overlays to enhance the theme
- Use emojis or small graphics to add a playful touch

SUBJECTS & EXPRESSIONS:
- Feature subjects with serene and relaxed expressions
- Use natural poses that convey a sense of tranquility and peace

VISUAL TREATMENT:
- Apply a soft focus effect to create a dreamy atmosphere
- Use gentle gradients and shadows to add depth and dimension

FLEXIBILITY:
- Allow room for creative interpretation and personalization based on the video's content and target audience

STORYTELLING ELEMENTS:
- Create a visual narrative that evokes a sense of calm and inspiration
- Suggest a journey or transformation that aligns with the video's theme

TECHNICAL SPECIFICATIONS:
- Render with high clarity and excellent detail that works at all YouTube display sizes
- Ensure perfect focus on the key emotional or narrative elements
- Create a polished final image with enhanced details that feels professionally produced`;
}; 