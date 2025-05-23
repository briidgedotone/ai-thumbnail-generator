'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StyleSelectionForm } from "@/components/dashboard/studio/StyleSelectionForm";
import { GenerationResults } from "@/components/dashboard/studio/GenerationResults";
import { generateThumbnailPrompt } from '@/utils/prompt-generators';
import { toast } from "sonner";
import { checkUserCredits } from '@/utils/credit-utils';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles as GenerateIcon, UploadCloud as UploadIcon, Palette, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTextareaResize } from "@/hooks/use-textarea-resize";
import { createSupabaseClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
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
}: StudioViewProps) {
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [generatedData, setGeneratedData] = useState<{
    thumbnail: string;
    title: string;
    description: string;
    tags: string[];
  } | undefined>(undefined);
  const [aiGeneratedImageUrl, setAiGeneratedImageUrl] = useState<string | null>(null);
  
  // Replace isLoading with phase-based generation state
  const [generationPhase, setGenerationPhase] = useState<GenerationPhase | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  const [error, setError] = useState<string | null>(null);
  // State for storing text overlay parameters for regeneration
  const [currentThumbnailText, setCurrentThumbnailText] = useState<string | undefined>(undefined);
  const [currentTextStyle, setCurrentTextStyle] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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

  // Test mode - simulates generation without API calls
  const runTestGeneration = async () => {
    console.log('🧪 Running test generation mode - no credits will be used!');
    
    setGenerationState('initializing');
    setError(null);
    setAiGeneratedImageUrl(null);
    
    // Mock data for testing
    const mockThumbnailUrl = getThumbnailStylePath(selectedThumbnailStyle) || '/thumbnail-styles/01-beast-style.png';
    const styleName = selectedThumbnailStyle?.replace('-style', '').replace('-', ' ') || 'Test';
    const mockTitle = `${styleName.charAt(0).toUpperCase() + styleName.slice(1)} Style: ${videoDescription.slice(0, 40)}${videoDescription.length > 40 ? '...' : ''}`;
    const mockDescription = `This is a test description for "${videoDescription}". In this amazing video, we explore the fascinating world of content creation and thumbnail design. Perfect for testing our new loading states!`;
    const mockTags = ['test', 'mockdata', 'youtube', 'thumbnail', 'content'];

    // Set initial placeholder data
    setGeneratedData({
      thumbnail: mockThumbnailUrl,
      title: `Generating content for: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
      description: videoDescription,
      tags: videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean),
    });
    setIsDetailsPanelOpen(true);

    try {
      // Phase 1: Initializing (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Phase 2: Generating thumbnail (2 seconds)
      setGenerationState('generating-thumbnail');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update with thumbnail
      setGeneratedData(prev => prev ? {
        ...prev,
        thumbnail: mockThumbnailUrl,
        title: 'Generating optimized content...'
      } : undefined);
      
      // Phase 3: Generating content (1.5 seconds)
      setGenerationState('generating-content');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update with content
      setGeneratedData(prev => prev ? {
        ...prev,
        title: mockTitle,
        description: mockDescription,
        tags: mockTags
      } : undefined);
      
      // Phase 4: Finalizing (0.5 seconds)
      setGenerationState('finalizing');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Complete generation
      setGenerationState(null);
      
      toast.success('🧪 Test generation completed!', {
        description: 'This was a mock generation - no credits were used.'
      });
      
    } catch (error) {
      console.error('Test generation error:', error);
      setGenerationState(null);
      toast.error('Test generation failed');
    }
  };

  // Check if we should use test mode (when in development or with a special flag)
  const shouldUseTestMode = process.env.NODE_ENV === 'development' && videoDescription.toLowerCase().includes('test');

  // Notify parent component when details panel state changes
  React.useEffect(() => {
    if (onDetailsPanelStateChange) {
      onDetailsPanelStateChange(isDetailsPanelOpen);
    }
  }, [isDetailsPanelOpen, onDetailsPanelStateChange]);

  const handleSubmit = async (e?: React.FormEvent, thumbnailText?: string, textStyle?: string) => {
    if (e) e.preventDefault();
    if (videoDescription.trim() === '' || !selectedThumbnailStyle) return;

    // Use test mode if conditions are met
    if (shouldUseTestMode) {
      await runTestGeneration();
      return;
    }

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
    setError(null);
    setAiGeneratedImageUrl(null);
    
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
      newImageUrl = thumbnailResult.imageUrl; // Store the new image URL
      setAiGeneratedImageUrl(newImageUrl); // Update state as well

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

      // Complete generation
      setGenerationState(null);

      // Save the project in the background
      if (newImageUrl) {
        saveProject(
          newImageUrl,
          generatedTitle,
          generatedDescription,
          generatedTags.join(',')
        ).catch(error => {
          console.error('Background project save failed:', error);
          toast.error(`Failed to save project in background: ${error.message}`);
        });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error("Error during content generation:", errorMessage);
      setError(errorMessage);
      
      setGeneratedData({
        thumbnail: getThumbnailStylePath(selectedThumbnailStyle) || '',
        title: `Error - ${selectedThumbnailStyle}: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
        description: videoDescription,
        tags: videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, '')),
      });
      setAiGeneratedImageUrl(null);
      setGenerationState(null);
    }
  };

  // New function to save the project to the database
  const saveProject = async (
    imageUrl: string, 
    title: string, 
    description: string, 
    tags: string
  ) => {
    if (!imageUrl || !selectedThumbnailStyle) return;
    
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/save-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          selectedStyleId: selectedThumbnailStyle,
          generatedTitle: title,
          generatedDescription: description,
          generatedTags: tags
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save project');
      }

      const result = await response.json();
      setIsSaved(true);
      toast.success('Project saved successfully!');
      console.log('Project saved:', result);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error saving project:', errorMessage);
      toast.error(`Failed to save project: ${errorMessage}`);
    } finally {
      setIsSaving(false);
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
    setIsDetailsPanelOpen(false);
    if (onPrepareNewGeneration) {
      onPrepareNewGeneration();
    }
  };

  const handleChatSubmit = (prompt: string, thumbnailText?: string, textStyle?: string) => {
    // Update the video description
    onVideoDescriptionChange(prompt);
    
    // Store text overlay params for potential regeneration when chat initiates submission
    setCurrentThumbnailText(thumbnailText);
    setCurrentTextStyle(textStyle);

    // Only proceed with submission if a style is selected
    if (selectedThumbnailStyle) {
      // Use the updated description in a new event loop to ensure state is updated
      Promise.resolve().then(() => {
        // Pass the text and style parameters to handleSubmit
        handleSubmit(undefined, thumbnailText, textStyle);
      });
    }
  };

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

    setGenerationState(null);
    setError(null);
    let newImageUrl: string | null = null;

    try {
      // Generate a new prompt for image regeneration
      const structuredPrompt = await generateThumbnailPrompt(
        videoDescription, 
        selectedThumbnailStyle
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
      setAiGeneratedImageUrl(newImageUrl);

      // Refresh credits after successful generation
      if (onCreditsUsed) {
        onCreditsUsed();
      }

      // Update the generated data with the new image
      const updatedData = {
        ...generatedData,
        thumbnail: newImageUrl || generatedData.thumbnail
      };
      setGeneratedData(updatedData);
      setGenerationState(null);

      // Save the project in the background if we have a new image
      if (newImageUrl) {
        // We don't await this call so it happens in the background
        saveProject(
          newImageUrl,
          updatedData.title,
          updatedData.description,
          updatedData.tags.join(',')
        ).catch(error => {
          console.error('Background project save failed:', error);
          // Optional: Show a toast error if background save fails
          toast.error(`Failed to save project in background: ${error.message}`);
        });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during image regeneration';
      console.error("Error during image regeneration:", errorMessage);
      setError(errorMessage);
      setGenerationState(null); // Make sure to end loading state in case of error too
    }
  };

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

  return (
    <div className="relative w-full">
      {/* Test Mode Button - Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={runTestGeneration}
            disabled={isLoading || !selectedThumbnailStyle}
            variant="outline"
            size="sm"
            className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100 shadow-lg"
          >
            🧪 Test Loading States
          </Button>
        </div>
      )}

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