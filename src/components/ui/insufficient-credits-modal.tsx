"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Zap, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits: number;
  userTier?: string; // Added to handle different messaging for Pro vs Free users
}

export function InsufficientCreditsModal({ 
  isOpen, 
  onClose,
  currentCredits,
  userTier = 'free'
}: InsufficientCreditsModalProps) {
  const isProUser = userTier === 'pro';
  
  const handleUpgradeOrBuy = async () => {
    try {
      // Both free and pro users go through the same checkout process
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    }
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-6 shadow-lg duration-200 rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              {isProUser ? "Credits Used Up" : "Insufficient Credits"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-left">
              {isProUser 
                ? `You've used all your Pro credits. Get 50 more credits for $29 to continue creating.`
                : `You have ${currentCredits} credits remaining. Upgrade to Pro and get 50 credits for $29.`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="rounded-lg bg-gradient-to-r from-[#FF5C8D]/10 via-[#FF0000]/10 to-[#FFA600]/10 p-4 border border-[#FF5C8D]/20">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600]">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {isProUser ? "50 More Credits - $29" : "Upgrade to Pro - $29"}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isProUser 
                      ? "Add 50 credits to your account"
                      : "Get Pro features + 50 credits"
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white hover:opacity-90 transition-opacity border-0"
                onClick={handleUpgradeOrBuy}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isProUser ? "Buy 50 Credits" : "Upgrade to Pro"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
} 