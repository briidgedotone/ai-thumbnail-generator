"use client";

import React, { useState } from 'react';
import { Sparkles, Zap, Rocket, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  // Plan data
  const selectPlanTiers = [
    {
      name: "Free",
      icon: <Sparkles className="h-6 w-6" />,
      price: 0,
      description: "Perfect for individual creators.",
      features: [
        "3 credits",
        "Thumbnail, video title, description, tags generation",
        "YouTube-ready resolution (1280x720px)",
        "Standard email support"
      ],
      popular: false,
      color: "blue",
      ctaText: "Continue for Free",
      onClick: () => handlePlanSelection("Free")
    },
    {
      name: "Pro",
      icon: <Zap className="h-6 w-6" />,
      price: 29,
      description: "One-time purchase for growing creators and teams.",
      features: [
        "50 credits included",
        "YouTube-ready resolution (1280x720px)",
        "Priority email support",
        "Lifetime Pro access"
      ],
      popular: true,
      color: "purple",
      ctaText: "Buy Pro",
      onClick: handleProPlanSelection
    },
    {
      name: "Studio",
      icon: <Rocket className="h-6 w-6" />,
      price: "Custom",
      description: "Built for agencies, multi-channel creators, or businesses.",
      features: [
        "Everything in Pro",
        "Bulk thumbnail generation for multiple videos",
        "White-label options for client branding",
        "Multi-channel management dashboard",
        "Dedicated account manager and priority support"
      ],
      popular: false,
      color: "green",
      ctaText: "Contact Sales",
      onClick: () => {} // Do nothing
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Stepper */}
        <div className="flex items-center justify-center mb-16">
          <div className="flex items-center">
            {/* Step 1 - Registration */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] rounded-full flex items-center justify-center text-white text-sm font-medium">
                <Check className="w-4 h-4" />
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900">Registration</span>
            </div>
            
            {/* Horizontal Line */}
            <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
            
            {/* Step 2 - Choose plan */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900">Choose plan</span>
            </div>
            
            {/* Horizontal Line */}
            <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
            
            {/* Step 3 - Pay */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                3
              </div>
              <span className="ml-3 text-sm font-medium text-gray-500">Pay</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose your plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your YouTube thumbnail generation needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto ">
          {selectPlanTiers.map((tier, index) => (
            <div
              key={tier.name}
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
                    {tier.price === "Custom" ? (
                      <span className="text-4xl font-bold text-zinc-900">
                        Custom Pricing
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-zinc-900">
                          ${tier.price}
                        </span>
                        {typeof tier.price === 'number' && tier.price > 0 && <span className="text-zinc-600">/month</span>}
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
                  onClick={tier.onClick}
                  disabled={isLoading}
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
                >
                  {tier.name === "Studio" ? (
                    <>
                      <span className="group-hover:hidden">{tier.ctaText}</span>
                      <span className="hidden group-hover:inline">Coming soon!</span>
                    </>
                  ) : (
                    tier.ctaText
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 