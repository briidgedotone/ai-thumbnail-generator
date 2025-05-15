"use client";

import React from "react";
import { Download, Trash2, Plus, Video, Search, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Mock data for projects
const mockProjects = [
  {
    id: "p1",
    title: "Gaming Highlights Montage",
    createdAt: "2024-07-01T12:00:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=250&q=80",
    videoLength: "10:24",
  },
  {
    id: "p2",
    title: "Cooking Tutorial: Italian Pasta",
    createdAt: "2024-06-28T15:30:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1498579397066-22750a3cb424?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=250&q=80",
    videoLength: "15:37",
  },
  {
    id: "p3",
    title: "Travel Vlog: Bali Adventures",
    createdAt: "2024-06-20T09:15:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=250&q=80",
    videoLength: "22:15",
  },
  {
    id: "p4",
    title: "Productivity Tips For Devs",
    createdAt: "2024-06-10T14:00:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=250&q=80",
    videoLength: "08:47",
  },
];

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

// Get relative time (e.g., "2 weeks ago")
const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
};

interface ProjectsViewProps {
  onCreateNew?: () => void;
}

export function ProjectsView({ onCreateNew }: ProjectsViewProps) {
  const hasProjects = mockProjects.length > 0;

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      console.log("Create new project");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header with refined styling - Search bar removed */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">My Thumbnails</h2>
            <p className="text-gray-500 text-sm">Create and manage your YouTube thumbnails</p>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-4 py-2 text-sm font-medium h-10 shadow-[2px_2px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[4px_4px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer"
          >
            <Plus size={16} className="mr-2" />
            Create New
          </Button>
        </div>
      </div>

      {hasProjects ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {mockProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <div 
                className="group relative overflow-hidden rounded-xl transition-all duration-300 bg-white hover:bg-gray-50 cursor-pointer"
              >
                {/* Card with refined styling & interaction - Border removed from this inner div */}
                <div className="absolute inset-0.5 rounded-[10px] overflow-hidden z-0 transition-shadow duration-300" />
                
                {/* Thumbnail container with gradient overlay */}
                <div className="relative w-full aspect-video overflow-hidden rounded-t-[10px]">
                  <Image
                    src={project.thumbnailUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {/* Subtle gradient overlay for better visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover-triggered action buttons with refined styling */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                    <button 
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-white transition-all border border-gray-100 transform hover:-translate-y-0.5"
                      title="Download Thumbnail"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Download thumbnail for ${project.title}`);
                      }}
                    >
                      <Download size={14} />
                    </button>
                    
                    <button
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:text-red-600 hover:bg-white transition-all border border-gray-100 transform hover:-translate-y-0.5"
                      title="Delete Thumbnail"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Delete thumbnail for ${project.title}`);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Content area with refined typography and spacing */}
                <div className="p-4 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 leading-tight group-hover:text-black transition-colors">{project.title}</h3>
                    </div>
                    
                    {/* Time badge */}
                    <span className="text-gray-400 text-xs px-2 py-1 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                      {getRelativeTime(project.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-gray-100 py-14 px-6"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Video size={32} className="text-gray-500" />
              </div>
              <div className="absolute w-10 h-10 -right-1 -bottom-1 rounded-full bg-white shadow-md flex items-center justify-center">
                <Plus size={20} className="text-gray-400" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Create your first thumbnail</h3>
            <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
              Start creating eye-catching thumbnails that drive more clicks and engagement for your YouTube videos.
            </p>
            
            <Button 
              onClick={handleCreateNew}
              className="rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-6 py-3 text-base font-medium shadow-[2px_2px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[4px_4px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer"
            >
              <Plus size={18} className="mr-2" />
              Create New Thumbnail
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 