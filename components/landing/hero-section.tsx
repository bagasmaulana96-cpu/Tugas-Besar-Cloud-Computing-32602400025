"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-[calc(100vh-56px-64px)] flex flex-col items-center justify-center px-4 md:px-6 overflow-hidden text-center">
      {/* Radial glow decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] md:w-[900px] md:h-[450px] rounded-full bg-purple-main/30 blur-[100px] pointer-events-none z-0" />

      {/* Badge pill */}
      <div className="inline-flex items-center gap-2 bg-bg-card/60 border border-bg-border rounded-full px-4 py-2 mb-8 relative z-10 animate-fade-in">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-light" />
        <span className="uppercase text-xs tracking-widest text-text-secondary font-mono">
          Let's level up yourself and become better
        </span>
      </div>

      {/* Heading */}
      <h1
        className="text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tight text-text-primary relative z-10 text-glow animate-fade-in"
        style={{ animationDelay: "100ms" }}
      >
        Level Up Project
      </h1>

      {/* Subtitle */}
      <p
        className="mt-4 text-base sm:text-lg uppercase tracking-wide text-text-secondary relative z-10 animate-fade-in"
        style={{ animationDelay: "200ms" }}
      >
        Becoming better than yesterday
      </p>

      {/* CTA button */}
      <button
        onClick={() => router.push("/login")}
        className="mt-10 md:mt-12 inline-flex items-center justify-center gap-2 bg-purple-main hover:bg-purple-light text-white rounded-full px-8 py-4 font-medium uppercase tracking-wide text-sm transition-colors duration-150 relative z-10 animate-fade-in w-full max-w-xs sm:w-auto"
        style={{ animationDelay: "300ms" }}
      >
        Level Up To The Next Level
        <ArrowRight size={18} />
      </button>
    </section>
  );
}
