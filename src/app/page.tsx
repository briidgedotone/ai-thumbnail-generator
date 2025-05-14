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
import { PricingSection, type CreativePricingTier } from "@/components/landing/PricingSection";
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

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const howItWorksSteps = [
    {
      year: "Step 1",
      title: "Ideate",
      content: (
        <>
          <p className="mb-2">
            Brainstorm and develop your concepts with our intuitive tools and templates. 
            Explore different possibilities and lay the groundwork for your creation.
          </p>
          <p>
            Our platform provides you with the resources to effectively plan and structure your ideas before moving to the generation phase.
          </p>
        </>
      ),
    },
    {
      year: "Step 2",
      title: "Generate",
      content: (
        <>
          <p className="mb-2">
            Transform your ideas into polished content with our advanced generation tools. 
            Utilize AI assistance and powerful features to bring your vision to life.
          </p>
          <p>
            Whether it's text, images, or other media, our generation engine is designed for quality and efficiency.
          </p>
        </>
      ),
    },
    {
      year: "Step 3",
      title: "Post",
      content: (
        <>
          <p className="mb-2">
            Share your creations with the world through our integrated publishing platform or export them for use elsewhere. 
            Reach your audience effortlessly.
          </p>
          <p>
            Manage your content, track its performance, and engage with your community, all from one place.
          </p>
        </>
      ),
    },
  ];

  const creativePricingTiers: CreativePricingTier[] = [
    {
      name: "Starter",
      icon: <Sparkles className="h-6 w-6" />,
      price: 9,
      description: "Perfect for individuals just getting started.",
      features: ["5 projects", "Basic templates", "Standard support", "1GB storage"],
      popular: false,
      color: "blue",
    },
    {
      name: "Pro",
      icon: <Zap className="h-6 w-6" />,
      price: 29,
      description: "Ideal for professionals and small teams.",
      features: ["20 projects", "Premium templates", "Priority support", "10GB storage", "Advanced analytics"],
      popular: true,
      color: "purple",
    },
    {
      name: "Studio",
      icon: <Rocket className="h-6 w-6" />,
      price: 79,
      description: "For growing businesses and creative teams.",
      features: ["Unlimited projects", "All templates", "24/7 dedicated support", "100GB storage", "Team collaboration", "Custom branding"],
      popular: false,
      color: "green",
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
              variant="ghost"
              className="rounded-lg border-2 border-black bg-transparent hover:bg-gray-100 text-black px-5 text-base font-medium shadow-sm h-[44px]">
              Log in
            </Button>
            <Button
              className="rounded-lg border-2 border-black bg-black hover:bg-black/90 text-white px-5 text-base font-medium shadow-sm h-[44px]">
              Start for free
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
