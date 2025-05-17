import React from 'react';
import { YouTubePreviewGrid } from "@/components/dashboard/youtube-preview-grid";
import { VideoDetailsPanel } from "@/components/dashboard/video-details-panel";
import { motion } from 'framer-motion';

interface GenerationResultsProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    thumbnail: string;
    title: string;
    description: string;
    tags: string[];
  };
  isLoading: boolean;
  onRegenerate?: (contentType: 'titles' | 'descriptions' | 'tags') => Promise<void>;
  onRegenerateImage?: () => void;
}

export function GenerationResults({
  isOpen,
  onClose,
  data,
  isLoading,
  onRegenerate,
  onRegenerateImage
}: GenerationResultsProps) {
  return (
    <>
      {isOpen && data && (
        <motion.div
          key="youtubePreview"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ type: "spring", stiffness: 250, damping: 25, duration: 0.4 }}
          className="w-full"
        >
          <YouTubePreviewGrid
            thumbnailStyleImagePath={data.thumbnail}
            title={data.title}
            description={data.description}
            tags={data.tags}
            isGeneratingAiImage={isLoading}
          />
        </motion.div>
      )}
      
      {/* Video details panel */}
      <VideoDetailsPanel 
        isOpen={isOpen} 
        onClose={onClose}
        data={data}
        isLoading={isLoading}
        onRegenerate={onRegenerate}
        onRegenerateImage={onRegenerateImage}
      />
    </>
  );
} 