import React from 'react';
import { YouTubePreviewGrid } from "@/components/dashboard/youtube-preview-grid";
import { VideoDetailsPanel } from "@/components/dashboard/video-details-panel";
import { motion } from 'framer-motion';
import { GenerationPhase } from "@/types/generation";

interface GenerationResultsProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    thumbnail: string;
    title: string;
    description: string;
    tags: string[];
  };
  generationPhase?: GenerationPhase | null;
  generationProgress?: number;
  onRegenerate?: (contentType: 'titles' | 'descriptions' | 'tags') => Promise<void>;
  onRegenerateImage?: () => void;
}

export function GenerationResults({
  isOpen,
  onClose,
  data,
  generationPhase = null,
  generationProgress = 0,
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
            generationPhase={generationPhase}
            generationProgress={generationProgress}
          />
        </motion.div>
      )}
      
      {/* Video details panel */}
      <VideoDetailsPanel 
        isOpen={isOpen} 
        onClose={onClose}
        data={data}
        generationPhase={generationPhase}
        generationProgress={generationProgress}
        onRegenerate={onRegenerate}
        onRegenerateImage={onRegenerateImage}
      />
    </>
  );
} 