'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StyleSelectionForm } from "@/components/dashboard/studio/StyleSelectionForm";
import { GenerationResults } from "@/components/dashboard/studio/GenerationResults";
import { generateThumbnailPrompt } from '@/utils/prompt-generators';
import { toast } from "sonner";
import { checkUserCredits } from '@/utils/credit-utils';
import { ContentPolicyModal } from "@/components/ui/content-policy-modal";
import { GenerationPhase, GENERATION_PHASES } from "@/types/generation";

interface StudioViewProps {
  selectedThumbnailStyle: string | null;
  onSelectStyle: (style: string | null) => void;
  videoDescription: string;
  onVideoDescriptionChange: (value: string) => void;
  onDetailsPanelStateChange?: (isOpen: boolean) => void;
  onPrepareNewGeneration?: () => void;
  onInsufficientCredits?: () => void;
  onCreditsUsed?: () => void;
  onCloseDetailsPanel?: (closeFn: () => void) => void;
}

export function StudioView({
  selectedThumbnailStyle,
  onSelectStyle,
  videoDescription,
  onVideoDescriptionChange,
  onDetailsPanelStateChange,
  onPrepareNewGeneration,
  onInsufficientCredits,
  onCreditsUsed,
  onCloseDetailsPanel,
}: StudioViewProps) {
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [generatedData, setGeneratedData] = useState<{
    thumbnail: string;
    title: string;
    description: string;
    tags: string[];
  } | undefined>(undefined);
  
  // Replace isLoading with phase-based generation state
  const [generationPhase, setGenerationPhase] = useState<GenerationPhase | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // State for storing text overlay parameters for regeneration
  // Add real-time text overlay data state
  const [realTimeTextOverlayData, setRealTimeTextOverlayData] = useState<{
    thumbnailText?: string;
    textStyle?: string;
  }>({});

  // New state for content policy modal
  const [isContentPolicyModalOpen, setIsContentPolicyModalOpen] = useState(false);
  const [contentPolicyError, setContentPolicyError] = useState<{
    suggestions: string[];
    creditRefunded: boolean;
  } | null>(null);

  // Derived state for backwards compatibility
  const isLoading = generationPhase !== null;

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

  // Helper function to update generation phase and progress
  const setGenerationState = (phase: GenerationPhase | null) => {
    setGenerationPhase(phase);
    if (phase) {
      setGenerationProgress(GENERATION_PHASES[phase].progress);
    } else {
      setGenerationProgress(0);
    }
  };

  // Handle real-time text overlay data changes
  const handleTextOverlayDataChange = useCallback((data: { thumbnailText?: string; textStyle?: string }) => {
    setRealTimeTextOverlayData(data);
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent, thumbnailText?: string, textStyle?: string) => {
    if (e) e.preventDefault();
    if (videoDescription.trim() === '' || !selectedThumbnailStyle) return;

    // Check if user has sufficient credits
    const { hasCredits } = await checkUserCredits();
    if (!hasCredits) {
      if (onInsufficientCredits) {
        onInsufficientCredits();
      }
      return;
    }

    // Start generation process
    setGenerationState('initializing');
    
    // Variables to store the result data for saving
    let newImageUrl: string | null = null;
    let generatedTitle = '';
    let generatedDescription = videoDescription;
    let generatedTags: string[] = [];

    setGeneratedData({
      thumbnail: getThumbnailStylePath(selectedThumbnailStyle) || '', 
      title: `Generating thumbnail for: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
      description: videoDescription,
      tags: videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, '')),
    });
    setIsDetailsPanelOpen(true);

    try {
      // Phase 1: Generate thumbnail image
      setGenerationState('generating-thumbnail');
      
      // Generate a style-specific structured prompt for thumbnail, now with text overlay if provided
      const structuredPrompt = await generateThumbnailPrompt(
        videoDescription, 
        selectedThumbnailStyle, 
        thumbnailText, 
        textStyle
      );

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
        
        // Handle specific error types
        if (errorData.error === 'CONTENT_POLICY_VIOLATION') {
          setContentPolicyError({
            suggestions: errorData.details?.suggestions || [],
            creditRefunded: errorData.creditRefunded || false
          });
          setIsContentPolicyModalOpen(true);
          setIsDetailsPanelOpen(false);
          
          // Refresh credits since they were refunded
          if (onCreditsUsed && errorData.creditRefunded) {
            onCreditsUsed();
          }
          
          return;
        }
        
        // Handle other API errors with user-friendly messages
        let userFriendlyMessage = '';
        if (errorData.error === 'OPENAI_API_ERROR') {
          userFriendlyMessage = errorData.message || 'Failed to generate thumbnail due to an API error. Your credit has been refunded.';
        } else if (errorData.error === 'IMAGE_GENERATION_FAILED') {
          userFriendlyMessage = errorData.message || 'Image generation completed but no image data was returned. Your credit has been refunded.';
        } else if (errorData.error === 'INTERNAL_SERVER_ERROR') {
          userFriendlyMessage = errorData.message || 'An unexpected error occurred while generating your thumbnail. Your credit has been refunded.';
        } else {
          userFriendlyMessage = errorData.message || errorData.error || 'Failed to generate image';
        }
        
        // Show toast notification for refunded credits
        if (errorData.creditRefunded) {
          toast.success("Credit refunded", {
            description: "Your credit has been automatically refunded due to the error."
          });
          
          // Refresh credits display
          if (onCreditsUsed) {
            onCreditsUsed();
          }
        }
        
        throw new Error(userFriendlyMessage);
      }

      const thumbnailResult = await thumbnailResponse.json();
      newImageUrl = thumbnailResult.imageUrl;
      
      // Refresh credits after successful generation
      if (onCreditsUsed) {
        onCreditsUsed();
      }

      // Phase 2: Generate content
      setGenerationState('generating-content');

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
        
        // Set fallback data
        generatedTitle = basicTitle;
        generatedDescription = videoDescription;
        generatedTags = basicTags.length > 0 ? basicTags : ['video', 'content', 'youtube'];
        
        setGeneratedData({
          thumbnail: newImageUrl || getThumbnailStylePath(selectedThumbnailStyle) || '', // Use newImageUrl
          title: generatedTitle,
          description: generatedDescription,
          tags: generatedTags,
        });
      } else {
        const contentResult = await contentResponse.json();
        
        if (contentResult.success && contentResult.titles && contentResult.descriptions && contentResult.tags) {
          const bestTitleIndex = contentResult.bestTitle >= 0 && contentResult.bestTitle < contentResult.titles.length 
            ? contentResult.bestTitle 
            : 0;
          const bestDescriptionIndex = contentResult.bestDescription >= 0 && contentResult.bestDescription < contentResult.descriptions.length 
            ? contentResult.bestDescription 
            : 0;
          
          generatedTitle = contentResult.titles[bestTitleIndex];
          generatedDescription = contentResult.descriptions[bestDescriptionIndex];
          generatedTags = contentResult.tags;
              
          setGeneratedData({
            thumbnail: newImageUrl || getThumbnailStylePath(selectedThumbnailStyle) || '', // Use newImageUrl
            title: generatedTitle,
            description: generatedDescription,
            tags: generatedTags,
          });
        } else {
          // Fallback if content generation API returns success: false
          const styleName = selectedThumbnailStyle.replace('-style', '');
          generatedTitle = `${styleName} Video: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`;
          generatedDescription = videoDescription;
          generatedTags = videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, ''));
          
          setGeneratedData({
            thumbnail: newImageUrl || getThumbnailStylePath(selectedThumbnailStyle) || '', // Use newImageUrl
            title: generatedTitle,
            description: generatedDescription,
            tags: generatedTags,
          });
        }
      }

      // Phase 3: Finalizing
      setGenerationState('finalizing');

      // Save the project to database
      if (newImageUrl && generatedTitle && generatedDescription && generatedTags) {
        try {
          const saveResponse = await fetch('/api/save-project', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageUrl: newImageUrl,
              selectedStyleId: selectedThumbnailStyle,
              generatedTitle,
              generatedDescription,
              generatedTags,
            }),
          });

          if (!saveResponse.ok) {
            const errorData = await saveResponse.json();
            console.warn('Failed to save project:', errorData.error);
            toast.error('Project generated but failed to save. You can still download your thumbnail.');
          } else {
            await saveResponse.json();
            toast.success("Project saved successfully!");
          }
        } catch (saveError) {
          console.error('Error saving project:', saveError);
          toast.error('Project generated but failed to save. You can still download your thumbnail.');
        }
      }

      // Complete generation
      setGenerationState(null);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error("Error during content generation:", errorMessage);
      
      setGeneratedData({
        thumbnail: getThumbnailStylePath(selectedThumbnailStyle) || '',
        title: `Error - ${selectedThumbnailStyle}: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
        description: videoDescription,
        tags: videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, '')),
      });

      setGenerationState(null);
      toast.error(errorMessage);
    }
  }, [videoDescription, selectedThumbnailStyle, onInsufficientCredits, onCreditsUsed]);

  // Handle regeneration of a new image using current settings
  const handleRegenerateImage = async () => {
    if (!generatedData || !selectedThumbnailStyle) return;

    // Check if user has sufficient credits
    const { hasCredits } = await checkUserCredits();
    if (!hasCredits) {
      if (onInsufficientCredits) {
        onInsufficientCredits();
      }
      return;
    }

    // Start the generation state for image regeneration
    setGenerationState('generating-thumbnail');
    let newImageUrl: string | null = null;

    try {
      // Generate a new prompt for image regeneration using real-time text overlay data
      const structuredPrompt = await generateThumbnailPrompt(
        videoDescription, 
        selectedThumbnailStyle,
        realTimeTextOverlayData.thumbnailText,  // Use real-time data
        realTimeTextOverlayData.textStyle       // Use real-time data
      );

      // Call the generate-thumbnail API
      const thumbnailResponse = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: structuredPrompt }),
      });

      if (!thumbnailResponse.ok) {
        const errorData = await thumbnailResponse.json();
        
        // Handle specific error types
        if (errorData.error === 'CONTENT_POLICY_VIOLATION') {
          setContentPolicyError({
            suggestions: errorData.details?.suggestions || [],
            creditRefunded: errorData.creditRefunded || false
          });
          setIsContentPolicyModalOpen(true);
          
          // Refresh credits since they were refunded
          if (onCreditsUsed && errorData.creditRefunded) {
            onCreditsUsed();
          }
          
          return;
        }
        
        // Handle other API errors
        let userFriendlyMessage = '';
        if (errorData.error === 'OPENAI_API_ERROR') {
          userFriendlyMessage = errorData.message || 'Failed to regenerate thumbnail due to an API error. Your credit has been refunded.';
        } else if (errorData.error === 'IMAGE_GENERATION_FAILED') {
          userFriendlyMessage = errorData.message || 'Image regeneration completed but no image data was returned. Your credit has been refunded.';
        } else if (errorData.error === 'INTERNAL_SERVER_ERROR') {
          userFriendlyMessage = errorData.message || 'An unexpected error occurred while regenerating your thumbnail. Your credit has been refunded.';
        } else {
          userFriendlyMessage = errorData.message || errorData.error || 'Failed to regenerate image';
        }
        
        // Show toast notification for refunded credits
        if (errorData.creditRefunded) {
          toast.success("Credit refunded", {
            description: "Your credit has been automatically refunded due to the error."
          });
          
          // Refresh credits display
          if (onCreditsUsed) {
            onCreditsUsed();
          }
        }
        
        throw new Error(userFriendlyMessage);
      }

      const thumbnailResult = await thumbnailResponse.json();
      newImageUrl = thumbnailResult.imageUrl;
      
      // Refresh credits after successful generation
      if (onCreditsUsed) {
        onCreditsUsed();
      }

      // Update ONLY the thumbnail in the generated data, keep everything else the same
      const updatedData = { ...generatedData };
      const updatePayload = { 
        imageUrl: newImageUrl,
        selectedStyleId: selectedThumbnailStyle 
      };
      updatedData.thumbnail = newImageUrl || updatedData.thumbnail;
      setGeneratedData(updatedData);
      setGenerationState(null);

      // Update only the thumbnail in the database, don't re-save other content
      if (newImageUrl) {
        try {
          const response = await fetch('/api/update-project-thumbnail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatePayload),
          });

          if (!response.ok) {
            console.warn('Failed to update thumbnail in database');
          } else {
            toast.success('Thumbnail updated successfully!');
          }
        } catch (error) {
          console.error('Failed to update thumbnail in database:', error);
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during image regeneration';
      console.error("Error during image regeneration:", errorMessage);
      setGenerationState(null); // Make sure to end loading state in case of error too
    }
  };

  // Handle regeneration of specific content types
  const handleRegenerateContent = async (contentType: 'titles' | 'descriptions' | 'tags') => {
    if (!selectedThumbnailStyle || !generatedData) return;
    
    // Don't set global generation state for content regeneration
    // Let individual components handle their own loading states
    
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
        const updatedData = { ...generatedData };
        const updatePayload: Record<string, unknown> = { selectedStyleId: selectedThumbnailStyle };

        // Update only the specific content type that was regenerated
        if (contentType === 'titles' && contentResult.titles && contentResult.titles.length > 0) {
          // Get best title or default to first one
          const bestTitleIndex = contentResult.bestTitle >= 0 && contentResult.bestTitle < contentResult.titles.length 
            ? contentResult.bestTitle 
            : 0;
            
          updatedData.title = contentResult.titles[bestTitleIndex];
          updatePayload.generatedTitle = updatedData.title;
          
        } else if (contentType === 'descriptions' && contentResult.descriptions && contentResult.descriptions.length > 0) {
          // Get best description or default to first one
          const bestDescriptionIndex = contentResult.bestDescription >= 0 && contentResult.bestDescription < contentResult.descriptions.length 
            ? contentResult.bestDescription 
            : 0;
            
          updatedData.description = contentResult.descriptions[bestDescriptionIndex];
          updatePayload.generatedDescription = updatedData.description;
          
        } else if (contentType === 'tags' && contentResult.tags && contentResult.tags.length > 0) {
          updatedData.tags = contentResult.tags;
          updatePayload.generatedTags = updatedData.tags.join(',');
        }

        // Update the state with the new data
        setGeneratedData(updatedData);

        // Update only the specific content in the database
        try {
          const response = await fetch('/api/update-project-content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatePayload),
          });

          if (!response.ok) {
            console.warn(`Failed to update ${contentType} in database`);
          } else {
            toast.success(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} updated successfully!`);
          }
        } catch (error) {
          console.error(`Failed to update ${contentType} in database:`, error);
        }
      } else {
        console.warn(`Regeneration of ${contentType} returned success: false`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error(`Error regenerating ${contentType}:`, errorMessage);
    }
    // No need to reset global generation state since we're not setting it
  };

  const handleCloseDetailsPanel = useCallback(() => {
    setIsDetailsPanelOpen(false);
    if (onPrepareNewGeneration) {
      onPrepareNewGeneration();
    }
  }, [onPrepareNewGeneration]);

  const handleChatSubmit = useCallback((prompt: string, thumbnailText?: string, textStyle?: string) => {
    // Update the video description first
    onVideoDescriptionChange(prompt);
    
    // Store current text overlay data for potential use
    setRealTimeTextOverlayData({
      thumbnailText,
      textStyle,
    });
    
    // Only proceed with submission if a style is selected
    if (selectedThumbnailStyle) {
      // Use a timeout to ensure the video description state is updated
      setTimeout(() => {
        handleSubmit(undefined, thumbnailText, textStyle);
      }, 0);
    }
  }, [selectedThumbnailStyle, onVideoDescriptionChange, handleSubmit]);

  const handleContentPolicyRetry = async () => {
    setIsContentPolicyModalOpen(false);
    setContentPolicyError(null);
    // Trigger a new generation attempt
    await handleSubmit();
  };

  const handleContentPolicyClose = () => {
    setIsContentPolicyModalOpen(false);
    setContentPolicyError(null);
  };

  // Notify parent component when details panel state changes
  useEffect(() => {
    if (onDetailsPanelStateChange) {
      onDetailsPanelStateChange(isDetailsPanelOpen);
    }
  }, [isDetailsPanelOpen, onDetailsPanelStateChange]);

  // Register the close function with parent component
  useEffect(() => {
    if (onCloseDetailsPanel) {
      onCloseDetailsPanel(handleCloseDetailsPanel);
    }
  }, [onCloseDetailsPanel, handleCloseDetailsPanel]);

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {isDetailsPanelOpen && generatedData ? (
          <GenerationResults
            isOpen={isDetailsPanelOpen}
            onClose={handleCloseDetailsPanel}
            data={generatedData}
            generationPhase={generationPhase}
            generationProgress={generationProgress}
            onRegenerate={handleRegenerateContent}
            onRegenerateImage={handleRegenerateImage}
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
            onTextOverlayDataChange={handleTextOverlayDataChange}
          />
        )}
      </AnimatePresence>
      
      {/* Content Policy Modal */}
      <ContentPolicyModal
        isOpen={isContentPolicyModalOpen}
        onClose={handleContentPolicyClose}
        onRetry={handleContentPolicyRetry}
        suggestions={contentPolicyError?.suggestions}
        creditRefunded={contentPolicyError?.creditRefunded}
      />
    </div>
  );
} 