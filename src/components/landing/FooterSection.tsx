"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const socialMediaLinks = [
  { name: "twitter", path: "#" },
  { name: "facebook", path: "#" },
  { name: "instagram", path: "#" },
  { name: "github", path: "#" },
];

const companyLinks = ["About", "Careers", "Blog", "Legal"];
const resourceLinks = ["Documentation", "Help Center", "Community", "Tutorials"];

export function FooterSection() {
  return (
    <footer className="border-t border-border/40 bg-muted/40 py-10">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="font-bold text-primary-foreground">B</span> {/* Placeholder Logo */}
              </div>
              <span className="font-semibold">Brand</span> {/* Placeholder Brand Name */}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Empowering creators with innovative tools to bring their ideas to life.
            </p>
            <div className="mt-4 flex space-x-3">
              {socialMediaLinks.map((social) => (
                <a key={social.name} href={social.path} className="rounded-full border border-border/40 p-2">
                  <span className="sr-only">{social.name}</span>
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
                    {social.name === "twitter" && (
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    )}
                    {social.name === "facebook" && (
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    )}
                    {social.name === "instagram" && (
                      <>
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </>
                    )}
                    {social.name === "github" && (
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
              {companyLinks.map((item) => (
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
              {resourceLinks.map((item) => (
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
  );
} 