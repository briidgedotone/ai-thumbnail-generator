"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { VideoCardSkeleton } from "@/components/ui/skeletons";
import { GenerationPhase } from "@/types/generation";

interface VideoPreviewProps {
  thumbnail: string;
  title: string;
  viewCount?: string;
  timeAgo?: string;
  channelName?: string;
  generationPhase?: GenerationPhase | null;
  generationProgress?: number;
  profilePicture?: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  thumbnail,
  title,
  viewCount = "0 views",
  timeAgo = "just now",
  channelName = "Your Channel",
  generationPhase = null,
  generationProgress = 0,
  profilePicture,
}) => {
  const isGenerating = generationPhase !== null;

  // Show skeleton during generation
  if (isGenerating) {
    return (
      <VideoCardSkeleton 
        generationPhase={generationPhase} 
        generationProgress={generationProgress} 
      />
    );
  }

  return (
    <div className="flex flex-col w-full cursor-pointer group">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-gray-200">
        <Image
          src={thumbnail || ''}
          alt={title}
          fill
          unoptimized={
            thumbnail?.includes('oaidalleapiprodscus.blob.core.windows.net') || 
            thumbnail?.startsWith('data:image/')
          }
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium py-0.5 px-1.5 rounded">
          0:00
        </div>
      </div>

      {/* Video Info */}
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-200 overflow-hidden mt-1 relative">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt={`${channelName} profile picture`}
              fill
              unoptimized={true}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <User size={18} />
            </div>
          )}
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
  generationPhase?: GenerationPhase | null;
  generationProgress?: number;
}

export function YouTubePreviewGrid({
  thumbnailStyleImagePath,
  title,
  description,
  tags,
  generationPhase = null,
  generationProgress = 0,
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

  const sampleItems = [
    { title: "The Weeknd - Hurry Up Tomorrow", channelName: "The Weeknd", viewCount: "340K views", timeAgo: "7 hours ago", thumbnail: "/thumbnail2.jpg", profilePicture: "/pfp2.jpg" },
    { title: "I Cooked Against Robots", channelName: "Nick DiGiovanni", viewCount: "28M views", timeAgo: "6 months ago", thumbnail: "/thumbnail3.jpg", profilePicture: "/pfp3.jpg" },
    { title: "Living on $20/day in VIETNAM (World's Cheapest Country)", channelName: "Brett Conti", viewCount: "154K views", timeAgo: "3 weeks ago", thumbnail: "/thumbnail4.jpg", profilePicture: "/pfp4.jpg" },
    { title: "NEPAL - Why Do These Mountains Make Me Feel so Free?", channelName: "JustKay", viewCount: "354K views", timeAgo: "4 months ago", thumbnail: "/thumbnail5.jpg", profilePicture: "/pfp5.jpg" },
    { title: "Two Men Build MASSIVE $750,000 Barndominium in ONLY 1 Year", channelName: "Quantum Tech HD", viewCount: "5.2M views", timeAgo: "1 month ago", thumbnail: "/thumbnail6.jpg", profilePicture: "/pfp6.jpg" }
  ];

  return (
    <motion.div
      className="w-full bg-white px-6 py-8 border-t border-gray-200 mt-4 rounded-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">How your video will look on YouTube</h2>
        <p className="text-sm text-gray-500 mt-1">Preview how your content will appear to viewers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Original video based on user input and AI generation */}
        <motion.div variants={itemVariants}>
          <VideoPreview
            thumbnail={thumbnailStyleImagePath}
            title={title}
            viewCount="0 views"
            timeAgo="just now"
            channelName="Your Channel"
            generationPhase={generationPhase}
            generationProgress={generationProgress}
          />
        </motion.div>

        {/* 5 more sample videos with predefined details */}
        {sampleItems.map((item, index) => (
          <motion.div variants={itemVariants} key={index}>
            <VideoPreview
              thumbnail={item.thumbnail}
              title={item.title}
              channelName={item.channelName}
              viewCount={item.viewCount}
              timeAgo={item.timeAgo}
              profilePicture={item.profilePicture}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 