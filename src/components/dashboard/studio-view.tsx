'use client';

import React, { useState, useEffect } from 'react';
import { ThumbnailStyleSelector } from "@/components/dashboard/thumbnail-style-selector";
import { AIChatInput } from "@/components/dashboard/ai-chat-input";
import { VideoDescriptionInput } from "@/components/dashboard/video-description-input";
import { VideoDetailsPanel } from "@/components/dashboard/video-details-panel";
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

  // Notify parent component when details panel state changes
  useEffect(() => {
    if (onDetailsPanelStateChange) {
      onDetailsPanelStateChange(isDetailsPanelOpen);
    }
  }, [isDetailsPanelOpen, onDetailsPanelStateChange]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (videoDescription.trim() === '' || !selectedThumbnailStyle) return;
    setGeneratedData({
      thumbnail: '/placeholder-thumbnail.jpg',
      title: `${selectedThumbnailStyle} Video: ${videoDescription.slice(0, 30)}${videoDescription.length > 30 ? '...' : ''}`,
      description: videoDescription,
      tags: videoDescription.split(' ').slice(0, 5).map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, '')),
    });
    setIsDetailsPanelOpen(true);
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

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {!isDetailsPanelOpen && (
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
                  disabled={!videoDescription.trim() || !selectedThumbnailStyle}
                >
                  Generate Video Content
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      <VideoDetailsPanel 
        isOpen={isDetailsPanelOpen} 
        onClose={handleCloseDetailsPanel}
        data={generatedData}
      />
    </div>
  );
} 