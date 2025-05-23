"use client";

import React, { useState } from 'react';
import { PricingSection } from "@/components/landing/PricingSection";
import { Sparkles, Zap, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SelectPlanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePlanSelection = async (planName: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/select-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to select plan');
      }

      // Redirect to dashboard after successful plan selection
      router.push('/dashboard');
    } catch (error) {
      console.error('Error selecting plan:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to select plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProPlanSelection = async () => {
    setIsLoading(true);
    
    try {
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
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
      setIsLoading(false);
    }
  };

  // Plan data (copied from homepage but modified CTAs to redirect to dashboard)
  const selectPlanTiers = [
    {
      name: "Free",
      icon: <Sparkles className="h-6 w-6" />,
      price: 0,
      description: "Perfect for individual creators.",
      features: [
        "3 credits per month.",
        "1 iteration per thumbnail",
        "YouTube-ready resolution (1280x720px).",
        "Standard email support."
      ],
      popular: false,
      color: "blue",
      ctaText: "Choose Free",
      ctaLink: "/dashboard",
      onClick: () => handlePlanSelection("Free")
    },
    {
      name: "Pro",
      icon: <Zap className="h-6 w-6" />,
      price: 29,
      description: "Ideal for growing creators and teams.",
      features: [
        "50 credits per month.",
        "5 iterations per thumbnail",
        "Upload images for inspiration",
        "YouTube-ready resolution (1280x720px).",
        "Priority email support."
      ],
      popular: true,
      color: "purple",
      ctaText: "Choose Pro",
      ctaLink: "/dashboard",
      onClick: handleProPlanSelection
    },
    {
      name: "Studio",
      icon: <Rocket className="h-6 w-6" />,
      price: -1,
      description: "Built for agencies, multi-channel creators, or businesses.",
      features: [
        "Everything in Pro.",
        "Bulk thumbnail generation for multiple videos.",
        "White-label options for client branding.",
        "Multi-channel management dashboard.",
        "Dedicated account manager and priority support."
      ],
      popular: false,
      color: "green",
      ctaText: "Contact Sales",
      ctaLink: "/contact",
      onClick: () => window.open("/contact", "_blank")
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        
        
        <PricingSection tiers={selectPlanTiers} />
      </div>
    </div>
  );
} 