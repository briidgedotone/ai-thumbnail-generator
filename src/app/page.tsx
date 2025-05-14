"use client"; // Added directive for client component

import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, Sparkles, Zap, Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection, type CreativePricingTier as PricingSectionTierType } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FooterSection } from "@/components/landing/FooterSection";

// Component for list items in navigation dropdown
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

// Update CreativePricingTier type definition
export interface CreativePricingTier {
  name: string;
  icon: React.ReactNode;
  price: number; // Use -1 for Custom Pricing
  description: string;
  features: string[];
  popular: boolean;
  color: string;
  ctaText: string; // New field for button text
  ctaLink: string; // New field for button link
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const howItWorksSteps = [
    {
      year: "Step 1",
      title: "Ideate",
      content: (
        <>
          <p className="mb-4 text-lg">
            Launch Your Creative Process by Entering Video Details and Tailoring Designs to Reflect Your Brand's Unique Identity
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Input Your Vision</li>
            <li>Upload Assets</li>
            <li>Choose a Style</li>
          </ul>
        </>
      ),
    },
    {
      year: "Step 2",
      title: "Generate",
      content: (
        <>
          <p className="mb-4 text-lg">
            Empower AI to Rapidly Produce Visually Stunning Thumbnails Crafted to Boost Click-Through Rates and Viewer Engagement
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Instant Creations</li>
            <li>Smart Suggestions</li>
            <li>Fine-Tune Easily</li>
          </ul>
        </>
      ),
    },
    {
      year: "Step 3",
      title: "Post",
      content: (
        <>
          <p className="mb-4 text-lg">
            Effortlessly Download Your High-Resolution Thumbnail and Upload It to YouTube for Immediate, High-Impact Audience Connection
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Download Fast</li>
            <li>Direct Upload</li>
            <li>Save for Later</li>
          </ul>
        </>
      ),
    },
  ];

  const creativePricingTiers: CreativePricingTier[] = [
    {
      name: "Free",
      icon: <Sparkles className="h-6 w-6" />,
      price: 0,
      description: "Perfect for individual creators.", // Corrected spelling
      features: [
        "3 thumbnails per month.",
        "1 iteration per thumbnail",
        "YouTube-ready resolution (1280x720px).",
        "Standard email support."
      ],
      popular: false,
      color: "blue",
      ctaText: "Get Started Free",
      ctaLink: "/auth"
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
      ctaLink: "/auth?plan=pro" // Example link for a specific plan
    },
    {
      name: "Studio",
      icon: <Rocket className="h-6 w-6" />,
      price: -1, // Sentinel for Custom Pricing
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
      ctaText: "Contact Sales",
      ctaLink: "/contact" // Example link for contact page
    },
  ];

  return (
    <div className="min-h-screen bg-background relative grainy-background hero-backdrop-circle-container">
      {/* Modified Header */}
      <header className="h-[90px]">
        <div className="w-full px-10 flex h-full items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="#" className="text-2xl font-bold text-gray-900 h-[44px] flex items-center">
              LOGO
            </Link>
          </div>

          {/* Auth Buttons Desktop - Simplified */}
          <div className="flex items-center space-x-2">
            <Button
              asChild
              variant="ghost"
              className="rounded-lg border-2 border-black bg-white hover:bg-gray-100 text-black px-5 text-base font-medium h-[44px] shadow-[3px_3px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              <Link href="/auth">Log in</Link>
            </Button>
            <Button
              asChild
              className="rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-5 text-base font-medium h-[44px] shadow-[3px_3px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              <Link href="/auth">Start for free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Remove padding from main content */}
      <main>
        <HeroSection />
        <HowItWorksSection steps={howItWorksSteps} />
        <FeaturesSection />
        <PricingSection tiers={creativePricingTiers} />
        <FAQSection />
      </main>

      <FooterSection />
    </div>
  );
}
