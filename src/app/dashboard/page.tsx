"use client"

import React, { useState } from "react";
import { ChatInput } from "@/components/ui/chat-input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles as GenerateIcon, UploadCloud as UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTextareaResize } from "@/hooks/use-textarea-resize";
import { ThumbnailStyleSelector } from "@/components/dashboard/thumbnail-style-selector";

interface ChatInputAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onSubmit: () => void;
}

function ChatInputArea({ value, onChange, onSubmit }: ChatInputAreaProps) {
  return (
    <div className="min-w-[400px] w-full pt-0">
      <form 
        className="relative rounded-lg border border-neutral-400 bg-pink-50 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <ChatInput
          value={value}
          onChange={onChange}
          placeholder="Enter your core idea or keywords..."
          className="min-h-[48px] resize-none bg-transparent border-0 p-0 shadow-none"
        />
      </form>
    </div>
  );
}

export default function DashboardPage() {
  const [chatInputValue, setChatInputValue] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedThumbnailStyle, setSelectedThumbnailStyle] = useState<string | null>(null);
  const descriptionTextareaRef = useTextareaResize(videoDescription, 2);

  const handleChatSubmit = () => {
    console.log("Chat input submitted with:", chatInputValue);
  };

  const handleGenerate = () => {
    if (!chatInputValue.trim() || !videoDescription.trim() || !selectedThumbnailStyle) {
      console.log("Cannot generate, inputs or style selection missing");
      if (!selectedThumbnailStyle) {
        alert("Please select a thumbnail style before generating.");
      }
      return;
    }
    console.log("Generating thumbnails with:");
    console.log("Chat Input:", chatInputValue);
    console.log("Video Description:", videoDescription);
    console.log("Selected Style:", selectedThumbnailStyle);
  };

  const handleUploadStyle = () => {
    console.log("Upload your style button clicked");
    // Placeholder for actual upload functionality
  };

  const canGenerate = chatInputValue.trim() !== "" && videoDescription.trim() !== "" && selectedThumbnailStyle !== null;

  return (
    <div className="min-h-screen bg-background relative grainy-background dashboard-backdrop-circle-container flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-3xl w-full flex flex-col items-stretch gap-6">
        <div className="w-full flex flex-col items-start">
          <label htmlFor="chatPrompt" className="block text-sm font-medium text-neutral-700 mb-1">
            Prompt / Keywords
          </label>
          <ChatInputArea
            value={chatInputValue}
            onChange={(e) => setChatInputValue((e.target as HTMLTextAreaElement).value)}
            onSubmit={handleChatSubmit}
          />
        </div>

        <ThumbnailStyleSelector
          selectedStyle={selectedThumbnailStyle}
          onSelectStyle={setSelectedThumbnailStyle}
        />

        <div className="w-full flex flex-col items-start">
          <label htmlFor="videoDescription" className="block text-sm font-medium text-neutral-700 mb-1">
            Describe your video
          </label>
          <div className="w-full min-w-[400px]">
            <div className="relative rounded-lg border border-neutral-400 bg-pink-50 p-3">
              <Textarea
                ref={descriptionTextareaRef}
                id="videoDescription"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="e.g., A high-energy unboxing video of the latest tech gadget..."
                className="w-full resize-none bg-transparent border-0 shadow-none p-0 overflow-y-hidden"
              />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            size="lg"
            onClick={handleGenerate}
            className="flex-1 gap-2 bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white shadow-[3px_3px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] border-2 border-black px-8 py-3 text-base font-semibold"
          >
            <GenerateIcon className="size-5" /> Generate Thumbnails
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={handleUploadStyle}
            className="flex-1 gap-2 border-2 border-neutral-700 text-neutral-700 shadow-[3px_3px_0px_0px_#a3a3a3] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#a3a3a3] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-neutral-100 px-8 py-3 text-base font-semibold"
          >
            <UploadIcon className="size-5" /> Upload your style
          </Button>
        </div>
      </div>
    </div>
  );
} 