"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

const footerLinksData = [
  { name: "Process", href: "#how-it-works" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQs", href: "#faq" },
];

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-neutral-200 hover:text-white transition-colors duration-200"
  >
    {children}
  </Link>
);

export function FooterSection() {
  return (
    <footer className="pt-12 pb-8 relative bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] rounded-t-2xl">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      <div className="container px-4 md:px-6">
        {/* Main Footer Content - Revamped with Flexbox */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-8 mb-10">
          
          {/* Left: Logo and Newsletter Text */}
          <div className="flex-shrink-0 md:max-w-xs">
            <Link
              href="/"
              className="inline-block mb-3"
            >
              <Image src="/ytza-logo.png" alt="YTZA Logo" width={120} height={38} className="object-contain" />
            </Link>
            <p className="text-neutral-200 text-sm">
              Join our newsletter to get updates about features and releases.
            </p>
          </div>
          
          {/* Center: Horizontal Links */}
          <nav className="flex-grow md:text-center">
            <ul className="flex flex-wrap justify-center md:justify-center gap-x-6 gap-y-2">
              {footerLinksData.map((link) => (
                <li key={link.name}>
                  <FooterLink href={link.href}>
                    {link.name}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Right: Newsletter Input and Button */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#18181B] bg-white flex-grow sm:flex-grow-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full py-2.5 px-3 bg-transparent outline-none text-black text-sm"
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <Button 
                className="rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white shadow-[3px_3px_0px_0px_#18181B] hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 px-5 py-2.5 text-sm"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar - Adjusted for better spacing if needed */}
        <div className="border-t border-white/30 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-neutral-200 text-xs text-center md:text-left">
            © {new Date().getFullYear()} YTZA. All rights reserved.
          </div>
          
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center rounded-lg border-2 border-black bg-white p-2 shadow-[3px_3px_0px_0px_#18181B] hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
            aria-label="Back to top"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3L14 9L12.5 10.5L8 6L3.5 10.5L2 9L8 3Z" fill="currentColor" />
            </svg>
          </motion.button>
        </div>
      </div>
    </footer>
  );
} 