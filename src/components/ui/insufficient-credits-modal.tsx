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
}

export function InsufficientCreditsModal({ 
  isOpen, 
  onClose,
  currentCredits
}: InsufficientCreditsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border shadow-2xl">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Insufficient Credits</DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              You need at least 1 credit to generate a thumbnail. You currently have {currentCredits} credits remaining.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="rounded-lg bg-gradient-to-r from-[#FF5C8D]/10 via-[#FF0000]/10 to-[#FFA600]/10 p-4 border border-[#FF5C8D]/20">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600]">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Get More Credits</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upgrade to Pro for 50 credits per month
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
                onClick={() => {
                  // TODO: Navigate to pricing/upgrade page
                  onClose();
                }}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
} 