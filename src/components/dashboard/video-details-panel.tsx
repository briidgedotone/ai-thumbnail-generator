"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import Image from "next/image";
import { X, Download, Copy, Tag, Loader2, Eye, RefreshCw, Check, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  onRegenerate?: (contentType: 'titles' | 'descriptions' | 'tags') => Promise<void>;
  onRegenerateImage?: () => void;
}

export function VideoDetailsPanel({ 
  isOpen, 
  onClose, 
  data, 
  isLoading = false,
  onRegenerate,
  onRegenerateImage
}: VideoDetailsPanelProps) {
  // Use placeholders if no data is provided
  const placeholderTitle = "How to Achieve Success with These 5 Simple Tips";
  const placeholderDescription = "In this video, I share my top 5 productivity tips that have helped me achieve success in my career and personal life.";
  const placeholderTags = ["productivity", "success", "tips", "motivation", "personal growth"];
  
  // State for thumbnail preview modal
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  // States for copy feedback
  const [titleCopied, setTitleCopied] = useState(false);
  const [descriptionCopied, setDescriptionCopied] = useState(false);
  const [tagsCopied, setTagsCopied] = useState(false);

  // States for regeneration
  const [isRegeneratingTitle, setIsRegeneratingTitle] = useState(false);
  const [isRegeneratingDescription, setIsRegeneratingDescription] = useState(false);
  const [isRegeneratingTags, setIsRegeneratingTags] = useState(false);

  // Function to download the thumbnail
  const handleDownload = async () => {
    if (!data?.thumbnail) return;

    try {
      const response = await fetch(data.thumbnail, {
        mode: 'cors' // Explicitly set mode for cross-origin requests
      });
      if (!response.ok) {
        // If direct fetch fails (e.g., CORS issue), try opening in new tab as fallback
        console.warn('Direct fetch failed, attempting to open in new tab.');
        const newTab = window.open(data.thumbnail, '_blank', 'noopener');
        if (newTab) {
          newTab.focus();
        } else {
          alert('Could not open image in a new tab. Please check your popup blocker settings or try right-clicking the image to save.');
        }
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
    
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `thumbnail-${new Date().getTime()}.${blob.type.split('/')[1] || 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading thumbnail:', error);
      // Fallback for other errors
      alert('Failed to download image. You can try right-clicking the preview to save it, or check the console for more details.');
      // As a last resort, try opening in a new tab if not already attempted
      if (!(error instanceof DOMException && error.name === 'NetworkError')) { // Avoid re-opening if it was a NetworkError from fetch
        const newTab = window.open(data.thumbnail, '_blank', 'noopener');
        if (newTab) newTab.focus();
      }
    }
  };
  
  // Function to copy text with feedback
  const copyToClipboard = async (text: string, setCopied: (copied: boolean) => void) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Handle regenerate functions
  const handleRegenerateTitle = async () => {
    if (!onRegenerate || isRegeneratingTitle) return;
    
    setIsRegeneratingTitle(true);
    try {
      await onRegenerate('titles');
    } finally {
      setIsRegeneratingTitle(false);
    }
  };

  const handleRegenerateDescription = async () => {
    if (!onRegenerate || isRegeneratingDescription) return;
    
    setIsRegeneratingDescription(true);
    try {
      await onRegenerate('descriptions');
    } finally {
      setIsRegeneratingDescription(false);
    }
  };

  const handleRegenerateTags = async () => {
    if (!onRegenerate || isRegeneratingTags) return;
    
    setIsRegeneratingTags(true);
    try {
      await onRegenerate('tags');
    } finally {
      setIsRegeneratingTags(false);
    }
  };

  // Animation variants
  const panelVariants = {
    hidden: { 
      width: 0,
      opacity: 0,
      x: 50,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      } 
    },
    visible: { 
      width: "450px", 
      opacity: 1,
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.1
      } 
    },
    exit: { 
      width: 0, 
      opacity: 0,
      x: 50,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const buttonMotionVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <MotionConfig transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 right-0 bottom-0 border-l border-zinc-200 shadow-lg z-40 overflow-hidden bg-white dark:bg-zinc-900 dark:border-zinc-800"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Backdrop for mobile */}
            <motion.div 
              className="fixed inset-0 bg-black/25 backdrop-blur-sm z-30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            
            {/* Header */}
            <motion.div 
              className="flex items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800"
              variants={itemVariants}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="mr-3 rounded-full w-8 h-8 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" 
                title="Close Panel"
              >
                <ArrowLeft size={18} />
              </Button>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Video Details</h2>
            </motion.div>

            <div className="h-full flex flex-col overflow-y-auto pb-6">
              {/* Thumbnail Container */}
              <motion.div 
                className="px-6 pt-6" 
                variants={itemVariants}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-6 shadow-md group bg-zinc-100 dark:bg-zinc-800">
                  {data?.thumbnail && data.thumbnail.trim() !== '' ? (
                    <div className="relative w-full h-full overflow-hidden">
                      <Image 
                        key={data.thumbnail}
                        src={data.thumbnail}
                        alt="Generated thumbnail"
                        fill
                        unoptimized={
                          data.thumbnail?.includes('oaidalleapiprodscus.blob.core.windows.net') || 
                          data.thumbnail?.startsWith('data:image/')
                        }
                        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${isLoading ? 'opacity-30' : ''}`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.image-error-message')) {
                            const errorMsg = document.createElement('div');
                            errorMsg.className = 'image-error-message absolute inset-0 flex items-center justify-center text-xs';
                            errorMsg.style.color = 'hsl(var(--muted-foreground))';
                            errorMsg.textContent = 'Image failed to load';
                            parent.appendChild(errorMsg);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700">
                      <p className="text-zinc-600 dark:text-zinc-300">Loading Thumbnail...</p>
                    </div>
                  )}
                  
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  
                  {!isLoading && (
                    <div className="absolute bottom-3 right-3 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                      <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                        <Button
                          size="icon"
                          className="rounded-full shadow-md bg-white/90 hover:bg-white text-zinc-700 cursor-pointer w-9 h-9"
                          title="Regenerate Image"
                          onClick={onRegenerateImage}
                          disabled={!data?.thumbnail || isLoading}
                        >
                          <RefreshCw size={16} />
                        </Button>
                      </motion.div>

                      <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                        <Button 
                          size="icon" 
                          className="rounded-full shadow-md bg-white/90 hover:bg-white text-zinc-700 cursor-pointer w-9 h-9"
                          title="Preview Thumbnail"
                          onClick={() => setIsPreviewModalOpen(true)}
                          disabled={!data?.thumbnail}
                        >
                          <Eye size={16} />
                        </Button>
                      </motion.div>

                      <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                        <Button 
                          size="icon" 
                          className="rounded-full shadow-md bg-white/90 hover:bg-white text-zinc-700 cursor-pointer w-9 h-9"
                          title="Download Thumbnail"
                          onClick={handleDownload}
                          disabled={!data?.thumbnail}
                        >
                          <Download size={16} />
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>

              <div className="px-6 flex-1">
                {/* Title */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center">
                      Video Title
                      {(isLoading || isRegeneratingTitle) && 
                        <Loader2 className="h-3 w-3 ml-2 animate-spin text-zinc-500 dark:text-zinc-400" />
                      }
                    </h3>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">
                      {data?.title || placeholderTitle}
                    </p>
                    <div className="flex justify-end mt-3 space-x-2">
                      <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => copyToClipboard(data?.title || '', setTitleCopied)}
                          disabled={!data?.title || titleCopied}
                          className="rounded-full w-8 h-8"
                          title={titleCopied ? "Copied!" : "Copy Title"}
                        >
                          {titleCopied ? 
                            <Check size={16} className="text-green-500" /> : 
                            <Copy size={16} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                          }
                        </Button>
                      </motion.div>
                      {onRegenerate && (
                        <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRegenerateTitle}
                            disabled={isLoading || isRegeneratingTitle}
                            className="rounded-full w-8 h-8"
                            title={isRegeneratingTitle ? "Regenerating..." : "Regenerate Title"}
                          >
                            {isRegeneratingTitle ? (
                              <Loader2 size={16} className="animate-spin text-zinc-400 dark:text-zinc-300" />
                            ) : (
                              <RefreshCw size={16} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center">
                      Video Description
                      {(isLoading || isRegeneratingDescription) && 
                        <Loader2 className="h-3 w-3 ml-2 animate-spin text-zinc-500 dark:text-zinc-400" />
                      }
                    </h3>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <div className="text-sm leading-relaxed whitespace-pre-line text-zinc-700 dark:text-zinc-300">
                      {data?.description || placeholderDescription}
                    </div>
                    <div className="flex justify-end mt-3 space-x-2">
                      <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => copyToClipboard(data?.description || '', setDescriptionCopied)}
                          disabled={!data?.description || descriptionCopied}
                          className="rounded-full w-8 h-8"
                          title={descriptionCopied ? "Copied!" : "Copy Description"}
                        >
                          {descriptionCopied ? 
                            <Check size={16} className="text-green-500" /> : 
                            <Copy size={16} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                          }
                        </Button>
                      </motion.div>
                      {onRegenerate && (
                        <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRegenerateDescription}
                            disabled={isLoading || isRegeneratingDescription}
                            className="rounded-full w-8 h-8"
                            title={isRegeneratingDescription ? "Regenerating..." : "Regenerate Description"}
                          >
                            {isRegeneratingDescription ? (
                              <Loader2 size={16} className="animate-spin text-zinc-400 dark:text-zinc-300" />
                            ) : (
                              <RefreshCw size={16} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Tags */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center">
                      Video Tags
                      {(isLoading || isRegeneratingTags) && 
                        <Loader2 className="h-3 w-3 ml-2 animate-spin text-zinc-500 dark:text-zinc-400" />
                      }
                    </h3>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <div className="flex flex-wrap gap-2">
                      {(data?.tags || placeholderTags).map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-zinc-100 text-zinc-800 rounded-full border border-zinc-200 hover:bg-zinc-200 transition-colors dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            transition: { delay: 0.1 + (tagIndex * 0.05) } 
                          }}
                        >
                          <Tag size={12} className="mr-1.5" />{tag}
                        </motion.span>
                      ))}
                    </div>
                    <div className="flex justify-end mt-3 space-x-2">
                      <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => data?.tags && copyToClipboard(data.tags.join(', '), setTagsCopied)}
                          disabled={!data?.tags || data.tags.length === 0 || tagsCopied}
                          className="rounded-full w-8 h-8"
                          title={tagsCopied ? "Copied!" : "Copy All Tags"}
                        >
                          {tagsCopied ? 
                            <Check size={16} className="text-green-500" /> : 
                            <Copy size={16} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                          }
                        </Button>
                      </motion.div>
                      {onRegenerate && (
                        <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRegenerateTags}
                            disabled={isLoading || isRegeneratingTags}
                            className="rounded-full w-8 h-8"
                            title={isRegeneratingTags ? "Regenerating..." : "Regenerate Tags"}
                          >
                            {isRegeneratingTags ? (
                              <Loader2 size={16} className="animate-spin text-zinc-400 dark:text-zinc-300" />
                            ) : (
                              <RefreshCw size={16} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
                
                {/* Creation date - placeholder since it's not in the data interface */}
                <motion.div 
                  className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto"
                  variants={itemVariants}
                >
                  <div className="flex items-center">
                    <Clock size={16} className="text-zinc-400 mr-2" />
                    <div>
                      <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Last Updated</h3>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">{new Date().toLocaleDateString('en-US', { 
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thumbnail Preview Modal */}
      <AnimatePresence>
        {isPreviewModalOpen && data?.thumbnail && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsPreviewModalOpen(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700"
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <Image
                  src={data.thumbnail}
                  alt="Video thumbnail preview"
                  width={1280} 
                  height={720}
                  className="block object-contain rounded-lg"
                  unoptimized={data.thumbnail?.includes('oaidalleapiprodscus.blob.core.windows.net') || data.thumbnail?.startsWith('data:image/')}
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 rounded-full bg-black/20 hover:bg-black/40 text-white w-9 h-9 backdrop-blur-sm" 
                onClick={() => setIsPreviewModalOpen(false)} 
                aria-label="Close preview"
              >
                <X size={18} />
              </Button>
              
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full px-4 shadow-lg backdrop-blur-sm bg-white/80 hover:bg-white"
                  onClick={handleDownload}
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
} 