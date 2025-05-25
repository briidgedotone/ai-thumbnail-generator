"use client";

import React from 'react';
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

// Update CreativePricingTier interface to match page.tsx
export interface CreativePricingTier {
  name: string;
  icon: React.ReactNode;
  price: number; // -1 indicates Custom Pricing
  description: string;
  features: string[];
  popular: boolean;
  color: string;
  ctaText: string;
  ctaLink: string;
  onClick?: () => void; // Optional onClick handler
}

interface PricingSectionProps {
  tiers: CreativePricingTier[];
}

export function PricingSection({ tiers }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-muted/40 relative overflow-hidden">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold rotate-[-1deg] text-zinc-900">
              Choose Your Perfect Fit
            </h2>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-3 bg-[#FF5C8D]/20 rotate-[-1deg] rounded-full blur-sm" />
          </div>
          <p className="mx-auto max-w-screen-md text-lg text-zinc-600 rotate-[-1deg]">
            Simple, transparent pricing for businesses of all sizes. No hidden fees, ever.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn(
                "relative group transition-all duration-300",
                index === 0 && "rotate-[-1deg]",
                index === 1 && "rotate-[1deg]",
                index === 2 && "rotate-[-2deg]"
              )}
            >
              {tier.popular && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute -inset-2 rounded-lg blur-xl -z-10",
                    "bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600]",
                    "opacity-50 group-hover:opacity-75 transition-all duration-300"
                  )}
                />
              )}
              <div className={cn(
                "absolute inset-0 bg-white",
                "border-2 border-black",
                "rounded-lg shadow-[4px_4px_0px_0px_#18181B]",
                "transition-all duration-300",
                "group-hover:shadow-[8px_8px_0px_0px_#18181B]",
                "group-hover:translate-x-[-4px]",
                "group-hover:translate-y-[-4px]"
              )} />

              <div className={cn(
                "relative p-6 transition-all duration-300 h-full flex flex-col",
                "group-hover:translate-x-[-4px]",
                "group-hover:translate-y-[-4px]"
              )}>
                {tier.popular && (
                  <div className="absolute -top-2 -right-2 bg-[#FFA600] text-black font-bold px-3 py-1 rounded-full rotate-12 text-sm border-2 border-black">
                    Popular!
                  </div>
                )}

                <div className="flex-grow">
                  <div className="mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-full mb-4",
                      "flex items-center justify-center",
                      "border-2 border-black",
                      tier.color === "blue" && "text-[#02ADD2]",
                      tier.color === "purple" && "text-[#FF5C8D]",
                      tier.color === "green" && "text-[#FFA600]"
                    )}>
                      {tier.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900">
                      {tier.name}
                    </h3>
                    <p className="text-zinc-600">
                      {tier.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    {tier.price === -1 ? (
                      <span className="text-4xl font-bold text-zinc-900">
                        Custom Pricing
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-zinc-900">
                          ${tier.price}
                        </span>
                        <span className="text-zinc-600">
                          /month
                        </span>
                      </>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3"
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_0px_#18181B]">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-zinc-900">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className={cn(
                    "w-full h-12 text-lg relative mt-auto cursor-pointer group",
                    "border-2 border-black",
                    "transition-all duration-300",
                    "shadow-[4px_4px_0px_0px_#18181B]",
                    "hover:shadow-[6px_6px_0px_0px_#18181B]",
                    "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                    tier.popular 
                      ? "bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white hover:bg-gradient-to-br hover:from-[#FF5C8D] hover:via-[#FF0000] hover:to-[#FFA600]"
                      : tier.name === "Studio"
                        ? "bg-white text-black hover:bg-gray-300 hover:text-gray-600"
                        : "bg-white text-black hover:bg-gray-50"
                  )}
                  onClick={tier.name === "Studio" ? () => {} : tier.onClick}
                  {...(tier.onClick && tier.name !== "Studio" ? {} : tier.name !== "Studio" ? { asChild: true } : {})}
                >
                  {tier.name === "Studio" ? (
                    <>
                      <span className="group-hover:hidden">{tier.ctaText}</span>
                      <span className="hidden group-hover:inline">Coming soon!</span>
                    </>
                  ) : tier.onClick ? (
                    tier.ctaText
                  ) : (
                    <Link href={tier.ctaLink}>{tier.ctaText}</Link>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 