"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Download, Copy, Tag, Loader2, Eye, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";

interface VideoDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    thumbnail: string;
    title: string;
    description: string;
    tags: string[];
  };
  isLoading?: boolean;
}

export function VideoDetailsPanel({ isOpen, onClose, data, isLoading = false }: VideoDetailsPanelProps) {
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  // Use a placeholder thumbnail if no data is provided
  // const placeholderThumbnail = "/placeholder-thumbnail.jpg"; // Removed
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

  const handleDownload = () => {
    if (data?.thumbnail) {
      const link = document.createElement('a');
      link.href = data.thumbnail;
      // Suggest a filename, browser might override or add extension
      const fileName = data.title ? data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_thumbnail.png' : 'thumbnail.png';
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed top-0 right-0 bottom-0 bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 shadow-xl z-40 overflow-hidden"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div 
            className="h-full flex flex-col p-7 overflow-y-auto"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Video Details</h2>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onClose} 
                className="rounded-full hover:bg-gray-100 border-gray-200 transition-all"
              >
                <X size={18} className="text-gray-500" />
              </Button>
            </div>
            
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-8 shadow-lg border-0 group">
              <Image 
                src={data?.thumbnail || ''} // Use empty string if data.thumbnail is null/undefined
                alt={data?.title || "Thumbnail preview"} 
                fill
                unoptimized={
                  data?.thumbnail?.includes('oaidalleapiprodscus.blob.core.windows.net') || 
                  data?.thumbnail?.startsWith('data:image/')
                } // Skip optimization for OpenAI URLs and data URLs
                className={`object-cover ${isLoading ? 'opacity-30' : ''} ${(data?.thumbnail || '') === '' && !isLoading ? 'bg-gray-200' : ''}`} // Add bg if src is empty and not loading
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none'; // Hide image element on error
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.image-error-message')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'image-error-message absolute inset-0 flex items-center justify-center text-xs text-gray-500';
                    errorMsg.textContent = 'Image failed to load';
                    parent.appendChild(errorMsg);
                  }
                }}
              />
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm">
                  <Loader2 className="h-12 w-12 animate-spin text-white mb-3 drop-shadow-md" />
                  <p className="text-sm font-semibold text-white bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">Generating Thumbnail...</p>
                </div>
              )}
              {!isLoading && data?.thumbnail && (
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full bg-white/90 backdrop-blur-sm text-black border-0 shadow-md hover:bg-white hover:scale-105 transition-transform w-9 h-9"
                        title="Preview Thumbnail"
                        onClick={() => setIsPreviewOpen(true)}
                      >
                        <Eye size={15} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 w-screen h-screen bg-black/80 backdrop-blur-md border-0 shadow-none flex items-center justify-center">
                      <Image
                        src={data.thumbnail}
                        alt={data.title || "Thumbnail preview"}
                        width={3840}
                        height={2160}
                        className="rounded-lg object-contain max-h-[95vh] max-w-[95vw] w-auto h-auto"
                        unoptimized={
                          data.thumbnail?.includes('oaidalleapiprodscus.blob.core.windows.net') ||
                          data.thumbnail?.startsWith('data:image/')
                        }
                      />
                       <DialogClose className="absolute top-6 right-6 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                        <X size={28} />
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="icon"
                    className="rounded-full bg-white/90 backdrop-blur-sm text-black border-0 shadow-md hover:bg-white hover:scale-105 transition-transform w-9 h-9"
                    title="Download Thumbnail"
                    onClick={handleDownload}
                  >
                    <Download size={15} />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Title */}
            <div className="mb-7">
              <h3 className="text-sm font-medium text-gray-500 mb-2.5 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                Video Title
              </h3>
              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="font-medium text-gray-900">{data?.title || placeholderTitle}</p>
                <div className="flex justify-end mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 flex items-center gap-1 transition-colors"
                  >
                    <Copy size={14} /> Copy
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-7">
              <h3 className="text-sm font-medium text-gray-500 mb-2.5 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mr-2"></span>
                Video Description
              </h3>
              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-700 text-sm leading-relaxed">{data?.description || placeholderDescription}</p>
                <div className="flex justify-end mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-gray-600 hover:text-pink-600 hover:bg-pink-50 flex items-center gap-1 transition-colors"
                  >
                    <Copy size={14} /> Copy
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2.5 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>
                Video Tags
              </h3>
              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap gap-2 mb-3">
                  {(data?.tags || placeholderTags).map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                    >
                      <Tag size={11} className="mr-1.5 text-amber-500" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-gray-600 hover:text-amber-600 hover:bg-amber-50 flex items-center gap-1 transition-colors"
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