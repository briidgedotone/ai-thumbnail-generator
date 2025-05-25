"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HowItWorksStepFromProps {
  year: string; // Corresponds to "01", "02" etc. for display
  title: string;
  content: React.ReactNode; // Original rich JSX content
}

// Define a more detailed structure for internal use
interface StepDetail {
  id: string; // for key prop
  numericLabel: string;
  title: string;
  description: React.ReactNode; // To hold the original rich content, or a simplified string
  features: string[];
  imageSrc: string;
  imageAlt: string;
}

interface HowItWorksSectionProps {
  steps: HowItWorksStepFromProps[];
}

export function HowItWorksSection({ steps: stepsFromProps }: HowItWorksSectionProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const stepTextRefs = useRef<(HTMLDivElement | null)[]>([]); 

  // Prepare stepDetails by combining props and hardcoded arrays
  // This assumes the hardcoded arrays align with the number of steps passed in props
  const stepDetails: StepDetail[] = stepsFromProps.map((propStep, index) => {
    const hardcodedImageUrls = [
      "/placeholder1.png",
      "/placeholder2.png",
      "/placeholder3.png",
    ];
    const hardcodedImageAlts = [
      "Ideation process with sticky notes and whiteboard",
      "Content generation with AI tools",
      "Publishing and analytics dashboard",
    ];
    
    return {
      id: propStep.title, // Assuming title is unique for key
      numericLabel: `0${index + 1}`,
      title: propStep.title,
      description: propStep.content, // Always use propStep.content which now contains subheading and UL
      features: [], // Clear this, as features are now part of the description
      imageSrc: hardcodedImageUrls[index] || "",
      imageAlt: hardcodedImageAlts[index] || "Image",
    };
  });

  useEffect(() => {
    stepTextRefs.current = stepTextRefs.current.slice(0, stepDetails.length);

    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // Center of viewport
      threshold: 0, // Trigger as soon as any part is visible within rootMargin
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("data-index") || "0", 10);
          setActiveStepIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRefs = stepTextRefs.current;
    currentRefs.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [stepDetails]); // Rerun if stepDetails changes (e.g. if steps prop changes)

  return (
    <section className="py-16 md:py-24 bg-muted/40">
      {/* Section Header */}
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16 md:mb-24">
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
      </div>

      {/* Main Content with Sticky Scroll Reveal */}
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:gap-12 lg:gap-20 xl:gap-24 min-h-[150vh] md:min-h-[180vh]"> {/* Ensure enough scroll height */} 
          {/* Left Column: Scrolling Text Content */}
          <div className="md:flex-1 py-8"> {/* Changed from md:w-1/2 */}
            <div className="space-y-32 md:space-y-48 lg:space-y-64 xl:space-y-80"> {/* Increased spacing for scroll effect */} 
              {stepDetails.map((step, index) => (
                <div
                  key={step.id}
                  ref={el => { stepTextRefs.current[index] = el; }}
                  data-index={index}
                  className={`step-text-content transition-all duration-500 ease-in-out transform ${ 
                    activeStepIndex === index 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-50 md:opacity-30 translate-y-5'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#18181B] bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white text-xl font-bold shadow-[3px_3px_0px_0px_#18181B]">
                      {step.numericLabel}
                    </div>
                    <h3 className="text-5xl font-normal tracking-tight">{step.title}</h3>
                  </div>
                  {typeof step.description === 'string' ? (
                    <p className="text-base md:text-lg text-muted-foreground mb-6">
                      {step.description}
                    </p>
                  ) : (
                    <div className="text-base md:text-lg text-muted-foreground mb-6">
                         {/* Render if step.description is JSX node (original prop value) */}
                         {step.description} {/* This will now render the subheading and the UL from page.tsx */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Sticky Image */} 
          <div className="md:w-[685px] md:flex-none md:sticky md:top-[25vh] h-[540px] mt-12 md:mt-0 flex items-center justify-center"> {/* Changed from md:w-1/2, added md:flex-none */}
            <div className="relative w-full h-full overflow-hidden rounded-xl border border-black bg-muted"> {/* Changed from w-[685px] h-[540px] to w-full h-full */}
              <AnimatePresence initial={false}>
                {stepDetails[activeStepIndex] && (
                   <motion.div
                      key={stepDetails[activeStepIndex].imageSrc}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                   >
                    <Image
                        src={stepDetails[activeStepIndex].imageSrc}
                        alt={stepDetails[activeStepIndex].imageAlt}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Add some basic CSS for the image appearing (animage could be a class for this)
// This would typically be in your globals.css or a relevant CSS module
/*
.animage {
  animation: fadeIn 0.7s ease-in-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
*/ 