"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useTextareaResize } from "@/hooks/use-textarea-resize";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VideoDescriptionInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

export function VideoDescriptionInput({
  value,
  onChange,
  placeholder,
}: VideoDescriptionInputProps) {
  const descriptionTextareaRef = useTextareaResize(value, 2); // Assuming 2 lines min height
  const [isActive, setIsActive] = useState(false);

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(false);

  // Container variants for shadow and active state, similar to AIChatInput but without height animation
  const containerVariants = {
    collapsed: {
      boxShadow: "none",
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
    expanded: {
      boxShadow: "none",
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };

  return (
    <motion.div
      className="w-full overflow-hidden rounded-[32px] bg-white"
      variants={containerVariants}
      animate={isActive || value ? "expanded" : "collapsed"}
      initial="collapsed"
    >
      <div className="p-3"> {/* Similar padding to AIChatInput's inner row, adjust as needed */}
        <Textarea
          ref={descriptionTextareaRef}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "w-full resize-none bg-transparent border-0 px-3 shadow-none", // Base reset with px-3 added
            "py-2 text-base font-normal text-black", // Font styling from AIChatInput (text-black for now)
            "placeholder:text-gray-400", // Placeholder color
            "outline-none focus:ring-0" // Ensure no focus ring from textarea itself
          )}
          // Min height can be controlled by useTextareaResize initial lines
        />
      </div>
    </motion.div>
  );
} 