'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StyleSelectionForm } from "@/components/dashboard/studio/StyleSelectionForm";
import { GenerationResults } from "@/components/dashboard/studio/GenerationResults";
import { generateThumbnailPrompt } from '@/utils/prompt-generators';

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
  React.useEffect(() => {
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
      thumbnail: getThumbnailStylePath(selectedThumbnailStyle) || '', // Use empty string if no image path yet, Image component will handle onError or show alt
      title: `Generating prompt for: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
      description: videoDescription,
      tags: videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, '')),
    });
    setIsDetailsPanelOpen(true); // Open panel so it can show its loading state

    let newImageUrl: string | null = null; // Variable to hold the newly generated image URL

    try {
      // Generate a style-specific structured prompt for thumbnail, now with text overlay if provided
      const structuredPrompt = await generateThumbnailPrompt(
        videoDescription, 
        selectedThumbnailStyle, 
        thumbnailText, 
        textStyle
      );
      console.log('[TESTING - Structured Prompt from Gemini]', structuredPrompt); // Log for debugging

      // First, generate the thumbnail image
      const thumbnailResponse = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: structuredPrompt }),
      });

      if (!thumbnailResponse.ok) {
        const errorData = await thumbnailResponse.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const thumbnailResult = await thumbnailResponse.json();
      newImageUrl = thumbnailResult.imageUrl; // Store the new image URL
      setAiGeneratedImageUrl(newImageUrl); // Update state as well

      // Then, generate optimized content (titles, descriptions, tags)
      const contentResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          videoDescription, 
          style: selectedThumbnailStyle 
        }),
      });

      if (!contentResponse.ok) {
        const errorData = await contentResponse.json();
        console.warn('Failed to generate optimized content:', errorData.error || contentResponse.statusText);
        
        const styleName = selectedThumbnailStyle.replace('-style', '');
        const basicTitle = `${styleName} Video: ${videoDescription.slice(0, 40)}${videoDescription.length > 40 ? '...' : ''}`;
        const basicTags = videoDescription
          .split(/\s+/)
          .filter(word => word.length > 3)
          .slice(0, 8)
          .map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, ''))
          .filter(Boolean);
        
        setGeneratedData({
          thumbnail: newImageUrl || getThumbnailStylePath(selectedThumbnailStyle) || '', // Use newImageUrl
          title: basicTitle,
          description: videoDescription,
          tags: basicTags.length > 0 ? basicTags : ['video', 'content', 'youtube'],
        });
        return;
      }

      const contentResult = await contentResponse.json();
      
      if (contentResult.success && contentResult.titles && contentResult.descriptions && contentResult.tags) {
        const bestTitleIndex = contentResult.bestTitle >= 0 && contentResult.bestTitle < contentResult.titles.length 
          ? contentResult.bestTitle 
          : 0;
        const bestDescriptionIndex = contentResult.bestDescription >= 0 && contentResult.bestDescription < contentResult.descriptions.length 
          ? contentResult.bestDescription 
          : 0;
          
        setGeneratedData({
          thumbnail: newImageUrl || getThumbnailStylePath(selectedThumbnailStyle) || '', // Use newImageUrl
          title: contentResult.titles[bestTitleIndex],
          description: contentResult.descriptions[bestDescriptionIndex],
          tags: contentResult.tags,
        });
      } else {
        const styleName = selectedThumbnailStyle.replace('-style', '');
      setGeneratedData({
          thumbnail: newImageUrl || getThumbnailStylePath(selectedThumbnailStyle) || '', // Use newImageUrl
          title: `${styleName} Video: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
        description: videoDescription,
        tags: videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, '')),
      });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error("Error during content generation:", errorMessage);
      setError(errorMessage);
      setGeneratedData({
        thumbnail: newImageUrl || getThumbnailStylePath(selectedThumbnailStyle) || '', // Use newImageUrl if available, then style path, then empty
        title: `Error - ${selectedThumbnailStyle}: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
        description: videoDescription,
        tags: videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, '')),
      });
      // setAiGeneratedImageUrl(null); // Already set to null at the start, or to newImageUrl if successful before error
    } finally {
      setIsLoading(false);
    }
  };

  // Handle regeneration of specific content types
  const handleRegenerateContent = async (contentType: 'titles' | 'descriptions' | 'tags') => {
    if (!selectedThumbnailStyle || !generatedData) return;
    
    try {
      // Call the API with the specific content type to regenerate
      const contentResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoDescription, 
          style: selectedThumbnailStyle,
          contentType: contentType // Specify which content type to regenerate
        }),
      });

      if (!contentResponse.ok) {
        const errorData = await contentResponse.json();
        console.warn(`Failed to regenerate ${contentType}:`, errorData.error || contentResponse.statusText);
        return;
      }

      const contentResult = await contentResponse.json();
      
      if (contentResult.success) {
        // Update only the specific content type that was regenerated
        if (contentType === 'titles' && contentResult.titles && contentResult.titles.length > 0) {
          // Get best title or default to first one
          const bestTitleIndex = contentResult.bestTitle >= 0 && contentResult.bestTitle < contentResult.titles.length 
            ? contentResult.bestTitle 
            : 0;
            
          setGeneratedData({
            ...generatedData,
            title: contentResult.titles[bestTitleIndex]
          });
        } else if (contentType === 'descriptions' && contentResult.descriptions && contentResult.descriptions.length > 0) {
          // Get best description or default to first one
          const bestDescriptionIndex = contentResult.bestDescription >= 0 && contentResult.bestDescription < contentResult.descriptions.length 
            ? contentResult.bestDescription 
            : 0;
            
          setGeneratedData({
            ...generatedData,
            description: contentResult.descriptions[bestDescriptionIndex]
          });
        } else if (contentType === 'tags' && contentResult.tags && contentResult.tags.length > 0) {
          setGeneratedData({
            ...generatedData,
            tags: contentResult.tags
          });
        }
      } else {
        console.warn(`Regeneration of ${contentType} returned success: false`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error(`Error regenerating ${contentType}:`, errorMessage);
    }
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

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {isDetailsPanelOpen && generatedData ? (
          <GenerationResults
            isOpen={isDetailsPanelOpen}
            onClose={handleCloseDetailsPanel}
            data={generatedData}
            isLoading={isLoading}
            onRegenerate={handleRegenerateContent}
          />
        ) : (
          <StyleSelectionForm
            selectedThumbnailStyle={selectedThumbnailStyle}
                onSelectStyle={onSelectStyle}
            videoDescription={videoDescription}
            onVideoDescriptionChange={onVideoDescriptionChange}
            onSubmit={handleSubmit}
            onChatSubmit={handleChatSubmit}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 