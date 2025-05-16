"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Download, Copy, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    thumbnail: string;
    title: string;
    description: string;
    tags: string[];
  }
}

export function VideoDetailsPanel({ isOpen, onClose, data }: VideoDetailsPanelProps) {
  // Use a placeholder thumbnail if no data is provided
  const placeholderThumbnail = "/placeholder-thumbnail.jpg";
  const placeholderTitle = "How to Achieve Success with These 5 Simple Tips";
  const placeholderDescription = "In this video, I share my top 5 productivity tips that have helped me achieve success in my career and personal life.";
  const placeholderTags = ["productivity", "success", "tips", "motivation", "personal growth"];

  // Animation variants
  const panelVariants = {
    hidden: { 
      width: 0,
      opacity: 0,
      x: 30,
      transition: { 
        type: "spring", 
        stiffness: 250, 
        damping: 25,
        duration: 0.3
      } 
    },
    visible: { 
      width: "420px", 
      opacity: 1,
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 250, 
        damping: 25,
        duration: 0.4
      } 
    },
    exit: { 
      width: 0, 
      opacity: 0,
      x: 30,
      transition: { 
        type: "spring", 
        stiffness: 250, 
        damping: 25,
        duration: 0.3,
        delay: 0.05 // Small delay before exit animation to coordinate with other elements
      } 
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delay: 0.1,
        duration: 0.3
      } 
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed top-0 right-0 bottom-0 bg-white border-l border-gray-200 shadow-lg z-40 overflow-hidden"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div 
            className="h-full flex flex-col p-6 overflow-y-auto"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Video Details</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </Button>
            </div>
            
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-gray-200 mb-6 bg-gray-50">
              <Image 
                src={data?.thumbnail || placeholderThumbnail} 
                alt="Thumbnail" 
                fill
                className="object-cover"
                // Fallback for missing image
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = placeholderThumbnail;
                }}
              />
              
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Button 
                  size="sm" 
                  className="rounded-lg bg-white/90 backdrop-blur-sm text-black border border-gray-300 hover:bg-white"
                >
                  <Download size={16} className="mr-1" /> Download
                </Button>
              </div>
            </div>
            
            {/* Title */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Video Title</h3>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-900">{data?.title || placeholderTitle}</p>
                <div className="flex justify-end mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    <Copy size={14} /> Copy
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Video Description</h3>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 text-sm">{data?.description || placeholderDescription}</p>
                <div className="flex justify-end mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    <Copy size={14} /> Copy
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Video Tags</h3>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2 mb-3">
                  {(data?.tags || placeholderTags).map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                    >
                      <Tag size={12} className="mr-1 text-gray-500" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    <Copy size={14} /> Copy All
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 