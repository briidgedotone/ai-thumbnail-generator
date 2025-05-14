"use client";

import { CreativePricing } from "@/components/ui/creative-pricing";
import React from 'react';

// Define Tier type locally based on usage in page.tsx
// Ideally, CreativePricing component would export this type
export interface CreativePricingTier {
  name: string;
  icon: React.ReactNode;
  price: number;
  description: string;
  features: string[];
  popular: boolean;
  color: string; // color was used in page.tsx, assuming it's for styling within CreativePricing
}

interface PricingSectionProps {
  tiers: CreativePricingTier[];
}

export function PricingSection({ tiers }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-muted/40">
      <CreativePricing
        tag="Flexible Plans"
        title="Choose Your Perfect Fit"
        description="Simple, transparent pricing for businesses of all sizes. No hidden fees, ever."
        tiers={tiers}
      />
    </section>
  );
} 