"use client"; // Added directive for client component

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, CheckCircle, ChevronDown, ChevronRight, Menu as MenuIcon } from "lucide-react";
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
// import { Timeline } from "@/components/ui/timeline"; // Commented out to fix build error
import { CreativePricing } from "@/components/ui/creative-pricing";
import { Sparkles, Zap, Rocket } from "lucide-react";

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

  const creativePricingTiers = [
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
    <div className="min-h-screen bg-background relative overflow-hidden grainy-background hero-backdrop-circle-container">
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
        {/* Hero Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-7xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Generate <span style={{ color: '#02ADD2' }}>Beast</span> Thumbnails in Seconds—Not Hours
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  The all-in-one platform for creators, designers, and innovators. Bring your vision to life with our powerful tools.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button
                  size="lg"
                  className="rounded-lg border-2 border-[#d70e36] bg-[#FF0032] text-white h-[54px] py-4 px-8 text-lg transition-all duration-300 hover:bg-[#FF0032]/90">
                  Try it Free <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-lg border-2 border-black bg-transparent text-black h-[54px] py-4 px-8 text-lg transition-all duration-300 hover:bg-gray-100">
                  See it in Action
                </Button>
              </div>
            </div>
            <div className="mt-16 flex justify-center">
              <div className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-lg border border-border/40 bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Abstract data visualization with charts and graphs"
                  layout="fill"
                  objectFit="cover"
                  priority
                  className="rounded-lg" // Ensure image corners match container if needed
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Redesigned with Vertical Timeline */}
        <section className="py-16 md:py-24 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border-2 border-[#18181B]/20 bg-background px-3 py-1 text-sm">
                  <span>How It Works</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  From Concept to Reality
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  Our streamlined workflow helps you bring your vision to life in three simple steps
                </p>
              </div>
            </div>

            <div className="mt-16 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-16 md:mb-24">
                {/* Step Number & Content */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#18181B] bg-[#FFB900] text-xl font-bold text-[#18181B] shadow-[3px_3px_0px_0px_#18181B]">
                      01
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">Ideate</h3>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground mb-6">
                    Brainstorm and develop your concepts with our intuitive tools and templates. Explore different creative possibilities with AI-powered suggestions.
                  </p>
                  <ul className="space-y-2">
                    {["Real-time collaboration", "AI-powered suggestions", "Built-in templates"].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-[#FFB900]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Media Placeholder */}
                <div className="w-full md:w-1/2 aspect-video md:aspect-square order-1 md:order-2">
                  <div className="h-full w-full overflow-hidden rounded-xl border-2 border-[#18181B] bg-muted shadow-[6px_6px_0px_0px_#18181B]">
                    <div className="relative h-full w-full">
                      <Image
                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
                        alt="Ideation process with sticky notes and whiteboard"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              <div className="hidden md:flex justify-center my-4">
                <div className="h-16 w-0.5 bg-[#18181B]/20"></div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-16 md:mb-24">
                {/* Media Placeholder */}
                <div className="w-full md:w-1/2 aspect-video md:aspect-square">
                  <div className="h-full w-full overflow-hidden rounded-xl border-2 border-[#18181B] bg-muted shadow-[6px_6px_0px_0px_#18181B]">
                    <div className="relative h-full w-full">
                      <Image
                        src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop"
                        alt="Content generation with AI tools"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Step Number & Content */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#18181B] bg-[#FFB900] text-xl font-bold text-[#18181B] shadow-[3px_3px_0px_0px_#18181B]">
                      02
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">Generate</h3>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground mb-6">
                    Transform your ideas into polished content with our advanced generation tools. Utilize AI assistance to create high-quality materials in minutes, not hours.
                  </p>
                  <ul className="space-y-2">
                    {["One-click generation", "Multi-format output", "Style customization"].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-[#FFB900]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Connector Line */}
              <div className="hidden md:flex justify-center my-4">
                <div className="h-16 w-0.5 bg-[#18181B]/20"></div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Step Number & Content */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#18181B] bg-[#FFB900] text-xl font-bold text-[#18181B] shadow-[3px_3px_0px_0px_#18181B]">
                      03
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">Publish</h3>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground mb-6">
                    Share your creations with the world through our integrated publishing platform or export them for use elsewhere. Schedule posts and track performance metrics.
                  </p>
                  <ul className="space-y-2">
                    {["Multi-channel publishing", "Engagement analytics", "Scheduled releases"].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-[#FFB900]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Media Placeholder */}
                <div className="w-full md:w-1/2 aspect-video md:aspect-square order-1 md:order-2">
                  <div className="h-full w-full overflow-hidden rounded-xl border-2 border-[#18181B] bg-muted shadow-[6px_6px_0px_0px_#18181B]">
                    <div className="relative h-full w-full">
                      <Image
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                        alt="Publishing and analytics dashboard"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border border-border/40 bg-muted px-3 py-1 text-sm">
                  <span>Features</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Designed for Everyone
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  Powerful tools that cater to all your creative needs
                </p>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* For Creators */}
              <Card className="border border-border/40">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-xl font-bold">For Creators</h3>
                  <p className="mt-2 text-muted-foreground">
                    Everything you need to produce high-quality content at scale
                  </p>
                  <ul className="mt-4 space-y-2">
                    {["Content templates", "AI-assisted writing", "Multi-format export", "Scheduling tools"].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full justify-between rounded-full bg-[#FFB900]/10 text-[#FFB900] hover:bg-[#FFB900]/20 shadow-sm">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* For Editors */}
              <Card className="border border-border/40">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-xl font-bold">For Editors</h3>
                  <p className="mt-2 text-muted-foreground">
                    Advanced editing tools to refine and polish your content
                  </p>
                  <ul className="mt-4 space-y-2">
                    {["Collaborative editing", "Version history", "Grammar & style checks", "SEO optimization"].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full justify-between rounded-full bg-[#FFB900]/10 text-[#FFB900] hover:bg-[#FFB900]/20 shadow-sm">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* For Your Community */}
              <Card className="border border-border/40">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-xl font-bold">For Your Community</h3>
                  <p className="mt-2 text-muted-foreground">
                    Tools to engage and grow your audience effectively
                  </p>
                  <ul className="mt-4 space-y-2">
                    {["Comment moderation", "Audience insights", "Community forums", "Member management"].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full justify-between rounded-full bg-[#FFB900]/10 text-[#FFB900] hover:bg-[#FFB900]/20 shadow-sm">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section - Replaced with CreativePricing */}
        <section id="pricing" className="py-16 md:py-24 bg-muted/40">
          <CreativePricing
            tag="Flexible Plans"
            title="Choose Your Perfect Fit"
            description="Simple, transparent pricing for businesses of all sizes. No hidden fees, ever."
            tiers={creativePricingTiers}
          />
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border border-border/40 bg-muted px-3 py-1 text-sm">
                  <span>FAQ</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Frequently Asked Questions
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  Find answers to common questions about our platform
                </p>
              </div>
            </div>

            <div className="mx-auto mt-12 max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does the free trial work?</AccordionTrigger>
                  <AccordionContent>
                    Our free trial gives you full access to all features for 14 days with no credit card required. At the end of the trial, you can choose the plan that best fits your needs or continue with the free basic version with limited features.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I change my plan later?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can upgrade, downgrade, or cancel your plan at any time. If you upgrade, the new pricing will be prorated for the remainder of your billing cycle. If you downgrade, the new pricing will take effect at the start of your next billing cycle.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans. Enterprise customers can also pay by invoice with net-30 terms.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How secure is my data?</AccordionTrigger>
                  <AccordionContent>
                    We take security seriously. All data is encrypted both in transit and at rest. We use industry-standard security measures and regular security audits to ensure your data remains protected. Our platform is GDPR compliant and we offer data processing agreements for Enterprise customers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
                  <AccordionContent>
                    We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with our service within the first 30 days, contact our support team for a full refund, no questions asked.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/40 py-10">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                  <span className="font-bold text-primary-foreground">B</span>
                </div>
                <span className="font-semibold">Brand</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Empowering creators with innovative tools to bring their ideas to life.
              </p>
              <div className="mt-4 flex space-x-3">
                {/* Social Media Icons */}
                {["twitter", "facebook", "instagram", "github"].map((social) => (
                  <a key={social} href="#" className="rounded-full border border-border/40 p-2">
                    <span className="sr-only">{social}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      {social === "twitter" && (
                        <>
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </>
                      )}
                      {social === "facebook" && (
                        <>
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </>
                      )}
                      {social === "instagram" && (
                        <>
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </>
                      )}
                      {social === "github" && (
                        <>
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </>
                      )}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {["About", "Careers", "Blog", "Legal"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium">Resources</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {["Documentation", "Help Center", "Community", "Tutorials"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium">Subscribe to our newsletter</h3>
              <p className="mt-4 text-sm text-muted-foreground">
                Get the latest updates and news directly to your inbox.
              </p>
              <div className="mt-4 flex gap-2">
                <Input placeholder="Enter your email" className="max-w-[240px]" />
                <Button className="rounded-full bg-[#FFB900] hover:bg-[#FFB900]/90 text-black shadow-sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
