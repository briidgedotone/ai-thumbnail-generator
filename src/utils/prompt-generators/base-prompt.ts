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
- Use engaging facial expressions that match the content's emotional tone
- Avoid the default "shocked face with wide eyes and open mouth" expression unless the content specifically requires it  
- Consider a range of authentic emotions: focused, determined, thoughtful, amused, confident, or curious
- Make expressions feel genuine and appropriate to the video's actual content

SAFE ZONE GUIDANCE:
- Keep main focus elements and text away from the top 25px and bottom 25px areas
- This accounts for aspect ratio conversion from generated 1536x1024 to YouTube's 1280x720 format
- Position critical visual elements in the center safe area for optimal visibility

COMPOSITION: ${promptSection.composition.join('; ')}

SUBJECTS: ${promptSection.subjects.join('; ')}

VISUAL TREATMENT: ${promptSection.visualTreatment.join('; ')}

STORYTELLING: ${promptSection.storytelling.join('; ')}

TECHNICAL: ${promptSection.technical.join('; ')}

STYLE: Create a ${promptSection.styleAdjective} ${promptSection.styleNoun} that captures the essence of "${description}".

${themes.mainSubject ? `FOCUS SUBJECT: ${themes.mainSubject}` : ''}
${themes.action ? `KEY ACTION: ${themes.action}` : ''}
${themes.mood !== 'neutral' ? `EMOTIONAL TONE: ${themes.mood}` : ''}
${themes.topics.length > 0 ? `TOPICS: ${themes.topics.slice(0, 3).join(', ')}` : ''}`;
}; 