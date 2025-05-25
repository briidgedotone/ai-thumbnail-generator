"use client";

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

interface BeastStyleInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BeastStyleInfoPopup({ isOpen, onClose }: BeastStyleInfoPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">😈</span>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold">Beast Style</h3>
                    <p className="text-white/90 text-sm">High-impact thumbnail generation</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Info section */}
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-blue-900 font-semibold mb-1">How Beast Style Works</h4>
                      <p className="text-blue-800 text-sm leading-relaxed">
                        Beast Style generates two types of results based on your prompt. You can control whether a person appears in your thumbnail by adding <span className="font-mono bg-blue-100 px-1 rounded">(NO PERSON)</span> to your prompt.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Examples */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* With Person */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-1">With Person</h4>
                      <p className="text-sm text-gray-600">Normal prompt</p>
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/beast-person.png"
                        alt="Beast style with person example"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 font-medium mb-1">Example prompt:</p>
                      <p className="text-sm text-gray-600 italic">
                        "in a submarine surrounded with orcas"
                      </p>
                    </div>
                  </div>

                  {/* Without Person */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-1">Without Person</h4>
                      <p className="text-sm text-gray-600">Add "(NO PERSON)" to prompt</p>
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/beast-no-person.png"
                        alt="Beast style without person example"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 font-medium mb-1">Example prompt:</p>
                      <p className="text-sm text-gray-600 italic">
                        "in a submarine surrounded with orcas <span className="font-mono bg-yellow-100 px-1 rounded">(NO PERSON)</span>"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <h4 className="text-green-900 font-semibold mb-2">💡 Pro Tips</h4>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Use "(NO PERSON)" when you want to focus on objects, landscapes, or concepts</li>
                    <li>• Regular prompts work best for reaction-based or personality-driven content</li>
                    <li>• Both styles maintain the high-impact, bright, and energetic Beast aesthetic</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 