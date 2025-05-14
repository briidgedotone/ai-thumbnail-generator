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
    trigger: "How does the free trial work?",
    content:
      "Our free trial gives you full access to all features for 14 days with no credit card required. At the end of the trial, you can choose the plan that best fits your needs or continue with the free basic version with limited features.",
  },
  {
    value: "item-2",
    trigger: "Can I change my plan later?",
    content:
      "Yes, you can upgrade, downgrade, or cancel your plan at any time. If you upgrade, the new pricing will be prorated for the remainder of your billing cycle. If you downgrade, the new pricing will take effect at the start of your next billing cycle.",
  },
  {
    value: "item-3",
    trigger: "What payment methods do you accept?",
    content:
      "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans. Enterprise customers can also pay by invoice with net-30 terms.",
  },
  {
    value: "item-4",
    trigger: "How secure is my data?",
    content:
      "We take security seriously. All data is encrypted both in transit and at rest. We use industry-standard security measures and regular security audits to ensure your data remains protected. Our platform is GDPR compliant and we offer data processing agreements for Enterprise customers.",
  },
  {
    value: "item-5",
    trigger: "Do you offer refunds?",
    content:
      "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with our service within the first 30 days, contact our support team for a full refund, no questions asked.",
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
    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
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

          <motion.div 
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-gray-600">
              Still have questions? <a href="#" className="font-medium text-[#FF5C8D] hover:underline">Contact our support team</a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 