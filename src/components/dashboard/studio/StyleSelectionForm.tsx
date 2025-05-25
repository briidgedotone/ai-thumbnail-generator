import React, { useState } from 'react';
import { ThumbnailStyleSelector } from "@/components/dashboard/thumbnail-style-selector";
import { AIChatInput } from "@/components/dashboard/ai-chat-input";
import { VideoDescriptionInput } from "@/components/dashboard/video-description-input";
import { motion } from 'framer-motion';

interface StyleSelectionFormProps {
  selectedThumbnailStyle: string | null;
  onSelectStyle: (style: string | null) => void;
  videoDescription: string;
  onVideoDescriptionChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent, thumbnailText?: string, textStyle?: string) => Promise<void>;
  onChatSubmit: (prompt: string, thumbnailText?: string, textStyle?: string) => void;
  isLoading: boolean;
  onTextOverlayDataChange?: (data: { thumbnailText?: string; textStyle?: string }) => void;
}

export function StyleSelectionForm({
  selectedThumbnailStyle,
  onSelectStyle,
  videoDescription,
  onVideoDescriptionChange,
  onSubmit,
  onChatSubmit,
  isLoading,
  onTextOverlayDataChange
}: StyleSelectionFormProps) {
  // State to track text overlay data from AIChatInput
  const [currentThumbnailText, setCurrentThumbnailText] = useState<string>("");
  const [currentTextStyle, setCurrentTextStyle] = useState<string>("Bold White");
  const [includeTextOnThumbnail, setIncludeTextOnThumbnail] = useState<boolean>(false);

  // Handle text overlay changes from AIChatInput
  const handleTextOverlayChange = (thumbnailText: string, textStyle: string, includeText: boolean) => {
    setCurrentThumbnailText(thumbnailText);
    setCurrentTextStyle(textStyle);
    setIncludeTextOnThumbnail(includeText);
  };

  // Notify parent of current text overlay data whenever it changes
  React.useEffect(() => {
    if (onTextOverlayDataChange) {
      onTextOverlayDataChange({
        thumbnailText: includeTextOnThumbnail ? currentThumbnailText : undefined,
        textStyle: includeTextOnThumbnail ? currentTextStyle : undefined
      });
    }
  }, [currentThumbnailText, currentTextStyle, includeTextOnThumbnail, onTextOverlayDataChange]);

  // Handle form submission from button click
  const handleFormSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    // Use the text overlay data only if the user has enabled it
    const finalThumbnailText = includeTextOnThumbnail ? currentThumbnailText : undefined;
    const finalTextStyle = includeTextOnThumbnail ? currentTextStyle : undefined;
    
    // Pass the current text overlay data to the submit handler
    onSubmit(e, finalThumbnailText, finalTextStyle);
  };

  // Handle submission from AI Chat Input
  const handleChatSubmit = (prompt: string, thumbnailText?: string, textStyle?: string) => {
    // Update our local state to keep track of text overlay data
    setCurrentThumbnailText(thumbnailText || "");
    setCurrentTextStyle(textStyle || "Bold White");
    
    // Call the original chat submit handler
    onChatSubmit(prompt, thumbnailText, textStyle);
  };

  return (
    <motion.div 
      key="mainContent"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ 
        type: "spring",
        stiffness: 250,
        damping: 25,
        duration: 0.4
      }}
      className="w-full flex flex-col items-stretch gap-6"
    >
      <form onSubmit={handleFormSubmit}>
        <ThumbnailStyleSelector
          selectedStyle={selectedThumbnailStyle}
          onSelectStyle={onSelectStyle}
        />
        <div className="w-full flex flex-col items-start mt-6">
          <AIChatInput 
            onSubmit={handleChatSubmit} 
            onTextOverlayChange={handleTextOverlayChange}
          /> 
        </div>
        <div className="w-full flex flex-col items-start mt-6">
          <VideoDescriptionInput 
            value={videoDescription}
            onChange={(e) => onVideoDescriptionChange(e.target.value)}
            placeholder="Describe your video content..."
          />
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            type="submit" 
            className="w-full px-6 py-3 rounded-full font-medium bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={!videoDescription.trim() || !selectedThumbnailStyle || isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Video Content'}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 