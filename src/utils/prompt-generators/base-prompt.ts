import { ExtractedThemes } from './theme-extractor';

/**
 * Structure for defining sections of the prompt
 */
export interface PromptSection {
  composition: string[];
  subjects: string[];
  visualTreatment: string[];
  storytelling: string[];
  technical: string[];
  styleAdjective: string;
  styleNoun: string;
}

/**
 * Creates a structured prompt template that all style generators can use
 */
export const createPromptFromTemplate = (
  description: string, 
  themes: ExtractedThemes, 
  styleTitle: string,
  promptSection: PromptSection
): string => {
  return `Create a ${styleTitle} YouTube thumbnail for a video about: "${description}"

FACIAL EXPRESSION GUIDANCE:
- Use engaging facial expressions that perfectly match the content's energy and intensity
- For high-energy content, embrace expressive emotional reactions - surprised, amazed, excited expressions are highly effective
- Match expression intensity to content importance - bigger reveals and challenges deserve stronger reactions
- Ensure expressions feel genuine to the content while maximizing visual appeal

COMPOSITION:
${promptSection.composition.map(item => `- ${item}`).join('\n')}

SUBJECTS & EXPRESSIONS:
${promptSection.subjects.map(item => `- ${item}`).join('\n')}

VISUAL TREATMENT:
${promptSection.visualTreatment.map(item => `- ${item}`).join('\n')}

STORYTELLING ELEMENTS:
${promptSection.storytelling.map(item => `- ${item}`).join('\n')}

TECHNICAL SPECIFICATIONS:
${promptSection.technical.map(item => `- ${item}`).join('\n')}
- CRITICAL SAFE ZONE: Keep all important elements (faces, main subjects, key objects) at least 20 pixels away from the top and bottom edges of the image
- Ensure main focus elements are positioned in the central safe area to account for different aspect ratio displays

KEY ELEMENTS FROM VIDEO:
- Main subject: ${themes.mainSubject}
- Action: ${themes.action}
- Setting: ${themes.setting}
- Mood: ${themes.mood}
- Key descriptors: ${themes.adjectives.slice(0, 3).join(', ')}
- Topics: ${themes.topics.slice(0, 3).join(', ')}

The thumbnail should be ${promptSection.styleAdjective} and instantly communicate the ${promptSection.styleNoun} of: "${description}"

VISUAL ENHANCEMENT GUIDELINES:
- Text elements should be prominently sized and highly readable
- Colors should be vibrant and attention-grabbing for maximum visibility
- Every element should be designed to stand out in a crowded video feed
- When creating impact, prioritize clarity and professional presentation`;
}; 