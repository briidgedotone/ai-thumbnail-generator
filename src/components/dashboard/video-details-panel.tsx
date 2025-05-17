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
}

export function VideoDetailsPanel({ 
  isOpen, 
  onClose, 
  data, 
  isLoading = false,
  onRegenerate 
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

  return (
    <>
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
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {isLoading && !data?.thumbnail && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">Generating Thumbnail...</p>
                  </div>
                )}
                {data?.thumbnail && data.thumbnail.trim() !== '' ? (
                  <Image
                    src={data.thumbnail}
                    alt="Generated thumbnail"
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
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                    <p className="text-black">Loading Thumbnail...</p>
                  </div>
                )}
                {!isLoading && (
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button 
                      size="icon" 
                      className="rounded-full bg-white/90 backdrop-blur-sm text-black border-0 shadow-md hover:bg-white hover:scale-105 transition-transform w-9 h-9"
                      title="Preview Thumbnail"
                      onClick={() => setIsPreviewModalOpen(true)}
                      disabled={!data?.thumbnail}
                    >
                      <Eye size={15} />
                    </Button>
                    <Button 
                      size="icon" 
                      className="rounded-full bg-white/90 backdrop-blur-sm text-black border-0 shadow-md hover:bg-white hover:scale-105 transition-transform w-9 h-9"
                      title="Download Thumbnail"
                      onClick={handleDownload}
                      disabled={!data?.thumbnail}
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
                  {isLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin text-indigo-500" />}
                </h3>
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <p className="font-medium text-gray-900">{data?.title || placeholderTitle}</p>
                  <div className="flex justify-end mt-3 space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 flex items-center gap-1 transition-colors"
                      onClick={() => copyToClipboard(data?.title || '', setTitleCopied)}
                      disabled={!data?.title || titleCopied}
                    >
                      {titleCopied ? (
                        <>
                          <Check size={14} className="text-green-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy
                        </>
                      )}
                    </Button>
                    {onRegenerate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 flex items-center gap-1 transition-colors"
                        onClick={handleRegenerateTitle}
                        disabled={isLoading || isRegeneratingTitle}
                      >
                        {isRegeneratingTitle ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-indigo-500" /> Regenerating...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={14} /> Regenerate
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-7">
                <h3 className="text-sm font-medium text-gray-500 mb-2.5 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mr-2"></span>
                  Video Description
                  {isLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin text-pink-500" />}
                </h3>
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {data?.description || placeholderDescription}
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-gray-600 hover:text-pink-600 hover:bg-pink-50 flex items-center gap-1 transition-colors"
                      onClick={() => copyToClipboard(data?.description || '', setDescriptionCopied)}
                      disabled={!data?.description || descriptionCopied}
                    >
                      {descriptionCopied ? (
                        <>
                          <Check size={14} className="text-green-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy
                        </>
                      )}
                    </Button>
                    {onRegenerate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-600 hover:text-pink-600 hover:bg-pink-50 flex items-center gap-1 transition-colors"
                        onClick={handleRegenerateDescription}
                        disabled={isLoading || isRegeneratingDescription}
                      >
                        {isRegeneratingDescription ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-pink-500" /> Regenerating...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={14} /> Regenerate
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2.5 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>
                  Video Tags
                  {isLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin text-amber-500" />}
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
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-gray-600 hover:text-amber-600 hover:bg-amber-50 flex items-center gap-1 transition-colors"
                      onClick={() => data?.tags && copyToClipboard(data.tags.join(', '), setTagsCopied)}
                      disabled={!data?.tags || data.tags.length === 0 || tagsCopied}
                    >
                      {tagsCopied ? (
                        <>
                          <Check size={14} className="text-green-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy All
                        </>
                      )}
                    </Button>
                    {onRegenerate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-600 hover:text-amber-600 hover:bg-amber-50 flex items-center gap-1 transition-colors"
                        onClick={handleRegenerateTags}
                        disabled={isLoading || isRegeneratingTags}
                      >
                        {isRegeneratingTags ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-amber-500" /> Regenerating...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={14} /> Regenerate
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thumbnail Preview Modal */}
      <AnimatePresence>
        {isPreviewModalOpen && data?.thumbnail && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPreviewModalOpen(false)}
          >
            <motion.div
              className="relative max-w-3xl max-h-[80vh] rounded-xl overflow-hidden shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={data.thumbnail}
                alt={data.title || "Thumbnail preview"}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <Button
                className="absolute top-4 right-4 rounded-full bg-black/50 text-white hover:bg-black/80 border-0"
                size="icon"
                onClick={() => setIsPreviewModalOpen(false)}
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