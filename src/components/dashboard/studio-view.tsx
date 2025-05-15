'use client';

import React from 'react';
import { ThumbnailStyleSelector } from "@/components/dashboard/thumbnail-style-selector";
import { AIChatInput } from "@/components/dashboard/ai-chat-input";
import { VideoDescriptionInput } from "@/components/dashboard/video-description-input";
import { motion } from 'framer-motion';

interface StudioViewProps {
  selectedThumbnailStyle: string | null;
  onSelectStyle: (style: string | null) => void;
  videoDescription: string;
  onVideoDescriptionChange: (value: string) => void;
  // Add any other props that might be needed, e.g., for AIChatInput if its state needs to be lifted
}

export function StudioView({
  selectedThumbnailStyle,
  onSelectStyle,
  videoDescription,
  onVideoDescriptionChange,
}: StudioViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-full flex flex-col items-stretch gap-6"
    >
      <ThumbnailStyleSelector
        selectedStyle={selectedThumbnailStyle}
        onSelectStyle={onSelectStyle}
      />

      <div className="w-full flex flex-col items-start">
        <AIChatInput /> 
      </div>

      <div className="w-full flex flex-col items-start">
        <VideoDescriptionInput 
          value={videoDescription}
          onChange={(e) => onVideoDescriptionChange(e.target.value)}
          placeholder="Describe your video content..."
        />
      </div>
    </motion.div>
  );
} 