"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const DEFAULT_SIGNATURE_STONES = [
  {
    id: "imperial-blue",
    name: "Imperial Blue",
    categoryMeta: "KOTA BLUE · 12 FINISHES",
    href: "/product/imperial-blue",
    image:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785326096/stoneza/homepage/hero/newslide1-ms6128lq.png",
  },
  {
    id: "castle-grey",
    name: "Castle Grey",
    categoryMeta: "KANDLA GREY · PAVING & CLADDING",
    href: "/product/castle-grey",
    image:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png",
  },
  {
    id: "burgundy-bliss",
    name: "Burgundy Bliss",
    categoryMeta: "MANDANA RED · 7 FINISHES",
    href: "/product/burgundy-bliss",
    image:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
  },
  {
    id: "cosmic-black",
    name: "Cosmic Black",
    categoryMeta: "MONSOON BLACK · 6 FINISHES",
    href: "/product/cosmic-black",
    image:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340266/stoneza/homepage/hero/newslide2-sl58hw9a.png",
  },
  {
    id: "mint-frost",
    name: "Mint Frost",
    categoryMeta: "GWALIOR MINT · SLAB & TILES",
    href: "/product/mint-frost",
    image:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785326287/stoneza/homepage/hero/newslide2-ms616c0w.png",
  },
  {
    id: "asian-gold",
    name: "Asian Gold",
    categoryMeta: "JAISALMER · 5 FINISHES",
    href: "/product/asian-gold",
    image:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340268/stoneza/homepage/hero/newslide3-kw98hw7m.png",
  },
];

export default function SignatureStones({
  stones = DEFAULT_SIGNATURE_STONES,
  eyebrow = "SIGNATURE STONES",
  title = "What we are known for",
  subtitle = "The stones that come back on project after project.",
}) {
  const carouselRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  if (!stones || stones.length === 0) {
    return null;
  }

  const checkScrollability = () => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollPrev(scrollLeft > 5);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScrollability();
    const el = carouselRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScrollability, { passive: true });
    window.addEventListener("resize", checkScrollability);

    return () => {
      el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [stones]);

  const scrollPrev = () => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.querySelector(".signature-card")?.offsetWidth || 280;
    carouselRef.current.scrollBy({ left: -(cardWidth + 20), behavior: "smooth" });
  };

  const scrollNext = () => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.querySelector(".signature-card")?.offsetWidth || 280;
    carouselRef.current.scrollBy({ left: cardWidth + 20, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white dark:bg-[#12100E] text-[#26221E] dark:text-stone-100 py-16 sm:py-20 lg:py-24 border-b-2 border-[#C9BDB2]/50 dark:border-stone-800">
      <div className="max-w-[1320px] mx-auto px-4.5 sm:px-8 lg:px-16">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#8A8078] dark:text-stone-400 mb-2.5">
              {eyebrow}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] font-normal tracking-tight text-[#26221E] dark:text-stone-100 leading-[1.12] mb-2">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-[#6E645A] dark:text-stone-400">
              {subtitle}
            </p>
          </div>

          {/* SLIDER NAVIGATION BUTTONS */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous stones"
              className="size-10 border border-[#26221E]/20 dark:border-stone-700 bg-white dark:bg-stone-900 flex items-center justify-center transition-all hover:border-[#26221E] dark:hover:border-stone-400 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="size-4 text-[#26221E] dark:text-stone-200" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next stones"
              className="size-10 border border-[#26221E]/20 dark:border-stone-700 bg-white dark:bg-stone-900 flex items-center justify-center transition-all hover:border-[#26221E] dark:hover:border-stone-400 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="size-4 text-[#26221E] dark:text-stone-200" />
            </button>
          </div>
        </div>

        {/* CAROUSEL CARDS ROW */}
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-4 pt-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {stones.map((stone) => (
            <Link
              key={stone.id || stone.name}
              href={stone.href || "#"}
              className="signature-card group shrink-0 w-[240px] sm:w-[260px] md:w-[280px] lg:w-[calc((100%-80px)/5)] snap-start text-inherit no-underline"
            >
              {/* IMAGE CONTAINER */}
              <div className="aspect-square relative overflow-hidden bg-stone-100 dark:bg-stone-900 border border-[#26221E]/10 dark:border-stone-800">
                <Image
                  src={stone.image}
                  alt={stone.name}
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              </div>

              {/* DETAILS */}
              <div className="pt-3.5">
                <h3 className="font-serif text-lg font-normal text-[#26221E] dark:text-stone-100 group-hover:underline group-hover:underline-offset-4 transition-all">
                  {stone.name}
                </h3>
                <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#8A8078] dark:text-stone-400 mt-1">
                  {stone.categoryMeta}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
