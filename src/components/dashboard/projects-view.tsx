"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Download, Trash2, Plus, Video, Search, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { createSupabaseClient } from "@/lib/supabase/client";

// Define a type for our project data from the frontend perspective
interface Project {
  id: string;
  user_id?: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  thumbnailUrl: string;
  selected_style_id?: string;
  description?: string;
  tags?: string[];
}

// Define a type for the raw data structure from Supabase projects table
interface SupabaseProject {
  id: string;
  generated_yt_title: string | null;
  generated_yt_description: string | null;
  generated_yt_tags: string | null;
  created_at: string;
  updated_at: string | null;
  thumbnail_storage_path: string | null;
  selected_style_id: string | null;
  user_id: string;
}

// Mock data for projects - will be replaced by API call
// Note: This mock data should also be updated to reflect the new Project interface if used for testing.
const mockProjectsData: Project[] = [
  {
    id: "p1",
    title: "Gaming Highlights Montage",
    createdAt: "2024-07-01T12:00:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=250&q=80",
  },
  {
    id: "p2",
    title: "Cooking Tutorial: Italian Pasta",
    createdAt: "2024-06-28T15:30:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1498579397066-22750a3cb424?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=250&q=80",
  },
  {
    id: "p3",
    title: "Travel Vlog: Bali Adventures",
    createdAt: "2024-06-20T09:15:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=250&q=80",
  },
  {
    id: "p4",
    title: "Productivity Tips For Devs",
    createdAt: "2024-06-10T14:00:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=250&q=80",
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
  onProjectClick?: (project: Project) => void;
}

export function ProjectsView({ onCreateNew, onProjectClick }: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Instantiate the Supabase client
  // useMemo ensures the client is created only once per component instance
  const supabase = useMemo(() => createSupabaseClient(), []);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          throw new Error("Error fetching user: " + userError.message);
        }
        if (!user) {
          throw new Error("No user logged in. Please log in to see your projects.");
        }

        const { data: fetchedProjectsData, error: dbError } = await supabase
          .from('projects')
          .select('id, user_id, generated_yt_title, created_at, updated_at, thumbnail_storage_path, selected_style_id, generated_yt_description, generated_yt_tags')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (dbError) {
          throw new Error("Failed to fetch projects: " + dbError.message);
        }

        if (fetchedProjectsData) {
          const mappedProjects: Project[] = (fetchedProjectsData as SupabaseProject[]).map((dbProject: SupabaseProject) => ({
            id: dbProject.id,
            user_id: dbProject.user_id,
            title: dbProject.generated_yt_title || "Untitled Project",
            createdAt: dbProject.created_at,
            updatedAt: dbProject.updated_at || undefined,
            thumbnailUrl: dbProject.thumbnail_storage_path || "/placeholder-thumbnail.png",
            selected_style_id: dbProject.selected_style_id || undefined,
            description: dbProject.generated_yt_description || "No description available.",
            tags: dbProject.generated_yt_tags ? dbProject.generated_yt_tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
          }));
          setProjects(mappedProjects);
        } else {
          setProjects([]);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        console.error("Error in fetchProjects:", errorMessage);
        setError(errorMessage);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [supabase]);

  const hasProjects = projects.length > 0;

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      console.log("Create new project");
    }
  };

  const handleProjectCardClick = (project: Project) => {
    if (onProjectClick) {
      onProjectClick(project);
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

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading projects...</p>
          {/* You can replace this with a spinner component */}
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center text-center p-6 bg-red-50 border border-red-200 rounded-lg">
          <Video size={32} className="text-red-500 mb-3" />
          <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Projects</h3>
          <p className="text-red-600 max-w-md mb-4">{error}</p>
          <Button 
            onClick={() => { /* Add retry logic here if needed */ 
              // For now, just re-trigger the fetch (though useEffect dependency is empty)
              // You might want to make fetchProjects a standalone function to call it here
              // or add a dependency to useEffect if appropriate
              // fetchProjects(); // This won't work directly due to useEffect scope
              // For a simple retry, you could force a re-render or reload:
              window.location.reload(); // Simplistic retry
            }}
            className="rounded-lg border-2 border-red-600 bg-red-500 text-white px-4 py-2 text-sm font-medium h-10 shadow-[2px_2px_0px_0px_#B91C1C] transition-all duration-300 hover:shadow-[4px_4px_0px_0px_#B91C1C] hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer"
          >
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !error && hasProjects && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              onClick={() => handleProjectCardClick(project)}
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
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && !error && !hasProjects && (
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