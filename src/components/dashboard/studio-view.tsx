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

    // Construct the prompt
    const prompt = `Create a high-quality YouTube thumbnail for a video about: "${videoDescription}".

Style: ${selectedThumbnailStyle.replace('-style', '')}
Resolution: 1024x1024
Purpose: Attract viewers and increase click-through rate

Design requirements:
- Create a visually striking, eye-catching composition with bold colors
- Include relevant imagery that represents the video topic
- Maintain clear visual hierarchy with a focal point
- Ensure any text or elements are easily readable at small sizes
- Use dramatic lighting and depth to create visual interest
- Make it look professional and polished
- Avoid cluttered compositions - keep it clean but impactful

The thumbnail should look professional, be visually appealing, and make viewers want to click.`;

    try {
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
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
        title: `${selectedThumbnailStyle} Video: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
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