"use client";

import Link from "next/link";
import { ChevronRight, Mail, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Testimonials", href: "#testimonials" },
      { name: "API Docs", href: "/docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Press Kit", href: "/press" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Status", href: "/status" },
      { name: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  },
];

const socialLinks = [
  { name: "Twitter", icon: <Twitter className="h-5 w-5" />, href: "#" },
  { name: "Github", icon: <Github className="h-5 w-5" />, href: "#" },
  { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, href: "#" },
  { name: "Instagram", icon: <Instagram className="h-5 w-5" />, href: "#" },
];

const LinkButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="text-gray-600 hover:text-black transition-colors duration-200 flex items-center group"
  >
    <span className="mr-1">{children}</span>
    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
  </Link>
);

const SocialButton = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <motion.a
    href={href}
    aria-label={label}
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_#18181B] hover:shadow-[4px_4px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
  >
    {icon}
  </motion.a>
);

export function FooterSection() {
  return (
    <footer className="pt-16 pb-8 relative bg-muted/30">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      
      <div className="container px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Logo and Newsletter Section */}
          <div className="col-span-2">
            <Link 
              href="/" 
              className="text-2xl font-bold text-gray-900 inline-block mb-6 border-b-2 border-[#FF5C8D]"
            >
              LOGO
            </Link>
            <p className="text-gray-600 mb-4 max-w-sm">
              Join our newsletter to get updates about features and releases.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <div className="relative rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#18181B] transition-all duration-200 bg-white">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full py-2 px-3 bg-transparent outline-none"
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <Button 
                className="rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white shadow-[3px_3px_0px_0px_#18181B] hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
              >
                Subscribe
              </Button>
            </div>
          </div>
          
          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="font-bold mb-4 text-sm tracking-widest uppercase">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <LinkButton href={link.href}>
                      {link.name}
                    </LinkButton>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <SocialButton 
                key={link.name} 
                href={link.href} 
                icon={link.icon} 
                label={`Visit our ${link.name}`} 
              />
            ))}
          </div>
          
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </div>
          
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center rounded-lg border-2 border-black bg-white p-2 shadow-[3px_3px_0px_0px_#18181B] hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
            aria-label="Back to top"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3L14 9L12.5 10.5L8 6L3.5 10.5L2 9L8 3Z" fill="currentColor" />
            </svg>
          </motion.button>
        </div>
      </div>
    </footer>
  );
} 