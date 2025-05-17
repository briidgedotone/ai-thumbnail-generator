import { useState, useEffect } from 'react';
import { generateThumbnailPrompt } from '@/utils/prompt-generators';

interface GeneratedData {
  thumbnail: string;
  title: string;
  description: string;
  tags: string[];
}

interface UseContentGenerationProps {
  onDetailsPanelStateChange?: (isOpen: boolean) => void;
}

interface UseContentGenerationReturn {
  isDetailsPanelOpen: boolean;
  setIsDetailsPanelOpen: (isOpen: boolean) => void;
  generatedData: GeneratedData | undefined;
  aiGeneratedImageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  handleSubmit: (
    videoDescription: string,
    selectedThumbnailStyle: string,
    e?: React.FormEvent,
    thumbnailText?: string,
    textStyle?: string,
    aiChatInput?: string
  ) => Promise<void>;
  getThumbnailStylePath: (styleId: string | null) => string | null;
  handleCloseDetailsPanel: () => void;
}

/**
 * Custom hook to handle content generation logic
 */
export function useContentGeneration({
  onDetailsPanelStateChange,
}: UseContentGenerationProps = {}): UseContentGenerationReturn {
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedData | undefined>(undefined);
  const [aiGeneratedImageUrl, setAiGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Notify parent component when details panel state changes
  useEffect(() => {
    if (onDetailsPanelStateChange) {
      onDetailsPanelStateChange(isDetailsPanelOpen);
    }
  }, [isDetailsPanelOpen, onDetailsPanelStateChange]);

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

  const handleSubmit = async (
    videoDescription: string,
    selectedThumbnailStyle: string,
    e?: React.FormEvent, 
    thumbnailText?: string, 
    textStyle?: string,
    aiChatInput: string = ''
  ) => {
    if (e) e.preventDefault();
    
    if (videoDescription.trim() === '' || !selectedThumbnailStyle) return;

    setIsLoading(true);
    setError(null);
    setAiGeneratedImageUrl(null); // Reset previous image

    // Set initial generatedData for the panel to render with loading indicators
    setGeneratedData({
      thumbnail: aiGeneratedImageUrl || getThumbnailStylePath(selectedThumbnailStyle) || '', 
      title: `Generating prompt for: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
      description: videoDescription,
      tags: videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, '')),
    });
    setIsDetailsPanelOpen(true); // Open panel so it can show its loading state

    try {
      // Generate a style-specific structured prompt for thumbnail
      const structuredPrompt = await generateThumbnailPrompt(
        videoDescription, 
        selectedThumbnailStyle, 
        thumbnailText, 
        textStyle,
        aiChatInput
      );
      console.log('[TESTING - Structured Prompt from Gemini]', structuredPrompt);

      // First, generate the thumbnail image - TEMPORARILY COMMENTING OUT TO SAVE API CREDITS
      /*
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
      setAiGeneratedImageUrl(thumbnailResult.imageUrl);
      */

      // Use placeholder thumbnail instead of generated one
      const placeholderThumbnail = getThumbnailStylePath(selectedThumbnailStyle) || '';
      setAiGeneratedImageUrl(placeholderThumbnail);

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
        
        // Continue with basic content if optimized content generation fails
        const styleName = selectedThumbnailStyle.replace('-style', '');
        const basicTitle = `${styleName} Video: ${videoDescription.slice(0, 40)}${videoDescription.length > 40 ? '...' : ''}`;
        
        // Create some basic tags from the description
        const basicTags = videoDescription
          .split(/\s+/)
          .filter(word => word.length > 3)
          .slice(0, 8)
          .map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, ''))
          .filter(Boolean); // Remove empty strings
        
        setGeneratedData({
          thumbnail: placeholderThumbnail,
          title: basicTitle,
          description: videoDescription,
          tags: basicTags.length > 0 ? basicTags : ['video', 'content', 'youtube'],
        });
        return;
      }

      const contentResult = await contentResponse.json();
      
      // If the content generation was successful, use the best options
      if (contentResult.success && contentResult.titles && contentResult.descriptions && contentResult.tags) {
        const bestTitleIndex = contentResult.bestTitle >= 0 && contentResult.bestTitle < contentResult.titles.length 
          ? contentResult.bestTitle 
          : 0;
          
        const bestDescriptionIndex = contentResult.bestDescription >= 0 && contentResult.bestDescription < contentResult.descriptions.length 
          ? contentResult.bestDescription 
          : 0;
          
        // Update generatedData with the AI-generated content
        setGeneratedData({
          thumbnail: placeholderThumbnail,
          title: contentResult.titles[bestTitleIndex],
          description: contentResult.descriptions[bestDescriptionIndex],
          tags: contentResult.tags,
        });
      } else {
        // Fallback to basic content if the response structure is invalid
        const styleName = selectedThumbnailStyle.replace('-style', '');
        setGeneratedData({
          thumbnail: placeholderThumbnail,
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
        thumbnail: getThumbnailStylePath(selectedThumbnailStyle) || '',
        title: `Error - ${selectedThumbnailStyle}: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
        description: videoDescription,
        tags: videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, '')),
      });
      setAiGeneratedImageUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDetailsPanel = () => {
    // Add a small delay when closing to make the animation smoother
    setIsDetailsPanelOpen(false);
  };

  return {
    isDetailsPanelOpen,
    setIsDetailsPanelOpen,
    generatedData,
    aiGeneratedImageUrl,
    isLoading,
    error,
    handleSubmit,
    getThumbnailStylePath,
    handleCloseDetailsPanel
  };
} 