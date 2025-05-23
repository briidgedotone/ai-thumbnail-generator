"use client"; // Added directive for client component

import React, { useState, useEffect } from "react"; // Added useEffect, useState
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, Sparkles, Zap, Rocket, LogIn, LayoutDashboard } from "lucide-react"; // Added LogIn, LayoutDashboard
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
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection, type CreativePricingTier as PricingSectionTierType } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FooterSection } from "@/components/landing/FooterSection";

import { createSupabaseClient } from "@/lib/supabase/client"; // Import Supabase client
import type { Session } from "@supabase/supabase-js"; // Import Session type

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
  onClick?: () => void; // Optional onClick handler
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseClient();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        // If loading was true and we get a session (or null), it means initial check is done.
        if (loading) setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, loading]); // Added loading to dependency array to ensure setLoading(false) is called correctly after initial check

  const handleProPlanCheckout = async () => {
    // If user is not logged in, redirect to auth with Pro plan intent
    if (!session) {
      window.location.href = '/auth?plan=pro';
      return;
    }

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
      alert('Failed to start checkout. Please try again.');
    }
  };

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
        "3 credits per month.",
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
      price: 29,
      description: "One-time purchase for growing creators.",
      features: [
        "50 credits included",
        "5 iterations per thumbnail",
        "Upload images for inspiration",
        "YouTube-ready resolution (1280x720px)",
        "Priority email support",
        "Lifetime Pro access"
      ],
      popular: true,
      color: "purple",
      ctaText: "Buy Pro Once",
      ctaLink: "/auth"
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
        "Dedicated account manager and priority support."
      ],
      popular: false,
      color: "green",
      ctaText: "Contact Sales",
      ctaLink: "/contact" // Example link for contact page
    },
  ];

  // Skip rendering anything until session check is complete to avoid flash of wrong buttons
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background grainy-background">
  //       <p>Loading...</p> {/* Or a more sophisticated global loader if you have one */}
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background relative grainy-background hero-backdrop-circle-container">
      <header className="h-[90px]">
        <div className="w-full px-10 flex h-full items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center"> {/* Changed to Link to root for consistency */}
              <Image src="/ytza-logo.png" alt="YTZA Logo" width={140} height={44} className="object-contain" />
            </Link>
          </div>

          {/* Auth Buttons Desktop - Conditional Rendering */}
          <div className="flex items-center space-x-2">
            {session ? (
              <Button
                asChild
                className="rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-5 text-base font-medium h-[44px] shadow-[3px_3px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] flex items-center gap-2"
              >
                <Link href="/dashboard"><LayoutDashboard size={18} /> Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-lg border-2 border-black bg-white hover:bg-gray-100 text-black px-5 text-base font-medium h-[44px] shadow-[3px_3px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] flex items-center gap-2"
                >
                  <Link href="/auth"><LogIn size={18}/> Log in</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-5 text-base font-medium h-[44px] shadow-[3px_3px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] flex items-center gap-2"
                >
                  <Link href="/auth"><Sparkles size={18}/> Start for free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

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
