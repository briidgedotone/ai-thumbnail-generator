"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion'; // Added motion and AnimatePresence

interface ThumbnailStyleSelectorProps {
  selectedStyle: string | null;
  onSelectStyle: (style: string) => void;
}

const stylesData = [
  { id: 'beast-style', name: 'Beast Style', emoji: '🔥', imagePath: '/thumbnail-styles/01-beast-style.png' },
  { id: 'minimalist-style', name: 'Minimalist Style', emoji: '✨', imagePath: '/thumbnail-styles/02-minimalist-style.png' },
  { id: 'cinematic-style', name: 'Cinematic Style', emoji: '🎬', imagePath: '/thumbnail-styles/03-cinematic-style.png' },
  { id: 'clickbait-style', name: 'Clickbait Style', emoji: '😮', imagePath: '/thumbnail-styles/04-clickbait-style.jpg' },
  { id: 'aesthetic-style', name: 'Aesthetic Style', emoji: '🌸', imagePath: '/thumbnail-styles/05-aesthetic-style.png' },
];

interface StyleItemProps {
  styleInfo: { id: string; name: string; emoji: string; imagePath: string };
  isSelected: boolean;
  onSelect: (styleId: string) => void;
  onMouseEnterItem: (styleId: string, rect: DOMRect) => void;
  onMouseLeaveItem: () => void;
  onMouseMoveItem: (e: React.MouseEvent<HTMLDivElement>, itemRect: DOMRect) => void;
  itemRef: React.RefObject<HTMLDivElement | null>;
}

const StyleItem: React.FC<StyleItemProps> = React.memo(({ 
  styleInfo, 
  isSelected, 
  onSelect, 
  onMouseEnterItem, 
  onMouseLeaveItem, 
  onMouseMoveItem,
  itemRef
}) => {
  const handleMouseEnter = () => {
    if (itemRef.current) {
      onMouseEnterItem(styleInfo.id, itemRef.current.getBoundingClientRect());
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (itemRef.current) {
        onMouseMoveItem(e, itemRef.current.getBoundingClientRect());
    }
  };

  return (
    <div
      ref={itemRef}
      onClick={() => onSelect(styleInfo.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeaveItem}
      onMouseMove={handleMouseMove}
      className={cn(
        'w-full pb-[66.6666%] rounded-xl relative overflow-hidden transition-all duration-300 cursor-pointer group', 
        isSelected 
          ? 'shadow-lg scale-[1.03] z-10' 
          : 'hover:ring-2 hover:ring-gray-300 hover:shadow-md'
      )}
    >
      {/* Gradient border effect for selected item */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -inset-[3px] rounded-xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 z-0"
        >
          <div className="absolute inset-[1px] rounded-[10px] bg-white" />
        </motion.div>
      )}
      
      <div className="absolute inset-0 rounded-xl overflow-hidden z-10">
        <Image
          src={styleInfo.imagePath}
          alt={styleInfo.name}
          layout="fill"
          objectFit="cover"
          className={cn(
            "transition-transform duration-300",
            isSelected ? "scale-[1.08]" : "group-hover:scale-[1.04]"
          )}
        />
        
        {/* Selected gradient overlay */}
        {isSelected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
          />
        )}
        
        {/* New Selected indicator with emoji + name */}
        {isSelected && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 px-3 py-2.5 flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              </div>
              <span className="text-white text-sm font-medium drop-shadow-md">{styleInfo.name}</span>
            </div>
            <span className="text-white drop-shadow-md">{styleInfo.emoji}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
});
StyleItem.displayName = 'StyleItem';

export function ThumbnailStyleSelector({ selectedStyle, onSelectStyle }: ThumbnailStyleSelectorProps) {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredItemName, setHoveredItemName] = useState('');
  const [hoveredItemEmoji, setHoveredItemEmoji] = useState('');
  const [selectedItemAnimating, setSelectedItemAnimating] = useState<string | null>(null);
  
  // Ref for the main container to calculate relative mouse positions if needed
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Refs for each StyleItem
  const itemRefs = React.useMemo(() => 
    stylesData.reduce<Record<string, React.RefObject<HTMLDivElement | null>>>((acc, style) => {
      acc[style.id] = React.createRef<HTMLDivElement>();
      return acc;
    }, {}), []);

  const handleStyleSelect = (styleId: string) => {
    if (styleId === selectedStyle) return; // Don't reselect the same style
    setSelectedItemAnimating(styleId);
    onSelectStyle(styleId);
    
    // Clear the animation flag after animation completes
    setTimeout(() => {
      setSelectedItemAnimating(null);
    }, 800);
  };

  const handleMouseEnterItem = useCallback((styleId: string, itemRect: DOMRect) => {
    setHoveredItemId(styleId);
    const style = stylesData.find(s => s.id === styleId);
    if (style) {
      setHoveredItemName(style.name);
      setHoveredItemEmoji(style.emoji);
    }
  }, []);

  const handleMouseLeaveItem = useCallback(() => {
    setHoveredItemId(null);
  }, []);

  const handleMouseMoveItem = useCallback((e: React.MouseEvent<HTMLDivElement>, itemRect: DOMRect) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    // Calculate position relative to the containerRef for the tooltip
    // The cursor event (e.clientX, e.clientY) is viewport-relative.
    // The containerRect.left and containerRect.top are also viewport-relative.
    setCursorPos({
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    });
  }, []);

  return (
    <div className="mb-4 w-full relative" ref={containerRef}> {/* Added relative positioning and ref */}
      <div className="mb-3"> {/* Adjusted margin bottom for the new heading structure */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose a Thumbnail Style</h2>
        <p className="text-gray-500 text-sm">Select a style that best fits your video's content and audience.</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {stylesData.map((styleItem) => (
          <motion.div
            key={styleItem.id}
            animate={
              selectedItemAnimating === styleItem.id 
              ? { 
                  scale: [1, 1.08, 1.03],
                  transition: { duration: 0.4, times: [0, 0.6, 1] }
                }
              : {}
            }
          >
            <StyleItem
              itemRef={itemRefs[styleItem.id]} // Pass the ref to the StyleItem
              styleInfo={styleItem}
              isSelected={selectedStyle === styleItem.id}
              onSelect={handleStyleSelect}
              onMouseEnterItem={handleMouseEnterItem}
              onMouseLeaveItem={handleMouseLeaveItem}
              onMouseMoveItem={handleMouseMoveItem}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {hoveredItemId && (
          <motion.div
            className="absolute px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-xl text-gray-800 text-sm whitespace-nowrap pointer-events-none z-30" // Changed to rounded-full, text-sm. Adjusted padding slightly.
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              translateX: '-50%',
              translateY: '-40px', 
            }}
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {hoveredItemEmoji} {hoveredItemName} 
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 