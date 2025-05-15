"use client" 

import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { Paperclip, Send, Type as TypeIcon, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
 
const PLACEHOLDERS = [
  "Make a thumbnail for my latest gaming video...",
  "Vlog thumbnail: 'A Day in the Life of a Software Engineer'...",
  "Create a catchy thumbnail for a cooking tutorial...",
  "Generate a professional thumbnail for my business webinar...",
  "Thumbnail ideas for a travel vlog in Bali...",
  "Design a clickbait thumbnail for a reaction video...",
  "Futuristic style for a tech review thumbnail...",
  "Minimalist and clean thumbnail for a coding tutorial..."
];
 
const AIChatInput = () => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [includeTextOnThumbnail, setIncludeTextOnThumbnail] = useState(false);
  const [thumbnailText, setThumbnailText] = useState("");
  const [selectedTextStyle, setSelectedTextStyle] = useState("Bold White");
  const wrapperRef = useRef<HTMLDivElement>(null);
 
  const TEXT_STYLE_OPTIONS = [
    "Bold White",
    "Bold Yellow",
    "Minimalist",
    "Pixel",
    "Calligraphy",
    "Cute",
  ];
 
  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue) return;
 
    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 7000);
 
    return () => clearInterval(interval);
  }, [isActive, inputValue]);
 
  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!inputValue) setIsActive(false);
      }
    };
 
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);
 
  const handleActivate = () => setIsActive(true);
 
  const containerVariants = {
    collapsed: {
      height: 68,
      boxShadow: "none",
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
    expanded: {
      height: 128,
      boxShadow: "none",
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };
 
  const placeholderContainerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.025 } },
    exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  };
 
  const letterVariants = {
    initial: {
      opacity: 0,
      filter: "blur(12px)",
      y: 10,
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: { duration: 0.25 },
        filter: { duration: 0.4 },
        y: { type: "spring", stiffness: 80, damping: 20 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(12px)",
      y: -10,
      transition: {
        opacity: { duration: 0.2 },
        filter: { duration: 0.3 },
        y: { type: "spring", stiffness: 80, damping: 20 },
      },
    },
  };
 
  return (
    <div className="w-full">
      <motion.div
        ref={wrapperRef}
        className="w-full max-w-3xl"
        variants={containerVariants}
        animate={isActive || inputValue ? "expanded" : "collapsed"}
        initial="collapsed"
        style={{ overflow: "hidden", borderRadius: 32, background: "#fff" }}
        onClick={handleActivate}
      >
        <div className="flex flex-col items-stretch w-full h-full">
          {/* Input Row */}
          <div className="flex items-center gap-2 p-3 rounded-full bg-white max-w-3xl w-full">
            <button
              className="p-3 rounded-full hover:bg-gray-100 transition"
              title="Attach file"
              type="button"
              tabIndex={-1}
            >
              <Paperclip size={20} />
            </button>
 
            {/* Text Input & Placeholder */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 border-0 outline-0 rounded-md py-2 text-base bg-transparent w-full font-normal"
                style={{ position: "relative", zIndex: 1 }}
                onFocus={handleActivate}
              />
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
                <AnimatePresence mode="wait">
                  {showPlaceholder && !isActive && !inputValue && (
                    <motion.span
                      key={placeholderIndex}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        zIndex: 0,
                      }}
                      variants={placeholderContainerVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {PLACEHOLDERS[placeholderIndex]
                        .split("")
                        .map((char, i) => (
                          <motion.span
                            key={i}
                            variants={letterVariants}
                            style={{ display: "inline-block" }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </motion.span>
                        ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
 
            <button
              className="flex items-center gap-1 text-white p-3 rounded-full font-medium justify-center bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black hover:opacity-90 transition-opacity"
              title="Send"
              type="button"
              tabIndex={-1}
            >
              <Send size={18} />
            </button>
          </div>
 
          {/* Expanded Controls */}
          <motion.div
            className="w-full flex justify-start px-4 items-center text-sm"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
                pointerEvents: "none" as const,
                transition: { duration: 0.25 },
              },
              visible: {
                opacity: 1,
                y: 0,
                pointerEvents: "auto" as const,
                transition: { duration: 0.35, delay: 0.08 },
              },
            }}
            initial="hidden"
            animate={isActive || inputValue ? "visible" : "hidden"}
            style={{ marginTop: 8 }}
          >
            <div className="flex gap-3 items-center w-full">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium group ${
                  includeTextOnThumbnail
                    ? "bg-blue-600/10 outline outline-blue-600/60 text-blue-950"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Toggle text on thumbnail"
                type="button"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setIncludeTextOnThumbnail((prev) => !prev);
                }}
              >
                <TypeIcon
                  className="transition-all"
                  size={18}
                />
                Include text on thumbnail?
              </button>

              <AnimatePresence initial={false}>
                {includeTextOnThumbnail && (
                  <motion.div
                    key="thumbnail-text-input-wrapper"
                    initial={{ opacity: 0, width: 0, x: -20 }}
                    animate={{ opacity: 1, width: "100%", x: 0 }}
                    exit={{ opacity: 0, width: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 150, damping: 20, duration: 0.3 }}
                    className="overflow-hidden flex-1 flex items-center"
                  >
                    <input
                      type="text"
                      value={thumbnailText}
                      onChange={(e) => setThumbnailText(e.target.value)}
                      placeholder="Enter text for thumbnail..."
                      className="w-full px-4 py-2 text-sm rounded-l-full border border-r-0 border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700 placeholder-gray-400"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="relative">
                      <select
                        value={selectedTextStyle}
                        onChange={(e) => setSelectedTextStyle(e.target.value)}
                        className="pl-6 pr-8 py-2 text-sm rounded-r-full border border-l-0 border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-100 text-gray-700 appearance-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {TEXT_STYLE_OPTIONS.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <ChevronDown size={18} className="text-gray-500" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
 
export { AIChatInput }; 