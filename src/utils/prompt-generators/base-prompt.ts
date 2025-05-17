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
- Important: Avoid defaulting to shocked/surprised expressions with wide eyes and open mouths
- Choose facial expressions that genuinely match the content's emotional tone and purpose
- Consider a diverse range of authentic emotions appropriate to the subject matter

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

KEY ELEMENTS FROM VIDEO:
- Main subject: ${themes.mainSubject}
- Action: ${themes.action}
- Setting: ${themes.setting}
- Mood: ${themes.mood}
- Key descriptors: ${themes.adjectives.slice(0, 3).join(', ')}
- Topics: ${themes.topics.slice(0, 3).join(', ')}

The thumbnail should be ${promptSection.styleAdjective} and instantly communicate the ${promptSection.styleNoun} of: "${description}"`;
}; 