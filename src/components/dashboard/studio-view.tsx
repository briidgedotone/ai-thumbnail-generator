'use client';

import React, { useState, useEffect } from 'react';
import { ThumbnailStyleSelector } from "@/components/dashboard/thumbnail-style-selector";
import { AIChatInput } from "@/components/dashboard/ai-chat-input";
import { VideoDescriptionInput } from "@/components/dashboard/video-description-input";
import { VideoDetailsPanel } from "@/components/dashboard/video-details-panel";
import { YouTubePreviewGrid } from "@/components/dashboard/youtube-preview-grid";
import { motion, AnimatePresence } from 'framer-motion';

interface StudioViewProps {
  selectedThumbnailStyle: string | null;
  onSelectStyle: (style: string | null) => void;
  videoDescription: string;
  onVideoDescriptionChange: (value: string) => void;
  onDetailsPanelStateChange?: (isOpen: boolean) => void;
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

  const handleSubmit = async (e?: React.FormEvent) => {
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

    // Generate a style-specific structured prompt
    const structuredPrompt = generateThumbnailPrompt(videoDescription, selectedThumbnailStyle);
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
   * Generates a structured, detailed prompt for thumbnail generation based on the video description and selected style
   */
  const generateThumbnailPrompt = (description: string, style: string): string => {
    // Extract key subjects and themes from the description
    const keyThemes = extractKeyThemes(description);
    
    switch(style) {
      case 'beast-style':
        return generateBeastStylePrompt(description, keyThemes);
      case 'minimalist-style':
        return generateMinimalistStylePrompt(description, keyThemes);
      case 'cinematic-style':
        return generateCinematicStylePrompt(description, keyThemes);
      case 'clickbait-style':
        return generateClickbaitStylePrompt(description, keyThemes);
      default:
        return generateBeastStylePrompt(description, keyThemes); // Default to beast style
    }
  };

  /**
   * Extracts key themes, subjects, and elements from the video description
   */
  const extractKeyThemes = (description: string): {
    mainSubject: string;
    action: string;
    setting: string;
    mood: string;
  } => {
    // This is a simple implementation - in a production app, you might use NLP or more sophisticated parsing
    const words = description.toLowerCase().split(/\s+/);
    
    // Extract potential subjects (nouns)
    const subjects = words.filter(word => 
      !['the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'in', 'on', 'at', 'to', 'from'].includes(word)
    );
    
    return {
      mainSubject: subjects[0] || 'person',
      action: subjects[1] || 'demonstrating',
      setting: subjects[2] || 'environment',
      mood: description.includes('exciting') || description.includes('amazing') ? 'excited' : 
            description.includes('calm') || description.includes('peaceful') ? 'calm' : 'intense'
    };
  };

  /**
   * Generates a detailed prompt for Beast Style thumbnails following specific format guidelines
   */
  const generateBeastStylePrompt = (description: string, themes: any): string => {
    return `Create a hyper-realistic, ultra high-definition YouTube thumbnail for a video about: "${description}"

COMPOSITION:
- Use rule of thirds with the main subject positioned for maximum impact
- Create depth with foreground subjects sharply detailed against a slightly blurred background
- Ensure clean, uncluttered composition that immediately draws the eye to key elements
- Create visual tension and energy through dynamic positioning of elements

SUBJECTS & EXPRESSIONS:
- Feature subjects with exaggerated, intense facial expressions showing extreme emotion
- Emphasize wide eyes, open mouths, or expressions of shock/excitement/determination
- Add details like sweat, dirt, or texture that enhance realism and intensity
- Position subjects in dynamic, mid-action poses that suggest movement and energy

VISUAL TREATMENT:
- Use extremely saturated, vibrant colors with high contrast combinations
- Implement dramatic lighting with bold highlights and deep shadows
- Add rim lighting to separate subjects clearly from backgrounds
- Create a color palette that evokes intensity: electric blues, vibrant greens, fiery reds

STORYTELLING ELEMENTS:
- Capture a "one-second story" that instantly communicates high stakes or drama
- Include subtle mystery elements or visual questions that provoke curiosity
- Suggest conflict, challenge, or extraordinary circumstances
- Make the image scream "YOU HAVE TO CLICK THIS!"

TECHNICAL SPECIFICATIONS:
- Render in extremely high definition with crisp, sharp details
- Add subtle effects like light flares or particles to enhance production value
- Ensure high contrast ratio between elements for maximum visual impact
- Create a polished, professional final image with clean edges and defined surfaces

The thumbnail should be eye-catching, somewhat over-the-top, and instantly communicate the excitement of: "${description}"`;
  };

  /**
   * Generates a detailed prompt for Minimalist Style thumbnails
   */
  const generateMinimalistStylePrompt = (description: string, themes: any): string => {
    return `Create a clean, minimalist YouTube thumbnail for a video about: "${description}"

COMPOSITION:
- Use generous negative space to create a calm, focused composition
- Place minimal elements with intentional, precise positioning
- Follow principles of balance and simplicity with careful alignment
- Employ subtle asymmetry to create visual interest without clutter

SUBJECTS & EXPRESSIONS:
- Feature a single, iconic representation of the main subject
- If including people, show neutral or subtle expressions rather than exaggerated ones
- Use simplified shapes and forms that represent the subject's essence
- Avoid busy details in favor of clean, recognizable silhouettes

VISUAL TREATMENT:
- Apply a restrained color palette of 2-4 colors maximum
- Use flat, solid color areas rather than complex gradients
- Incorporate subtle textures only where necessary for depth
- Employ high contrast between foreground and background elements

STORYTELLING ELEMENTS:
- Communicate the concept through elegant symbolism rather than literal representation
- Use visual metaphors that distill the video's message to its essence
- Create intrigue through what is left out rather than what is shown
- Design the image to appeal to a sophisticated, thoughtful audience

TECHNICAL SPECIFICATIONS:
- Render with crisp, clean edges and perfect geometry
- Use precise alignment and mathematical spacing between elements
- Ensure consistent line weights and shape treatment throughout
- Create a polished final image that feels intentional and designed rather than photographed

The thumbnail should be elegant, sophisticated, and instantly communicate the essence of: "${description}"`;
  };

  /**
   * Generates a detailed prompt for Cinematic Style thumbnails
   */
  const generateCinematicStylePrompt = (description: string, themes: any): string => {
    return `Create a professional, cinematic YouTube thumbnail for a video about: "${description}"

COMPOSITION:
- Use widescreen, film-like framing with letterbox aesthetics
- Implement the cinematic rule of thirds with strategic subject placement
- Create multiple layers of depth with foreground, midground, and background elements
- Design with dramatic perspective and sightlines that draw the viewer in

SUBJECTS & EXPRESSIONS:
- Feature subjects with nuanced, emotional expressions that tell a story
- Capture the "decisive moment" that suggests what happened before and after
- Position characters in relation to each other to suggest narrative
- Use posture and body language to convey tension or emotional states

VISUAL TREATMENT:
- Apply cinematic color grading with complementary color theory (teal/orange works well)
- Create atmospheric elements like fog, smoke, or light rays for depth
- Use dramatic, directional lighting that creates mood and shapes subjects
- Include subtle lens effects like bokeh, flares, or vignetting

STORYTELLING ELEMENTS:
- Suggest a complete narrative moment that makes viewers want to know more
- Create visual intrigue that promises an emotional or intellectual journey
- Include subtle details that reward closer inspection
- Make the image feel like a still from a high-budget film production

TECHNICAL SPECIFICATIONS:
- Render with film-like quality including subtle grain texture
- Implement perfect depth of field with foreground/background separation
- Add cinematic aspect ratio framing (2.35:1 or similar widescreen format)
- Create a polished final image with excellent dynamic range and shadow detail

The thumbnail should look like a frame from a professional film and instantly communicate the drama of: "${description}"`;
  };

  /**
   * Generates a detailed prompt for Clickbait Style thumbnails
   */
  const generateClickbaitStylePrompt = (description: string, themes: any): string => {
    return `Create an attention-grabbing, clickbait YouTube thumbnail for a video about: "${description}"

COMPOSITION:
- Design with bold visual hierarchy that immediately communicates excitement
- Use asymmetrical composition with strategic empty space for text (though don't add text)
- Position elements to create maximum impact and visual surprise
- Create a layout that feels energetic, immediate, and slightly chaotic

SUBJECTS & EXPRESSIONS:
- Feature subjects with extremely exaggerated emotions - shock, surprise, excitement
- Include open-mouthed expressions, wide eyes, and pointing gestures
- Position subjects to break the fourth wall, looking or pointing directly at viewer
- Use body language that suggests something amazing just happened or is about to happen

VISUAL TREATMENT:
- Apply oversaturated, candy-colored palette with high contrast
- Add subtle graphic elements like arrows, circles, or highlight effects
- Use bright, flat lighting that shows everything clearly
- Incorporate slight warping or exaggeration effects for added impact

STORYTELLING ELEMENTS:
- Create a "what just happened?!" moment that demands investigation
- Suggest extreme consequences, unexpected revelations, or dramatic discoveries
- Design to trigger curiosity, FOMO, or emotional response
- Make the viewer feel they absolutely must know what happens next

TECHNICAL SPECIFICATIONS:
- Render with crystal clarity and maximum brightness
- Add subtle motion-blur elements to suggest action and excitement
- Use perfectly sharp focus on key emotional elements like faces
- Create a hyper-real final image with slightly enhanced textures and details

The thumbnail should be irresistibly clickable and instantly make viewers need to know more about: "${description}"`;
  };

  const handleCloseDetailsPanel = () => {
    // Add a small delay when closing to make the animation smoother
    setIsDetailsPanelOpen(false);
  };

  const handleChatSubmit = (prompt: string, thumbnailText?: string, textStyle?: string) => {
    onVideoDescriptionChange(prompt);
    setTimeout(() => {
      if (selectedThumbnailStyle) {
        handleSubmit();
      }
    }, 100);
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