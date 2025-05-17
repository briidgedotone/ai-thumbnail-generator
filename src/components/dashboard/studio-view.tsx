'use client';

import React, { useState, useEffect } from 'react';
import { ThumbnailStyleSelector } from "@/components/dashboard/thumbnail-style-selector";
import { AIChatInput } from "@/components/dashboard/ai-chat-input";
import { VideoDescriptionInput } from "@/components/dashboard/video-description-input";
import { VideoDetailsPanel } from "@/components/dashboard/video-details-panel";
import { YouTubePreviewGrid } from "@/components/dashboard/youtube-preview-grid";
import { motion, AnimatePresence } from 'framer-motion';
import nlp from 'compromise';

interface StudioViewProps {
  selectedThumbnailStyle: string | null;
  onSelectStyle: (style: string | null) => void;
  videoDescription: string;
  onVideoDescriptionChange: (value: string) => void;
  onDetailsPanelStateChange?: (isOpen: boolean) => void;
}

// Define a proper interface for the extracted themes
interface ExtractedThemes {
  mainSubject: string;
  action: string;
  setting: string;
  mood: string;
  topics: string[];
  adjectives: string[];
  hasPriceComparison: boolean;
}

export function StudioView({
  selectedThumbnailStyle,
  onSelectStyle,
  videoDescription,
  onVideoDescriptionChange,
  onDetailsPanelStateChange,
}: StudioViewProps) {
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [generatedData, setGeneratedData] = useState<{
    thumbnail: string;
    title: string;
    description: string;
    tags: string[];
  } | undefined>(undefined);
  const [aiGeneratedImageUrl, setAiGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get thumbnail style image path based on the selected style
  const getThumbnailStylePath = (styleId: string | null): string | null => {
    if (!styleId) return null;
    
    const stylePathMap: Record<string, string> = {
      'beast-style': '/thumbnail-styles/01-beast-style.png',
      'minimalist-style': '/thumbnail-styles/02-minimalist-style.png',
      'cinematic-style': '/thumbnail-styles/03-cinematic-style.png',
      'clickbait-style': '/thumbnail-styles/04-clickbait-style.jpg',
    };
    
    return stylePathMap[styleId] || null;
  };

  // Notify parent component when details panel state changes
  useEffect(() => {
    if (onDetailsPanelStateChange) {
      onDetailsPanelStateChange(isDetailsPanelOpen);
    }
  }, [isDetailsPanelOpen, onDetailsPanelStateChange]);

  const handleSubmit = async (e?: React.FormEvent, thumbnailText?: string, textStyle?: string) => {
    if (e) e.preventDefault();
    if (videoDescription.trim() === '' || !selectedThumbnailStyle) return;

    setIsLoading(true);
    setError(null);
    setAiGeneratedImageUrl(null); // Reset previous image

    // Set initial generatedData for the panel to render with loading indicators
    setGeneratedData({
      thumbnail: aiGeneratedImageUrl || getThumbnailStylePath(selectedThumbnailStyle) || '', // Use empty string if no image path yet, Image component will handle onError or show alt
      title: `Generating for: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
      description: videoDescription,
      tags: videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, '')),
    });
    setIsDetailsPanelOpen(true); // Open panel so it can show its loading state

    // Generate a style-specific structured prompt, now with text overlay if provided
    const structuredPrompt = generateThumbnailPrompt(videoDescription, selectedThumbnailStyle, thumbnailText, textStyle);
    console.log('[Structured Prompt]', structuredPrompt); // Log for debugging

    try {
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: structuredPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const result = await response.json();
      setAiGeneratedImageUrl(result.imageUrl);

      // Update generatedData with the new AI image URL and final title
      setGeneratedData({
        thumbnail: result.imageUrl, // Use the new AI image URL
        title: `${selectedThumbnailStyle.replace('-style', '')} Video: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
        description: videoDescription,
        tags: videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, '')),
      });
      // setIsDetailsPanelOpen(true); // Already open

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error("Error generating thumbnail:", errorMessage);
      setError(errorMessage);
      alert(`Error generating thumbnail: ${errorMessage}`);
      // Fallback if AI generation fails and update title
      setGeneratedData({
        thumbnail: getThumbnailStylePath(selectedThumbnailStyle) || '',
        title: `Error - ${selectedThumbnailStyle}: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
        description: videoDescription,
        tags: videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, '')),
      });
      setAiGeneratedImageUrl(null); // Clear any potentially old AI image URL
      // setIsDetailsPanelOpen(true); // Already open
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Extracts key themes, subjects, and elements from the video description
   * using NLP to better understand the content
   */
  const extractKeyThemes = (description: string): ExtractedThemes => {
    // Process the description with compromise.js
    const doc = nlp(description);
    
    // Extract nouns (potential subjects)
    const nouns = doc.nouns().out('array');
    
    // Extract verbs (potential actions)
    const verbs = doc.verbs().out('array');
    const verbBase = verbs.length > 0 ? 
      doc.verbs().toInfinitive().out('array')[0] : 'demonstrating';
    
    // Extract adjectives (descriptions, qualities)
    const adjectives = doc.adjectives().out('array');
    
    // Extract places (potential settings)
    const places = doc.places().out('array');
    
    // Determine the mood based on more sophisticated analysis
    const sentiments = {
      positive: ['amazing', 'exciting', 'awesome', 'great', 'incredible', 'excellent', 'fantastic'],
      negative: ['terrible', 'awful', 'bad', 'horrible', 'disappointing'],
      calm: ['peaceful', 'calm', 'relaxing', 'gentle', 'soothing', 'quiet'],
      intense: ['extreme', 'intense', 'dramatic', 'powerful', 'strong', 'epic']
    };
    
    // Detect the overall mood
    let detectedMood = 'neutral';
    
    // Check for sentiments in both adjectives and the full description
    if (adjectives.some((adj: string) => sentiments.positive.includes(adj.toLowerCase()))) {
      detectedMood = 'positive';
    } else if (adjectives.some((adj: string) => sentiments.negative.includes(adj.toLowerCase()))) {
      detectedMood = 'negative';
    } else if (adjectives.some((adj: string) => sentiments.calm.includes(adj.toLowerCase()))) {
      detectedMood = 'calm';
    } else if (adjectives.some((adj: string) => sentiments.intense.includes(adj.toLowerCase()))) {
      detectedMood = 'intense';
    }
    
    // Check the full description if no mood detected in adjectives
    if (detectedMood === 'neutral') {
      for (const mood in sentiments) {
        if (sentiments[mood as keyof typeof sentiments].some(term => 
          description.toLowerCase().includes(term))) {
          detectedMood = mood;
          break;
        }
      }
    }
    
    // Extract topics (important terms not covered by other categories)
    const topics = doc.topics().out('array');
    
    // Extract hashtags if they exist
    const hashtags = description.match(/#\w+/g) || [];
    
    // Get a main subject - prefer topics, then nouns
    const mainSubject = topics.length > 0 ? topics[0] : 
                       nouns.length > 0 ? nouns[0] : 'content';
                       
    // Get a setting - prefer places, then look for setting-like words
    const settingWords = ['room', 'house', 'outside', 'indoor', 'outdoor', 'studio', 'kitchen'];
    const settingNoun = nouns.find((noun: string) => 
      settingWords.some((setting: string) => noun.toLowerCase().includes(setting))
    );
    
    const setting = places.length > 0 ? places[0] : 
                   settingNoun || 'environment';

    // Check for price/value comparisons that might suggest MrBeast-style comparisons
    const pricePattern = /\$\d+\s*(?:vs\.?|versus)\s*\$\d+|\d+\s*(?:vs\.?|versus)\s*\d+|\$\d+\s*(?:to)\s*\$\d+|\d+\s*(?:day|days|hour|hours)/i;
    const hasPriceComparison = pricePattern.test(description);
    
    return {
      mainSubject,
      action: verbBase,
      setting,
      mood: detectedMood,
      topics: [...topics, ...hashtags.map(tag => tag.substring(1))], // Remove # from hashtags
      adjectives,
      hasPriceComparison
    };
  };

  /**
   * Generates a structured, detailed prompt for thumbnail generation based on the video description and selected style
   */
  const generateThumbnailPrompt = (
    description: string, 
    style: string,
    thumbnailText?: string,
    textStyle?: string
  ): string => {
    // Extract key subjects and themes from the description
    const keyThemes = extractKeyThemes(description);
    
    // Generate base style prompt
    let prompt: string;
    switch(style) {
      case 'beast-style':
        prompt = generateBeastStylePrompt(description, keyThemes);
        break;
      case 'minimalist-style':
        prompt = generateMinimalistStylePrompt(description, keyThemes);
        break;
      case 'cinematic-style':
        prompt = generateCinematicStylePrompt(description, keyThemes);
        break;
      case 'clickbait-style':
        prompt = generateClickbaitStylePrompt(description, keyThemes);
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

  /**
   * Generates specific instructions for text overlay based on the style
   */
  const generateTextOverlayPrompt = (text: string, style: string): string => {
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

  /**
   * Creates a structured prompt template that all style generators can use
   */
  interface PromptSection {
    composition: string[];
    subjects: string[];
    visualTreatment: string[];
    storytelling: string[];
    technical: string[];
    styleAdjective: string;
    styleNoun: string;
  }

  const createPromptFromTemplate = (
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

  /**
   * Generates a detailed prompt for Beast Style thumbnails following specific format guidelines
   */
  const generateBeastStylePrompt = (description: string, themes: ExtractedThemes): string => {
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

    return createPromptFromTemplate(
      description, 
      themes, 
      "high-impact, attention-grabbing",
      beastStylePrompt
    );
  };

  /**
   * Generates a detailed prompt for Minimalist Style thumbnails
   */
  const generateMinimalistStylePrompt = (description: string, themes: ExtractedThemes): string => {
    const minimalistStylePrompt: PromptSection = {
      composition: [
        "Use strategic negative space to create a clean, focused composition that adapts to the content",
        "Position elements with intentional, balanced arrangement that guides the viewer's eye",
        "Embrace simplicity while ensuring the core message is clearly communicated",
        "Consider how the design will appear at different scales on the YouTube platform"
      ],
      subjects: [
        "Represent the subject with simplified, iconic visuals that capture its essence",
        "If featuring people, use thoughtful, subtle expressions that convey intelligence and intentionality - avoid surprised expressions",
        "Remove unnecessary details to focus attention on what truly matters to the content",
        "Use simplified forms that communicate clearly even at small thumbnail sizes"
      ],
      visualTreatment: [
        "Apply a thoughtful, limited color palette (2-4 colors) that creates visual harmony",
        "Use color and contrast intentionally to highlight the most important elements",
        "Consider using subtle textures or gradients only where they enhance understanding",
        "Create visual hierarchy through thoughtful use of scale, weight, and positioning"
      ],
      storytelling: [
        "Communicate the video's concept through elegant visual metaphors or symbols",
        "Create intrigue through what is purposefully omitted rather than what is shown",
        "Design for a sophisticated audience that appreciates subtlety and clarity",
        "Ensure the thumbnail functions well in YouTube's content-dense environment"
      ],
      technical: [
        "Render with precise edges and thoughtful geometry that maintains integrity at all sizes",
        "Use careful alignment and consistent spacing between elements",
        "Ensure consistent treatment of all visual elements (line weights, corners, etc.)",
        "Create a refined final image that feels intentionally designed rather than accidentally simple"
      ],
      styleAdjective: "elegant, purposeful",
      styleNoun: "essence"
    };

    return createPromptFromTemplate(
      description, 
      themes, 
      "clean, minimalist",
      minimalistStylePrompt
    );
  };

  /**
   * Generates a detailed prompt for Cinematic Style thumbnails
   */
  const generateCinematicStylePrompt = (description: string, themes: ExtractedThemes): string => {
    const cinematicStylePrompt: PromptSection = {
      composition: [
        "Frame the scene with cinematic proportions that adapt to YouTube's format while suggesting a wider film aspect ratio",
        "Use cinematic principles of framing and composition that best complement the subject matter",
        "Create a sense of depth with distinct foreground, midground, and background elements",
        "Design with intentional perspective and sightlines that draw viewers into the scene"
      ],
      subjects: [
        "Present subjects with authentic emotional expressions that fit the narrative tone - prioritize nuanced, cinematically appropriate emotions",
        "Capture a compelling moment that suggests an entire story around it - avoid default shock expressions in favor of emotionally rich alternatives",
        "Consider spatial relationships between elements to suggest narrative connections",
        "Use body language, positioning, and expressions to convey depth of character and emotional complexity"
      ],
      visualTreatment: [
        "Apply professional-quality cinematic color grading appropriate to the content's genre",
        "Use atmospheric elements (like fog, light rays, particles) where they enhance the mood",
        "Implement thoughtful lighting that shapes subjects and creates appropriate atmosphere",
        "Consider film-inspired visual effects like subtle lens artifacts that enhance realism"
      ],
      storytelling: [
        "Frame a moment that implies a complete narrative and makes viewers want to see more",
        "Create visual intrigue suggesting an emotional or intellectual journey within the video",
        "Include thoughtful details that reward closer inspection and suggest production value",
        "Ensure the thumbnail conveys the genre and tone of the video's content"
      ],
      technical: [
        "Render with film-like quality including appropriate texture for the content",
        "Use thoughtful depth of field to direct attention to key elements",
        "Apply cinematic aspect ratio treatments that work within YouTube's container format",
        "Create an image with excellent dynamic range and shadow detail that works across devices"
      ],
      styleAdjective: "cinematically compelling",
      styleNoun: "story"
    };

    return createPromptFromTemplate(
      description, 
      themes, 
      "professional, cinematic",
      cinematicStylePrompt
    );
  };

  /**
   * Generates a detailed prompt for Clickbait Style thumbnails
   */
  const generateClickbaitStylePrompt = (description: string, themes: ExtractedThemes): string => {
    const clickbaitStylePrompt: PromptSection = {
      composition: [
        "Design with a bold, attention-grabbing layout that immediately draws the eye",
        "Organize elements to create maximum visual impact while remaining clear on different devices",
        "Use strategic empty space that accommodates text while keeping the main subject prominent",
        "Create a composition that stands out in YouTube's crowded recommendation feeds"
      ],
      subjects: [
        "Feature subjects with varied emotional expressions beyond just shock/surprise - use curiosity, amazement, focus, or enthusiasm",
        "Consider diverse poses and expressions that create interest without defaulting to the standard surprised open-mouth look",
        "Position subjects to break the fourth wall when appropriate, creating direct connection with natural expressions",
        "Use dynamic body language that suggests action, reaction, or authentic emotional response suited to the content"
      ],
      visualTreatment: [
        "Use bright, attention-grabbing colors that pop against YouTube's interface",
        "Apply strategic color contrast to emphasize key elements and create visual hierarchy",
        "Consider strategic graphic elements (arrows, highlights, etc.) where they enhance understanding",
        "Implement lighting that creates drama and directs attention to the most important elements"
      ],
      storytelling: [
        "Create a visual moment that generates immediate curiosity about what happens in the video",
        "Suggest something surprising, unexpected, or impressive that encourages clicking",
        "Balance engaging 'clickability' with authentic representation of the actual content",
        "Design to trigger viewer interest while accurately representing what they'll find in the video"
      ],
      technical: [
        "Render with high clarity and excellent detail that works at all YouTube display sizes",
        "Use subtle motion effects or dynamic elements where appropriate to suggest action",
        "Ensure perfect focus on the key emotional or narrative elements",
        "Create a polished final image with enhanced details that feels professionally produced"
      ],
      styleAdjective: "instantly intriguing",
      styleNoun: "curiosity"
    };

    return createPromptFromTemplate(
      description, 
      themes, 
      "attention-grabbing, engaging",
      clickbaitStylePrompt
    );
  };

  const handleCloseDetailsPanel = () => {
    // Add a small delay when closing to make the animation smoother
    setIsDetailsPanelOpen(false);
  };

  const handleChatSubmit = (prompt: string, thumbnailText?: string, textStyle?: string) => {
    // Update the video description
    onVideoDescriptionChange(prompt);
    
    // Only proceed with submission if a style is selected
      if (selectedThumbnailStyle) {
      // Use the updated description in a new event loop to ensure state is updated
      Promise.resolve().then(() => {
        // Pass the text and style parameters to handleSubmit
        handleSubmit(undefined, thumbnailText, textStyle);
      });
    }
  };

  const mainContentVariants = {
    visible: { 
      opacity: 1,
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 250, // Lower stiffness for smoother animation
        damping: 25,    // Adjusted damping
        duration: 0.4   // Slightly longer duration
      }
    },
    hidden: { 
      opacity: 0,
      x: -30, // Reduced slide distance
      transition: { 
        type: "spring", 
        stiffness: 250,
        damping: 25,
        duration: 0.3
      }
    }
  };

  const thumbnailStylePath = getThumbnailStylePath(selectedThumbnailStyle);

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {isDetailsPanelOpen && generatedData ? (
          <motion.div
            key="youtubePreview"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: "spring", stiffness: 250, damping: 25, duration: 0.4 }}
            className="w-full" // This will now occupy the resized main content area
          >
            <YouTubePreviewGrid
              thumbnailStyleImagePath={generatedData.thumbnail}
              title={generatedData.title}
              description={generatedData.description}
              tags={generatedData.tags}
              isGeneratingAiImage={isLoading}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="mainContent"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ 
              type: "spring",
              stiffness: 250,
              damping: 25,
              duration: 0.4
            }}
            className="w-full flex flex-col items-stretch gap-6"
          >
            <form onSubmit={handleSubmit}>
              <ThumbnailStyleSelector
                selectedStyle={selectedThumbnailStyle}
                onSelectStyle={onSelectStyle}
              />
              <div className="w-full flex flex-col items-start mt-6">
                <AIChatInput onSubmit={handleChatSubmit} /> 
              </div>
              <div className="w-full flex flex-col items-start mt-6">
                <VideoDescriptionInput 
                  value={videoDescription}
                  onChange={(e) => onVideoDescriptionChange(e.target.value)}
                  placeholder="Describe your video content..."
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  type="submit" 
                  className="w-full px-6 py-3 rounded-full font-medium bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={!videoDescription.trim() || !selectedThumbnailStyle || isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Video Content'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Video details panel remains fixed and will appear alongside the resized content */}
      <VideoDetailsPanel 
        isOpen={isDetailsPanelOpen} 
        onClose={handleCloseDetailsPanel}
        data={generatedData}
        isLoading={isLoading}
      />
    </div>
  );
} 