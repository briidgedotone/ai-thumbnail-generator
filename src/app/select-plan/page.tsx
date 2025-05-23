"use client";

import React from 'react';
import { PricingSection } from "@/components/landing/PricingSection";
import { Sparkles, Zap, Rocket } from "lucide-react";

// Plan data (copied from homepage but modified CTAs to redirect to dashboard)
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
    ctaText: "Choose Free",
    ctaLink: "/dashboard"
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
    ctaText: "Choose Pro",
    ctaLink: "/dashboard"
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
    ctaText: "Choose Studio",
    ctaLink: "/dashboard"
  },
];

export default function SelectPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 ">
        
        
        <PricingSection tiers={selectPlanTiers} />
      </div>
    </div>
  );
} 