"use client"

import React, { useState } from "react";
// import { ChatInput } from "@/components/ui/chat-input"; // No longer needed directly here
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles as GenerateIcon, UploadCloud as UploadIcon, Palette, LayoutGrid } from "lucide-react";
import Avatar from 'boring-avatars'; // Added import for Boring Avatars
import { cn } from "@/lib/utils";
import { useTextareaResize } from "@/hooks/use-textarea-resize";
import { ThumbnailStyleSelector } from "@/components/dashboard/thumbnail-style-selector";
import { AIChatInput } from "@/components/dashboard/ai-chat-input"; // Import the new component
import { VideoDescriptionInput } from "@/components/dashboard/video-description-input"; // Import new component

// New CircularProgress component
interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  baseColor?: string;
  // progressColor prop is no longer used directly for the gradient version, but kept for API consistency if needed elsewhere
  progressColor?: string; 
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 36,
  strokeWidth = 4,
  baseColor = "text-gray-300",
  // progressColor is destructured but not applied to the gradient circle
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const gradientId = "creditGradient";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 transform">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: '#FF5C8D', stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: '#FF0000', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#FFA600', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <circle
        className={baseColor} // Base circle still uses Tailwind color class
        strokeWidth={strokeWidth}
        stroke="currentColor" // Takes color from the baseColor Tailwind class
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        // className={progressColor} // Removed Tailwind class for progress color
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke={`url(#${gradientId})`} // Apply SVG gradient by ID
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: "stroke-dashoffset 0.35s ease-out" }}
      />
    </svg>
  );
};

export default function DashboardPage() {
  // const [chatInputValue, setChatInputValue] = useState(""); // Removed state for old input
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedThumbnailStyle, setSelectedThumbnailStyle] = useState<string | null>(null);
  // const descriptionTextareaRef = useTextareaResize(videoDescription, 2); // This is now inside VideoDescriptionInput

  // Dummy credit state
  const [currentCredits, setCurrentCredits] = useState(15);
  const [totalCredits, setTotalCredits] = useState(20);
  const [activeView, setActiveView] = useState<'studio' | 'projects'>('studio'); // New state for active view

  // handleChatSubmit is removed as the new component handles its own submission/logic.

  const handleGenerate = () => {
    // Temporarily remove chatInputValue check. We will need to find a way to get this value from AIChatInput.
    if (/*!chatInputValue.trim() ||*/ !videoDescription.trim() || !selectedThumbnailStyle) {
      console.log("Cannot generate, inputs or style selection missing");
      // if (!chatInputValue.trim()) {
      //   alert("Please enter a prompt or keywords.");
      // }
      if (!videoDescription.trim()) {
        alert("Please describe your video.");
      }
      if (!selectedThumbnailStyle) {
        alert("Please select a thumbnail style before generating.");
      }
      return;
    }
    console.log("Generating thumbnails with:");
    // console.log("Chat Input:", chatInputValue); // Temporarily commented out
    console.log("Video Description:", videoDescription);
    console.log("Selected Style:", selectedThumbnailStyle);
  };

  const handleUploadStyle = () => {
    console.log("Upload your style button clicked");
    // Placeholder for actual upload functionality
  };

  // Temporarily remove chatInputValue from canGenerate logic
  const canGenerate = /*chatInputValue.trim() !== "" &&*/ videoDescription.trim() !== "" && selectedThumbnailStyle !== null;

  const handleProfileClick = () => {
    console.log("Profile button clicked");
    // Placeholder for profile navigation or modal
  };

  const creditPercentage = totalCredits > 0 ? (currentCredits / totalCredits) * 100 : 0;

  return (
    <div className="min-h-screen bg-background relative grainy-background dashboard-backdrop-circle-container flex flex-col items-center justify-center px-4 pt-24 pb-8">
      {/* Top Center Fixed Elements: Studio/Projects Button Group - Set to 44px height */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 p-1 h-11 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-300">
          <Button
            variant={activeView === 'studio' ? "default" : "ghost"}
            size="sm"
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2 transition-all duration-200 ease-in-out",
              activeView === 'studio' 
                ? "bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-800"
            )}
            onClick={() => {
              setActiveView('studio');
              console.log("Studio view selected");
            }}
          >
            <Palette size={16} />
            Studio
          </Button>
          <Button
            variant={activeView === 'projects' ? "default" : "ghost"}
            size="sm"
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2 transition-all duration-200 ease-in-out",
              activeView === 'projects' 
                ? "bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-800"
            )}
            onClick={() => {
              setActiveView('projects');
              console.log("Projects view selected");
            }}
          >
            <LayoutGrid size={16} />
            Projects
          </Button>
        </div>
      </div>

      {/* Top Right Fixed Elements: Credits & Profile */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        {/* Credit Counter Element - Changed to pill shape with text, and set to 44px height */}
        <div 
          className="flex items-center gap-2 px-3 py-1.5 h-11 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-300"
          title={`${currentCredits}/${totalCredits} Credits Remaining`}
        >
          <CircularProgress percentage={creditPercentage} size={20} strokeWidth={2.5} baseColor="text-gray-200" />
          <span className="text-xs font-medium text-gray-700">
            {currentCredits}/{totalCredits} Credits
          </span>
        </div>
        {/* Profile Element - Button removed, div styled to look like bordered avatar */}
        <div 
          className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-400 hover:border-gray-500 transition-all p-0 overflow-hidden cursor-pointer flex items-center justify-center"
          onClick={handleProfileClick}
          title="Profile"
        >
          <Avatar
            size={44} // Avatar size to fill the div
            name="User SessionID" 
            variant="beam" 
            colors={['#FFAD08', '#EDD75A', '#73B06F', '#0C8F8F', '#405059']} 
          />
        </div>
      </div>

      {/* Main Dashboard Content Area */}
      <div className="max-w-3xl w-full flex flex-col items-stretch gap-6">
        
        <ThumbnailStyleSelector
          selectedStyle={selectedThumbnailStyle}
          onSelectStyle={setSelectedThumbnailStyle}
        />

        <div className="w-full flex flex-col items-start">
          <AIChatInput /> 
        </div>

        <div className="w-full flex flex-col items-start">
          <VideoDescriptionInput 
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            placeholder="Describe your video"
          />
        </div>

        {/* Button container removed from here */}

      </div>
    </div>
  );
} 