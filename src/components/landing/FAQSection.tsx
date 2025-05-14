"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

const faqItems = [
  {
    value: "item-1",
    trigger: "What exactly does YTZA do?",
    content:
      "YTZA instantly generates viral-level YouTube thumbnails, titles, descriptions, and tags—based on just your video idea. It's like having MrBeast's entire creative team in one click.",
  },
  {
    value: "item-2",
    trigger: "Do I need any design experience?",
    content:
      "Nope. If you can describe your video in one sentence, YTZA does the rest. No Photoshop, no editing, no stress.",
  },
  {
    value: "item-3",
    trigger: "Can I use my face in the thumbnails?",
    content:
      "Yes! You can upload a photo of yourself, and we'll integrate it into your thumbnail using your selected style.",
  },
  {
    value: "item-4",
    trigger: "What makes YTZA special?",
    content:
      "We're not just generating pretty thumbnails—we study what actually goes viral. Our AI is trained on high-performing content, so your package is built to win clicks.",
  },
  {
    value: "item-5",
    trigger: "Can I generate titles, descriptions, and tags too?",
    content:
      "Absolutely. Every thumbnail comes with a full YouTube package—so you're ready to upload instantly.",
  },
];

// Custom styled accordion components
const CustomAccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionItem>,
  React.ComponentPropsWithoutRef<typeof AccordionItem>
>(({ className, ...props }, ref) => (
  <AccordionItem
    ref={ref}
    className={cn(
      "mb-4 overflow-hidden rounded-xl border-2 border-black bg-white p-1",
      "shadow-[4px_4px_0px_0px_#18181B]",
      "data-[state=open]:shadow-[6px_6px_0px_0px_#18181B]",
      "data-[state=open]:-translate-x-1 data-[state=open]:-translate-y-1",
      "transition-all duration-200",
      className
    )}
    {...props}
  />
));
CustomAccordionItem.displayName = "CustomAccordionItem";

const CustomAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionTrigger>,
  React.ComponentPropsWithoutRef<typeof AccordionTrigger>
>(({ className, children, ...props }, ref) => (
  <AccordionTrigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between p-4 text-left text-lg font-medium transition-all",
      "hover:bg-gray-50 data-[state=open]:bg-gray-50/80",
      "group",
      className
    )}
    {...props}
  >
    <span>{children}</span>
  </AccordionTrigger>
));
CustomAccordionTrigger.displayName = "CustomAccordionTrigger";

const CustomAccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionContent>,
  React.ComponentPropsWithoutRef<typeof AccordionContent>
>(({ className, children, ...props }, ref) => (
  <AccordionContent
    ref={ref}
    className={cn(
      "overflow-hidden px-4 text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-1 text-gray-600">{children}</div>
  </AccordionContent>
));
CustomAccordionContent.displayName = "CustomAccordionContent";

export function FAQSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border-2 border-[#18181B]/20 bg-background px-3 py-1 text-sm shadow-[2px_2px_0px_0px_#18181B]">
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
              Find answers to common questions about our platform
            </p>
          </div>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <CustomAccordionItem value={item.value}>
                  <CustomAccordionTrigger>{item.trigger}</CustomAccordionTrigger>
                  <CustomAccordionContent>{item.content}</CustomAccordionContent>
                </CustomAccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
} 