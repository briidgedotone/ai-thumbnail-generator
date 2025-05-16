"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, User, Loader2 } from "lucide-react";

interface VideoPreviewProps {
  thumbnail: string;
  title: string;
  viewCount?: string;
  timeAgo?: string;
  channelName?: string;
  isGenerating?: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  thumbnail,
  title,
  viewCount = "0 views",
  timeAgo = "just now",
  channelName = "Your Channel",
  isGenerating = false,
}) => {
  return (
    <div className="flex flex-col w-full cursor-pointer group">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-gray-200">
        <Image
          src={thumbnail || ''}
          alt={title}
          fill
          unoptimized={thumbnail?.includes('oaidalleapiprodscus.blob.core.windows.net')}
          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${isGenerating ? 'opacity-50' : ''} ${(thumbnail || '') === '' && !isGenerating ? 'bg-gray-300' : ''}`}
        />
        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-sm font-medium">Generating...</p>
          </div>
        )}
        {!isGenerating && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium py-0.5 px-1.5 rounded">
            0:00
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-200 overflow-hidden mt-1">
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <User size={18} />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm leading-5 text-gray-900 line-clamp-2 mb-1">
            {title}
          </h3>
          <p className="text-xs text-gray-600">
            {channelName}
          </p>
          <div className="flex items-center text-xs text-gray-600 mt-1">
            <span>{viewCount}</span>
            <span className="mx-1">•</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface YouTubePreviewGridProps {
  thumbnailStyleImagePath: string;
  title: string;
  description: string;
  tags: string[];
  isGeneratingAiImage?: boolean;
}

export function YouTubePreviewGrid({
  thumbnailStyleImagePath,
  title,
  description,
  tags,
  isGeneratingAiImage = false,
}: YouTubePreviewGridProps) {
  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3
      }
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="w-full bg-white px-6 py-8 border-t border-gray-200 mt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">How your video will look on YouTube</h2>
        <p className="text-sm text-gray-500 mt-1">Preview how your content will appear to viewers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Original video based on user input */}
        <motion.div variants={itemVariants}>
          <VideoPreview
            thumbnail={thumbnailStyleImagePath}
            title={title}
            viewCount="0 views"
            timeAgo="just now"
            channelName="Your Channel"
            isGenerating={isGeneratingAiImage}
          />
        </motion.div>

        {/* 5 more sample videos with the same thumbnail but different titles */}
        <motion.div variants={itemVariants}>
          <VideoPreview
            thumbnail={thumbnailStyleImagePath}
            title={`Top 10 ${tags[0] || "Tips"} for Beginners`}
            viewCount="1.2K views"
            timeAgo="2 days ago"
            channelName="Your Channel"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <VideoPreview
            thumbnail={thumbnailStyleImagePath}
            title={`How to Master ${tags[1] || "Skills"} Quickly`}
            viewCount="4.5K views"
            timeAgo="1 week ago"
            channelName="Your Channel"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <VideoPreview
            thumbnail={thumbnailStyleImagePath}
            title={`The Ultimate Guide to ${tags[0] || "Success"}`}
            viewCount="8.7K views"
            timeAgo="2 weeks ago"
            channelName="Your Channel"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <VideoPreview
            thumbnail={thumbnailStyleImagePath}
            title={`${tags[1] || "Amazing"} Techniques You Should Know`}
            viewCount="12K views"
            timeAgo="3 weeks ago"
            channelName="Your Channel"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <VideoPreview
            thumbnail={thumbnailStyleImagePath}
            title={`Why ${tags[2] || "This"} Is Important for Your Growth`}
            viewCount="20K views"
            timeAgo="1 month ago"
            channelName="Your Channel"
          />
        </motion.div>
      </div>
    </motion.div>
  );
} 