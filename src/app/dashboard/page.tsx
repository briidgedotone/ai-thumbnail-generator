"use client"

import React, { useState } from "react";
// import { ChatInput } from "@/components/ui/chat-input"; // No longer needed directly here
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles as GenerateIcon, UploadCloud as UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTextareaResize } from "@/hooks/use-textarea-resize";
import { ThumbnailStyleSelector } from "@/components/dashboard/thumbnail-style-selector";
import { AIChatInput } from "@/components/dashboard/ai-chat-input"; // Import the new component
import { VideoDescriptionInput } from "@/components/dashboard/video-description-input"; // Import new component

// ChatInputAreaProps interface and ChatInputArea function are removed.

export default function DashboardPage() {
  // const [chatInputValue, setChatInputValue] = useState(""); // Removed state for old input
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedThumbnailStyle, setSelectedThumbnailStyle] = useState<string | null>(null);
  // const descriptionTextareaRef = useTextareaResize(videoDescription, 2); // This is now inside VideoDescriptionInput

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

  return (
    <div className="min-h-screen bg-background relative grainy-background dashboard-backdrop-circle-container flex flex-col items-center justify-center px-4 py-8">
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