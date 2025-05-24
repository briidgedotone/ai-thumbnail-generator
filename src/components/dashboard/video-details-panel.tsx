"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import Image from "next/image";
import { X, Download, Copy, Tag, Eye, RefreshCw, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ThumbnailSkeleton, TitleSkeleton, DescriptionSkeleton, TagsSkeleton } from "@/components/ui/skeletons";
import { GenerationPhase } from "@/types/generation";

interface VideoDetailsPanelProps {
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

export function VideoDetailsPanel({ 
  isOpen, 
  onClose, 
  data, 
  generationPhase = null,
  generationProgress = 0,
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

  // Only show content loading during content-related generation phases
  const isGeneratingContent = generationPhase === 'generating-content' || generationPhase === 'initializing' || generationPhase === 'finalizing';
  // Show thumbnail loading during thumbnail-related generation phases
  const isGeneratingThumbnail = generationPhase !== null;

  const isGenerating = generationPhase !== null;

  // Function to download the thumbnail
  const handleDownload = async () => {
    if (!data?.thumbnail) return;

    try {
      let imageUrl = data.thumbnail;
      
      // If it's a data URL, we can use it directly
      if (imageUrl.startsWith('data:image/')) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'thumbnail.png';
        link.click();
        toast.success("Thumbnail downloaded successfully!");
        return;
      }
      
      // For other URLs, fetch the image and convert to blob
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch image');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
    
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'thumbnail.png';
      link.click();
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
      toast.success("Thumbnail downloaded successfully!");
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Failed to download thumbnail");
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = async (text: string, setCopied: (copied: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  // Regeneration handlers
  const handleRegenerateTitle = async () => {
    if (!onRegenerate) return;
    setIsRegeneratingTitle(true);
    try {
      await onRegenerate('titles');
    } finally {
      setIsRegeneratingTitle(false);
    }
  };

  const handleRegenerateDescription = async () => {
    if (!onRegenerate) return;
    setIsRegeneratingDescription(true);
    try {
      await onRegenerate('descriptions');
    } finally {
      setIsRegeneratingDescription(false);
    }
  };

  const handleRegenerateTags = async () => {
    if (!onRegenerate) return;
    setIsRegeneratingTags(true);
    try {
      await onRegenerate('tags');
    } finally {
      setIsRegeneratingTags(false);
    }
  };

  // Motion variants
  const panelVariants = {
    closed: {
      x: "100%",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.4,
      } 
    },
    open: {
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.5,
      }
    }
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const buttonMotionVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  if (!isOpen) return null;

  return (
    <MotionConfig transition={{ type: "spring", bounce: 0.1 }}>
      <AnimatePresence>
        <div key="video-details-panel" className="fixed inset-0 z-50 flex">
          {/* Panel */}
          <motion.div
            className="ml-auto w-full max-w-lg bg-white dark:bg-zinc-900 shadow-2xl flex flex-col relative border-l border-zinc-200 dark:border-zinc-800"
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50"
              variants={itemVariants}
            >
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Video Details</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Review and customize your content</p>
              </div>
              <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full w-9 h-9"
                >
                  <X size={18} />
                </Button>
              </motion.div>
            </motion.div>

            <div className="h-full flex flex-col overflow-y-auto pb-6">
              {/* Thumbnail Container */}
              <motion.div 
                className="px-6 pt-6" 
                variants={itemVariants}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-6 shadow-md group bg-zinc-100 dark:bg-zinc-800">
                  {isGeneratingThumbnail ? (
                    <ThumbnailSkeleton 
                      generationPhase={generationPhase} 
                      generationProgress={generationProgress}
                      variant="detailed"
                    />
                  ) : data?.thumbnail && data.thumbnail.trim() !== '' ? (
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
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                  
                  {!isGeneratingThumbnail && (
                    <div className="absolute bottom-3 right-3 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                      <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                        <Button
                          size="icon"
                          className="rounded-full shadow-md bg-white/90 hover:bg-white text-zinc-700 cursor-pointer w-9 h-9"
                          title="Regenerate Image"
                          onClick={onRegenerateImage}
                          disabled={!data?.thumbnail || isGeneratingThumbnail}
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
                    <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Video Title
                    </h3>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    {isGeneratingContent || isRegeneratingTitle ? (
                      <TitleSkeleton />
                    ) : (
                      <>
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
                                disabled={isGeneratingContent || isRegeneratingTitle}
                                className="rounded-full w-8 h-8"
                                title={isRegeneratingTitle ? "Regenerating..." : "Regenerate Title"}
                              >
                                <RefreshCw size={16} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Video Description
                    </h3>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    {isGeneratingContent || isRegeneratingDescription ? (
                      <DescriptionSkeleton />
                    ) : (
                      <>
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
                                disabled={isGeneratingContent || isRegeneratingDescription}
                                className="rounded-full w-8 h-8"
                                title={isRegeneratingDescription ? "Regenerating..." : "Regenerate Description"}
                              >
                                <RefreshCw size={16} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Tags */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Video Tags
                    </h3>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    {isGeneratingContent || isRegeneratingTags ? (
                      <TagsSkeleton />
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(data?.tags || placeholderTags).map((tag, index) => (
                            <motion.div
                              key={`tag-${index}-${tag}`}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Tag size={12} className="mr-1" />
                              {tag}
                            </motion.div>
                          ))}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => copyToClipboard((data?.tags || placeholderTags).join(', '), setTagsCopied)}
                              disabled={!data?.tags || tagsCopied}
                              className="rounded-full w-8 h-8"
                              title={tagsCopied ? "Copied!" : "Copy Tags"}
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
                                disabled={isGeneratingContent || isRegeneratingTags}
                                className="rounded-full w-8 h-8"
                                title={isRegeneratingTags ? "Regenerating..." : "Regenerate Tags"}
                              >
                                <RefreshCw size={16} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Thumbnail Preview Modal */}
        {isPreviewModalOpen && data?.thumbnail && (
          <motion.div 
            key="thumbnail-preview-modal"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsPreviewModalOpen(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Image
                  src={data.thumbnail}
                  alt="Thumbnail preview"
                  width={800}
                  height={450}
                  unoptimized={
                    data.thumbnail?.includes('oaidalleapiprodscus.blob.core.windows.net') || 
                    data.thumbnail?.startsWith('data:image/')
                  }
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={() => setIsPreviewModalOpen(false)} 
                >
                  <X size={20} />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
} 