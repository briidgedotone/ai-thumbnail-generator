"use client"

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GenerationPhase, GENERATION_PHASES } from "@/types/generation";

const shimmer = {
  initial: { x: "-100%" },
  animate: { x: "100%" },
  transition: { 
    duration: 1.5, 
    repeat: Infinity, 
    ease: "easeInOut" 
  }
};

// Skeleton base component
export function Skeleton({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-600/40"
        {...shimmer}
      />
      {children}
    </div>
  );
}

// Enhanced thumbnail skeleton with integrated progress (for video details)
export function ThumbnailSkeleton({ 
  generationPhase = null, 
  generationProgress = 0,
  variant = "detailed" 
}: { 
  generationPhase?: GenerationPhase | null; 
  generationProgress?: number;
  variant?: "detailed" | "simple";
}) {
  const phaseInfo = generationPhase ? GENERATION_PHASES[generationPhase] : null;
  const isGenerating = generationPhase !== null;

  return (
    <Skeleton className="aspect-video w-full rounded-xl relative">
      {/* Generation progress overlay */}
      {isGenerating && (
        <>
          {variant === "simple" ? (
            // Simple breathing animation for YouTube preview
            <>
              <motion.div 
                className="absolute inset-0 bg-black/40"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="text-white"
                >
                  <Sparkles size={32} className="text-pink-400" />
                </motion.div>
              </div>
              {/* Simple progress bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/60 rounded-b-xl overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-b-xl"
                  initial={{ width: 0 }}
                  animate={{ width: `${generationProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </>
          ) : (
            // Detailed progress overlay for video details panel
            <>
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mb-3"
                >
                  <div className="relative">
                    <Sparkles size={24} className="text-pink-400" style={{
                      filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.8))'
                    }} />
                  </div>
                </motion.div>
                
                <h3 className="text-sm font-medium mb-1">{phaseInfo?.name}</h3>
                <p className="text-xs text-gray-300 mb-4">{generationProgress}% complete</p>
                
                {/* Phase dots */}
                <div className="flex items-center gap-2 mb-4">
                  {Object.entries(GENERATION_PHASES).map(([phaseKey, phaseData]) => {
                    const isActive = generationPhase === phaseKey;
                    const isCompleted = generationProgress > phaseData.progress;
                    
                    return (
                      <motion.div
                        key={phaseKey}
                        className={`w-2 h-2 rounded-full ${
                          isCompleted || isActive
                            ? 'bg-gradient-to-r from-pink-500 to-red-500'
                            : 'bg-gray-500'
                        }`}
                        animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                        transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Progress bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600 rounded-b-xl overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-b-xl"
                  initial={{ width: 0 }}
                  animate={{ width: `${generationProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </>
          )}
        </>
      )}
    </Skeleton>
  );
}

// Simple thumbnail skeleton without progress (for static use)
export function SimpleThumbnailSkeleton() {
  return (
    <Skeleton className="aspect-video w-full rounded-xl">
    </Skeleton>
  );
}

// Title skeleton
export function TitleSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  );
}

// Description skeleton
export function DescriptionSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

// Tags skeleton
export function TagsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-6 w-16 rounded-full" />
      ))}
    </div>
  );
}

// Video card skeleton (for YouTube preview) - uses simple variant
export function VideoCardSkeleton({ 
  generationPhase = null, 
  generationProgress = 0 
}: { 
  generationPhase?: GenerationPhase | null; 
  generationProgress?: number; 
}) {
  return (
    <div className="flex flex-col w-full">
      <ThumbnailSkeleton 
        generationPhase={generationPhase} 
        generationProgress={generationProgress}
        variant="simple"
      />
      <div className="flex gap-3 mt-3">
        <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <TitleSkeleton />
          <div className="mt-2">
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
} 