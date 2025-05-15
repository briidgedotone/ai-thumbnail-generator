"use client";

import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { cn } from '@/lib/utils';

interface ThumbnailStyleSelectorProps {
  selectedStyle: string | null;
  onSelectStyle: (style: string) => void;
}

const styles = [
  { id: 'beast-style', name: 'Beast Style', imagePath: '/thumbnail-styles/01-beast-style.png' },
  { id: 'minimalist-style', name: 'Minimalist Style', imagePath: '/thumbnail-styles/02-minimalist-style.png' },
  { id: 'cinematic-style', name: 'Cinematic Style', imagePath: '/thumbnail-styles/03-cinematic-style.png' },
  { id: 'clickbait-style', name: 'Clickbait Style', imagePath: '/thumbnail-styles/04-clickbait-style.jpg' },
];

export function ThumbnailStyleSelector({ selectedStyle, onSelectStyle }: ThumbnailStyleSelectorProps) {
  return (
    <div className="mb-4 w-full">
      <label className="block text-sm font-medium text-neutral-700 mb-1 ml-0">
        Choose a Thumbnail Style
      </label>
      <div className="grid grid-cols-4 gap-3">
        {styles.map((style) => (
          <div
            key={style.id}
            onClick={() => onSelectStyle(style.id)}
            className={cn(
              'w-full pb-[66.6666%] rounded-md cursor-pointer transition-all relative overflow-hidden group',
              selectedStyle === style.id
                ? 'ring-2 ring-pink-500 shadow-lg'
                : 'hover:shadow-md',
            )}
          >
            <Image
              src={style.imagePath}
              alt={style.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-sm font-medium">{style.name}</span>
            </div>
            {selectedStyle === style.id && (
                <div className="absolute bottom-2 right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded">
                    Selected
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 