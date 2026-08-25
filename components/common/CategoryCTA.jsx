"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CategoryCTA({
  title = "Architectural Specification & Quarry Samples",
  description = "Partner directly with Stoneza for custom calibration, edge profiling, and quarry-direct procurement. Request technical data sheets, physical sample boxes, or bespoke drawing take-offs.",
  buttonText = "REQUEST SAMPLES & SPECIFICATION",
  buttonLink = "/contact",
}) {
  return (
    <section className="w-full py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[32px] bg-gradient-to-br from-[#2A2420] via-[#211C18] to-[#171310] border border-[#4A413A]/60 px-5 py-7 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:px-14 lg:py-14 shadow-xl">
        {/* Subtle Ambient Background Effects */}
        <div className="pointer-events-none absolute inset-0 opacity-15" aria-hidden="true">
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#C9A980]/20 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-[#C9A980]/20 blur-3xl" />
          <div className="absolute right-1/3 top-1/2 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Content Column */}
          <div className="max-w-2xl text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-[1.5px] sm:tracking-[2px] text-[#C9A980] backdrop-blur-sm">
              <Sparkles className="size-3 text-[#C9A980]" />
              Stoneza Architectural Supply
            </span>

            <h2 className="mt-3.5 sm:mt-5 font-display text-xl sm:text-2xl md:text-3xl lg:text-[36px] xl:text-[40px] leading-[1.2] sm:leading-[1.18] text-[#F5F1EA]">
              {title}
            </h2>

            <p className="mt-2.5 sm:mt-4 max-w-xl text-xs sm:text-sm md:text-[14.5px] leading-relaxed sm:leading-[1.65] text-[#B7AC9E]">
              {description}
            </p>
          </div>

          {/* Right Action Column */}
          <div className="flex flex-col items-stretch sm:items-center lg:items-center gap-3 sm:gap-3.5 shrink-0 w-full sm:w-auto mt-2 lg:mt-0">
            <Link
              href={buttonLink}
              className="group inline-flex w-full sm:w-auto min-h-[46px] sm:min-h-[50px] md:h-[54px] items-center justify-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl bg-[#C9A980] hover:bg-[#D5B892] px-5 sm:px-7 md:px-8 py-3 text-[11px] sm:text-xs md:text-[13px] font-heading font-semibold uppercase tracking-[1.2px] sm:tracking-[1.8px] text-[#2A2118] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md text-center cursor-pointer"
            >
              <span>{buttonText}</span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <p className="text-center sm:text-right text-[11px] sm:text-xs text-[#8F8477]">
              Trusted by <span className="font-semibold text-[#EDE8E1]">1000+</span> architects &amp; specifiers across India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
