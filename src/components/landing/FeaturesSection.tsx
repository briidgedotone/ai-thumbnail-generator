"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ChevronRight } from "lucide-react";

const featureCategories = [
  {
    title: "For Creators",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    description: "Everything you need to produce high-quality content at scale",
    features: ["Content templates", "AI-assisted writing", "Multi-format export", "Scheduling tools"],
    buttonText: "Learn more",
  },
  {
    title: "For Editors",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
    description: "Advanced editing tools to refine and polish your content",
    features: ["Collaborative editing", "Version history", "Grammar & style checks", "SEO optimization"],
    buttonText: "Learn more",
  },
  {
    title: "For Your Community",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    description: "Tools to engage and grow your audience effectively",
    features: ["Comment moderation", "Audience insights", "Community forums", "Member management"],
    buttonText: "Learn more",
  },
];

export function FeaturesSection() {
  return (
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
          {featureCategories.map((category) => (
            <Card key={category.title} className="border border-border/40">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  {category.icon}
                </div>
                <h3 className="mt-4 text-xl font-bold">{category.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {category.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {category.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full justify-between rounded-full bg-[#FFB900]/10 text-[#FFB900] hover:bg-[#FFB900]/20 shadow-sm">
                  {category.buttonText} <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 