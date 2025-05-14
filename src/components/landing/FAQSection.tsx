"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

export function FAQSection() {
  return (
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
            {faqItems.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.trigger}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
} 