"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-7xl font-medium tracking-tight sm:text-4xl md:text-5xl lg:text-6xl mx-auto max-w-screen-lg text-neutral-900 leading-[1.375]">
              Generate <span style={{ color: '#02ADD2' }}>Beast</span> <img src="/beast-thunder.svg" alt="" className="inline-block w-[1.4em] h-auto align-middle -rotate-60 scale-y-[1.32] mx-[-0.1em]" /> Thumbnails in{" "}
              <span className="hero-underline-curve">Seconds</span>—Not Hours
            </h1>
            <p className="mx-auto max-w-screen-md text-lg text-neutral-900 my-[33px]">
              Create studio-grade YouTube packaging with AI. No team. No waiting.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
            <Button
              size="lg"
              className="rounded-lg border-2 border-[#121212] bg-[#121212] text-white h-[54px] py-4 px-8 text-lg transition-all duration-300 hover:bg-[#FF0032]/90">
              Try it Free <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="rounded-lg border-2 border-black bg-transparent text-black h-[54px] py-4 px-8 text-lg transition-all duration-300 hover:bg-gray-100">
              See it in Action
            </Button>
          </div>
        </div>
        <div className="mt-24 flex justify-center">
          <div className="relative w-full max-w-7xl overflow-hidden rounded-2xl border border-2 border-border/40 bg-muted">
            <Image
              src="/placeholder.png"
              alt="Abstract data visualization with charts and graphs"
              width={1280}
              height={665}
              priority
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 