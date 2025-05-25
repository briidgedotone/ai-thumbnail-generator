"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Lightbulb, RefreshCw } from "lucide-react";

interface ContentPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  suggestions?: string[];
  creditRefunded?: boolean;
}

export function ContentPolicyModal({
  isOpen,
  onClose,
  onRetry,
  suggestions = [],
  creditRefunded = false
}: ContentPolicyModalProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await onRetry();
    setIsRetrying(false);
    onClose();
  };

  const defaultSuggestions = [
    'Remove references to specific copyrighted characters (e.g., Spider-Man, Marvel characters)',
    'Avoid violent or shocking language',
    'Focus on general gaming content instead of specific franchises',
    'Use descriptive words about emotions and reactions without extreme language'
  ];

  const displaySuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <DialogTitle className="text-gray-900 dark:text-white">Content Policy Violation</DialogTitle>
          </div>
          <DialogDescription className="text-left text-gray-600 dark:text-gray-300">
            Your thumbnail request was blocked by our safety system. Don&apos;t worry - we&apos;ve refunded your credit!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {creditRefunded && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✅ Your credit has been automatically refunded
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              <h4 className="font-medium text-sm text-gray-900 dark:text-white">Suggestions to fix this:</h4>
            </div>
            
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {displaySuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 