import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, CheckCircle, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground">B</span>
            </div>
            <span className="font-semibold">Brand</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">Features</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">Pricing</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">Resources</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">FAQ</a>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">Log in</Button>
              <Button size="sm">Sign up</Button>
            </div>
          </div>
          <button className="block md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Transform Your Ideas into Reality
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  The all-in-one platform for creators, designers, and innovators. Bring your vision to life with our powerful tools.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="gap-1">
                  Start Now <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="mt-16 flex justify-center">
              <div className="relative h-[300px] w-full max-w-[700px] overflow-hidden rounded-lg border border-border/40 bg-muted">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Image Placeholder
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border border-border/40 bg-background px-3 py-1 text-sm">
                  <span>How It Works</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Simple Three-Step Process
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  Our streamlined workflow helps you go from concept to completion in no time
                </p>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mt-4 text-xl font-bold">Ideate</h3>
                <p className="mt-2 text-muted-foreground">
                  Brainstorm and develop your concepts with our intuitive tools and templates
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mt-4 text-xl font-bold">Generate</h3>
                <p className="mt-2 text-muted-foreground">
                  Transform your ideas into polished content with our advanced generation tools
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mt-4 text-xl font-bold">Post</h3>
                <p className="mt-2 text-muted-foreground">
                  Share your creations with the world through our integrated publishing platform
                </p>
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
                  <Button variant="ghost" className="mt-6 w-full justify-between">
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
                  <Button variant="ghost" className="mt-6 w-full justify-between">
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
                  <Button variant="ghost" className="mt-6 w-full justify-between">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 md:py-24 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border border-border/40 bg-background px-3 py-1 text-sm">
                  <span>Pricing</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Choose Your Plan
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  Flexible pricing options to match your needs and scale with your growth
                </p>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Basic Plan */}
              <Card className="flex flex-col border border-border/40">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">Basic</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-bold">$9</span>
                      <span className="ml-1 text-muted-foreground">/month</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Perfect for individuals just getting started
                    </p>
                    <ul className="mt-6 space-y-3">
                      {["5 projects", "Basic templates", "Standard support", "1GB storage"].map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="mt-6 w-full">Get Started</Button>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="flex flex-col border border-border/40">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">Premium</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-bold">$29</span>
                      <span className="ml-1 text-muted-foreground">/month</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Ideal for professionals and small teams
                    </p>
                    <ul className="mt-6 space-y-3">
                      {["20 projects", "Premium templates", "Priority support", "10GB storage", "Advanced analytics"].map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="mt-6 w-full" variant="default">Get Started</Button>
                </CardContent>
              </Card>

              {/* Studio Plan */}
              <Card className="flex flex-col border border-border/40 bg-primary text-primary-foreground">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex-1">
                    <div className="inline-flex items-center rounded-full bg-primary-foreground/10 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                      Popular
                    </div>
                    <h3 className="mt-2 text-lg font-bold">Studio</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-bold">$79</span>
                      <span className="ml-1 opacity-80">/month</span>
                    </div>
                    <p className="mt-2 text-sm opacity-90">
                      For growing businesses and creative teams
                    </p>
                    <ul className="mt-6 space-y-3">
                      {[
                        "Unlimited projects",
                        "All templates",
                        "24/7 dedicated support",
                        "100GB storage",
                        "Team collaboration",
                        "Custom branding"
                      ].map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="mt-6 w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="flex flex-col border border-border/40">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">Enterprise</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-bold">Custom</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Tailored solutions for large organizations
                    </p>
                    <ul className="mt-6 space-y-3">
                      {[
                        "Custom solutions",
                        "Enterprise-grade security",
                        "Dedicated account manager",
                        "Unlimited storage",
                        "API access",
                        "On-site training",
                        "SLA guarantee"
                      ].map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="outline" className="mt-6 w-full">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
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
                <Button variant="default">Subscribe</Button>
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
