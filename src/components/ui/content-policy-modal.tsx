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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <DialogTitle>Content Policy Violation</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            Your thumbnail request was blocked by our safety system. Don't worry - we've refunded your credit!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {creditRefunded && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                ✅ Your credit has been automatically refunded
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              <h4 className="font-medium text-sm">Suggestions to fix this:</h4>
            </div>
            
            <ul className="space-y-2 text-sm text-gray-600">
              {displaySuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex-1"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Edit Description
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 