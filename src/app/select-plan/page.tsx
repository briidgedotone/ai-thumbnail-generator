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

      const result = await response.json();
      console.log('Plan selection successful:', result);
      
      toast.success(`${planName} plan selected successfully!`);
      
      // Redirect to dashboard after successful plan selection
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error selecting plan:', error);
      toast.error('Failed to select plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Plan data with custom onClick handlers
  const selectPlanTiers = [
    {
      name: "Free",
      icon: <Sparkles className="h-6 w-6" />,
      price: 0,
      description: "Perfect for individual creators.",
      features: [
        "3 thumbnails per month.",
        "1 iteration per thumbnail",
        "YouTube-ready resolution (1280x720px).",
        "Standard email support."
      ],
      popular: false,
      color: "blue",
      ctaText: isLoading ? "Selecting..." : "Choose Free",
      ctaLink: "#",
      onClick: () => handlePlanSelection("Free")
    },
    {
      name: "Pro",
      icon: <Zap className="h-6 w-6" />,
      price: 19,
      description: "Ideal for growing creators and teams.",
      features: [
        "20 thumbnails.",
        "5 iterations per thumbnail",
        "upload images for inspiration",
        "YouTube-ready resolution (1280x720px).",
        "Email priority support."
      ],
      popular: true,
      color: "purple",
      ctaText: isLoading ? "Selecting..." : "Choose Pro",
      ctaLink: "#",
      onClick: () => handlePlanSelection("Pro")
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
        "Dedicated account manager and email priority support."
      ],
      popular: false,
      color: "green",
      ctaText: isLoading ? "Selecting..." : "Choose Studio",
      ctaLink: "#",
      onClick: () => handlePlanSelection("Studio")
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900">
            Choose Your Plan
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Select the perfect plan to start creating amazing thumbnails for your YouTube channel.
          </p>
        </div>
        
        <PricingSection tiers={selectPlanTiers} />
      </div>
    </div>
  );
} 