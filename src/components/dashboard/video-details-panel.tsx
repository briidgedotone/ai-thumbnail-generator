"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Download, Copy, Tag, Loader2, Eye, Maximize, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  // Use a placeholder thumbnail if no data is provided
  // const placeholderThumbnail = "/placeholder-thumbnail.jpg"; // Removed
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
          // If window.open is blocked (e.g., by popup blocker)
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
      // Fallback for other errors (e.g. network, or if window.open also failed previously)
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
      x: 30,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3
      } 
    },
    visible: { 
      width: "420px", 
      opacity: 1,
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.4
      } 
    },
    exit: { 
      width: 0, 
      opacity: 0,
      x: 30,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.2 
      } 
    }
  };

  // Button animation variants
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

  // Section variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    })
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="fixed top-0 right-0 bottom-0 border-l shadow-2xl z-40 overflow-hidden backdrop-blur-md rounded-tl-xl rounded-bl-xl"
            style={{
              backgroundColor: 'hsla(var(--card), 0.8)', // Use card color with opacity
              borderColor: 'hsl(var(--border))',
            }}
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
              <motion.div 
                className="flex justify-between items-center mb-6"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                <h2 className="text-2xl font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Video Details</h2>
                <motion.div
                  variants={buttonMotionVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={onClose} 
                    className="rounded-md"
                  >
                    <X size={18} />
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Thumbnail Container */}
              <motion.div 
                className="w-full mb-8"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                <div 
                  className="relative aspect-video w-full overflow-hidden group"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  {data?.thumbnail && data.thumbnail.trim() !== '' ? (
                    <div className="relative w-full h-full overflow-hidden transition-transform duration-300 group-hover:scale-105"
                         style={{ borderRadius: 'var(--radius-lg)' }}
                    >
                      <Image 
                        key={data.thumbnail}
                        src={data.thumbnail}
                        alt="Generated thumbnail"
                        fill
                        unoptimized={
                          data.thumbnail?.includes('oaidalleapiprodscus.blob.core.windows.net') || 
                          data.thumbnail?.startsWith('data:image/')
                        }
                        className={`object-cover ${isLoading ? 'opacity-30' : ''}`}
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
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--muted))' }}>
                      <p style={{ color: 'hsl(var(--muted-foreground))' }}>Loading Thumbnail...</p>
                    </div>
                  )}
                  {!isLoading && (
                    <div className="absolute bottom-3 right-3 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                      <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                        <Button 
                          size="icon" 
                          className="rounded-full shadow-sm bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
                          title="Preview Thumbnail"
                          onClick={() => setIsPreviewModalOpen(true)}
                          disabled={!data?.thumbnail}
                        >
                          <Eye size={18} />
                        </Button>
                      </motion.div>
                      <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                        <Button 
                          size="icon" 
                          className="rounded-full shadow-sm bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
                          title="Download Thumbnail"
                          onClick={handleDownload}
                          disabled={!data?.thumbnail}
                        >
                          <Download size={18} />
                        </Button>
                      </motion.div>

                        <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                          <Button
                            size="icon"
                            className="rounded-full shadow-sm bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
                            title="Regenerate Image"
                            onClick={onRegenerateImage}
                            disabled={!data?.thumbnail || isLoading}
                          >
                            <RefreshCw size={18} />
                          </Button>
                        </motion.div>

                    </div>
                  )}
                </div>
              </motion.div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Title */}
                <motion.div 
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  <h3 className="text-sm font-medium mb-2 flex items-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <span 
                      className="w-1.5 h-1.5 rounded-full mr-2"
                      style={{
                        backgroundColor: 'hsl(var(--primary))'
                      }}
                    ></span>
                    Video Title
                    {(isLoading || isRegeneratingTitle) && <Loader2 className="h-3 w-3 ml-2 animate-spin" style={{ color: 'hsl(var(--primary))' }} />}
                  </h3>
                  <div 
                    className="p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                    style={{
                      backgroundColor: 'hsl(var(--card))',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid hsl(var(--border))`
                    }}
                  >
                    <p className="font-medium text-base" style={{ color: 'hsl(var(--foreground))' }}>{data?.title || placeholderTitle}</p>
                    <div className="flex justify-end mt-3 space-x-2">
                      <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(data?.title || '', setTitleCopied)}
                          disabled={!data?.title || titleCopied}
                        >
                          {(titleCopied) ? (
                            <>
                              <Check size={14} className="text-green-500" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Copy
                            </>
                          )}
                        </Button>
                      </motion.div>
                      {onRegenerate && (
                        <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRegenerateTitle}
                            disabled={isLoading || isRegeneratingTitle}
                          >
                            {(isRegeneratingTitle) ? (
                              <>
                                <Loader2 size={14} className="animate-spin" /> Regenerating...
                              </>
                            ) : (
                              <>
                                <RefreshCw size={14} /> Regenerate
                              </>
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div 
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                >
                  <h3 className="text-sm font-medium mb-2 flex items-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <span 
                      className={`w-1.5 h-1.5 rounded-full mr-2`}
                      style={{
                        backgroundColor: 'hsl(var(--accent))'
                      }}
                    ></span>
                    Video Description
                    {(isLoading || isRegeneratingDescription) && <Loader2 className="h-3 w-3 ml-2 animate-spin" style={{ color: 'hsl(var(--accent))' }} />}
                  </h3>
                  <div 
                    className="p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                    style={{
                      backgroundColor: 'hsl(var(--card))',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid hsl(var(--border))`
                    }}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'hsl(var(--foreground))' }}>
                      {data?.description || placeholderDescription}
                    </div>
                    <div className="flex justify-end mt-3 space-x-2">
                      <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(data?.description || '', setDescriptionCopied)}
                          disabled={!data?.description || descriptionCopied}
                        >
                          {(descriptionCopied) ? (
                            <>
                              <Check size={14} className="text-green-500" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Copy
                            </>
                          )}
                        </Button>
                      </motion.div>
                      {onRegenerate && (
                        <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRegenerateDescription}
                            disabled={isLoading || isRegeneratingDescription}
                          >
                            {(isRegeneratingDescription) ? (
                              <>
                                <Loader2 size={14} className="animate-spin" /> Regenerating...
                              </>
                            ) : (
                              <>
                                <RefreshCw size={14} /> Regenerate
                              </>
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Tags */}
                <motion.div
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  custom={4}
                >
                  <h3 className="text-sm font-medium mb-2 flex items-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <span 
                      className={`w-1.5 h-1.5 rounded-full mr-2`}
                      style={{
                        backgroundColor: 'hsl(var(--secondary))'
                      }}
                    ></span>
                    Video Tags
                    {(isLoading || isRegeneratingTags) && <Loader2 className="h-3 w-3 ml-2 animate-spin" style={{ color: 'hsl(var(--secondary))' }} />}
                  </h3>
                  <div 
                    className="p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                    style={{
                      backgroundColor: 'hsl(var(--card))',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid hsl(var(--border))`
                    }}
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(data?.tags || placeholderTags).map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-medium border"
                          style={{
                            backgroundColor: 'hsl(var(--accent))',
                            color: 'hsl(var(--accent-foreground))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius-sm)'
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1, transition: { delay: tagIndex * 0.05, duration: 0.3, type: "spring", stiffness: 300, damping: 20 } }}
                          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                        >
                          <Tag size={10} className="mr-1" />
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                    <div className="flex justify-end mt-3 space-x-2">
                      <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => data?.tags && copyToClipboard(data.tags.join(', '), setTagsCopied)}
                          disabled={!data?.tags || data.tags.length === 0 || tagsCopied}
                        >
                          {(tagsCopied) ? (
                            <>
                              <Check size={14} className="text-green-500" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Copy All
                            </>
                          )}
                        </Button>
                      </motion.div>
                      {onRegenerate && (
                        <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRegenerateTags}
                            disabled={isLoading || isRegeneratingTags}
                          >
                            {(isRegeneratingTags) ? (
                              <>
                                <Loader2 size={14} className="animate-spin" /> Regenerating...
                              </>
                            ) : (
                              <>
                                <RefreshCw size={14} /> Regenerate
                              </>
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thumbnail Preview Modal */}
      <AnimatePresence>
        {isPreviewModalOpen && data?.thumbnail && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg"
            style={{ backgroundColor: 'hsla(var(--foreground), 0.6)' }} // Darker backdrop for modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPreviewModalOpen(false)}
          >
            <motion.div
              className="relative max-w-2xl max-h-[90vh] shadow-xl overflow-hidden"
              style={{
                backgroundColor: 'hsl(var(--card))',
                borderRadius: 'var(--radius-xl)', // Larger radius for modal
                border: `1px solid hsl(var(--border))`
              }}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={data.thumbnail}
                alt={data.title || "Thumbnail preview"}
                className="block max-w-full max-h-[85vh] object-contain"
                style={{ borderRadius: 'var(--radius-xl)' }}
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-3 right-3 rounded-md shadow-sm bg-white hover:bg-gray-100 text-gray-700 cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => setIsPreviewModalOpen(false)}
                aria-label="Close preview"
              >
                <X size={18} />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 