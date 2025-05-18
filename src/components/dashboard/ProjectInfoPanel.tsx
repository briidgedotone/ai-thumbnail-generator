'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import Image from 'next/image';
import { X, Tag, Copy, Check, Download, Eye, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Define Project type - This should ideally be a shared type
interface Project {
  id: string;
  title: string;
  thumbnailUrl: string;
  description?: string;
  tags?: string[];
  createdAt: string;
  // Add any other fields from Project type in DashboardPage/ProjectsView if needed for display
}

interface ProjectInfoPanelProps {
  project: Project | null; // Allow null for when panel is closing/data is being cleared
  isOpen: boolean; // Controlled from parent
  onClose: () => void;
}

// Utility to format date (can be moved to a shared utils file)
const formatDateForPanel = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch (e) {
    return 'Invalid Date';
  }
};

export function ProjectInfoPanel({ project, isOpen, onClose }: ProjectInfoPanelProps) {
  const [titleCopied, setTitleCopied] = useState(false);
  const [descriptionCopied, setDescriptionCopied] = useState(false);
  const [tagsCopied, setTagsCopied] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const panelVariants = {
    hidden: { width: 0, opacity: 0, x: 50 },
    visible: { 
      width: '450px', 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: 'spring', 
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
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const buttonMotionVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.95 },
  };

  const copyToClipboard = async (text: string, setCopied: (copied: boolean) => void) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text.'); // Simple feedback for user
    }
  };

  const handleDownload = async () => {
    if (!project?.thumbnailUrl || project.thumbnailUrl === '/placeholder-thumbnail.png') return;
    try {
      const response = await fetch(project.thumbnailUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response was not ok.');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project_thumbnail_${project.id}.${blob.type.split('/')[1] || 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading thumbnail:', error);
      alert('Failed to download image. You can try right-clicking the preview to save it.');
      // Fallback: try opening in new tab
      window.open(project.thumbnailUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <MotionConfig transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}>
      <AnimatePresence>
        {isOpen && project && (
          <>
            {/* Full screen backdrop overlay */}
            <motion.div 
              className="fixed inset-0 bg-black/25 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            
            <motion.div
              key="project-info-panel"
              className="fixed top-0 right-0 bottom-0 border-l border-zinc-200 shadow-lg z-40 overflow-hidden bg-white dark:bg-zinc-900 dark:border-zinc-800"
              variants={panelVariants} 
              initial="hidden" 
              animate="visible" 
              exit="exit"
            >
              {/* Removed mobile-only backdrop since we now have a full-screen one */}
              
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
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Project Details</h2>
              </motion.div>

              <div className="h-full flex flex-col overflow-y-auto pb-6">
                {/* Thumbnail */}
                {project.thumbnailUrl && project.thumbnailUrl !== '/placeholder-thumbnail.png' && (
                  <motion.div 
                    className="px-6 pt-6" 
                    variants={itemVariants}
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-4 shadow-md group bg-zinc-100 dark:bg-zinc-800">
                      <Image 
                        src={project.thumbnailUrl} 
                        alt={`Thumbnail for ${project.title}`} 
                        fill 
                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                        unoptimized={project.thumbnailUrl?.includes('oaidalleapiprodscus.blob.core.windows.net') || project.thumbnailUrl?.startsWith('data:image/')} 
                      />
                      <div 
                        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <div className="absolute bottom-3 right-3 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                        <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                          <Button 
                            size="icon" 
                            className="rounded-full shadow-md bg-white/90 hover:bg-white text-zinc-700 cursor-pointer w-9 h-9" 
                            title="Preview Thumbnail" 
                            onClick={() => setIsPreviewModalOpen(true)}
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
                          >
                            <Download size={16} />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="px-6 flex-1">
                  {/* Title */}
                  <motion.div className="mb-6" variants={itemVariants}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Title</h3>
                      <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => copyToClipboard(project.title, setTitleCopied)} 
                          title={titleCopied ? "Copied!" : "Copy Title"} 
                          className="w-8 h-8 rounded-full"
                        >
                          {titleCopied ? 
                            <Check size={16} className="text-green-500" /> : 
                            <Copy size={16} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                          }
                        </Button>
                      </motion.div>
                    </div>
                    <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{project.title}</p>
                  </motion.div>

                  {/* Description */}
                  {project.description && (
                    <motion.div className="mb-6" variants={itemVariants}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Description</h3>
                        <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard(project.description!, setDescriptionCopied)} 
                            title={descriptionCopied ? "Copied!" : "Copy Description"} 
                            className="w-8 h-8 rounded-full"
                          >
                            {descriptionCopied ? 
                              <Check size={16} className="text-green-500" /> : 
                              <Copy size={16} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                            }
                          </Button>
                        </motion.div>
                      </div>
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">{project.description}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <motion.div className="mb-6" variants={itemVariants}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Tags</h3>
                        <motion.div variants={buttonMotionVariants} whileHover="hover" whileTap="tap">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard(project.tags!.join(', '), setTagsCopied)} 
                            title={tagsCopied ? "Copied!" : "Copy Tags"} 
                            className="w-8 h-8 rounded-full"
                          >
                            {tagsCopied ? 
                              <Check size={16} className="text-green-500" /> : 
                              <Copy size={16} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                            }
                          </Button>
                        </motion.div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <motion.span 
                            key={index} 
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-zinc-100 text-zinc-800 rounded-full border border-zinc-200 hover:bg-zinc-200 transition-colors dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ 
                              opacity: 1, 
                              scale: 1,
                              transition: { delay: 0.1 + (index * 0.05) } 
                            }}
                          >
                            <Tag size={12} className="mr-1.5" />{tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Created At */}
                  <motion.div 
                    className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto"
                    variants={itemVariants}
                  >
                    <div className="flex items-center">
                      <Clock size={16} className="text-zinc-400 mr-2" />
                      <div>
                        <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Created</h3>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{formatDateForPanel(project.createdAt)}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Thumbnail Preview Modal */}
      <AnimatePresence>
        {isPreviewModalOpen && project && (
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
                  src={project.thumbnailUrl}
                  alt={`Preview: ${project.title}`}
                  width={1280} 
                  height={720}
                  className="block object-contain rounded-lg"
                  unoptimized={project.thumbnailUrl?.includes('oaidalleapiprodscus.blob.core.windows.net') || project.thumbnailUrl?.startsWith('data:image/')}
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