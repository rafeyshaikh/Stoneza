"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CollectionCTA({
  title = "Ready to Transform Your Space?",
  description = "Explore our curated collection of luxury surfaces, décor, and timeless pieces crafted to elevate every corner of your home.",
  buttonText = "SHOP COLLECTION",
  buttonLink = "/collections",
}) {
  return (
    <section className="py-16 px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-[#8A5A44] px-8 py-10 md:px-16 md:py-14">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 top-0 h-60 w-60 rounded-full bg-white" />

          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white" />

          <div className="absolute right-1/3 top-1/2 h-24 w-24 rounded-full bg-white" />
        </div>

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-xs uppercase tracking-[2px] text-white backdrop-blur-sm">
              ✦ Stoneza Luxury Collection
            </span>

            <h2 className="mt-6 font-display text-4xl leading-tight text-white md:text-5xl">
              {title}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-white/80">
              {description}
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-5">
            <Link
              href={buttonLink}
              className="flex h-[56px] items-center justify-center gap-3 rounded-xl bg-white px-8 text-sm font-medium tracking-[2px] text-[#8A5A44] transition-all hover:scale-[1.02]"
            >
              {buttonText}

              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="text-center text-sm text-white/80">
              Trusted by <span className="font-semibold">1000+</span> homeowners
              across India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}