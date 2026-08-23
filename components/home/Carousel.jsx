"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageWithLoader from "../common/Loader";
import { isValidImageUrl } from "@/lib/utils";
import { getPlaceholderImage } from "@/lib/placeholderImage";

export default function Carousel({
  eyebrow = "",
  title = "Explore",
  subtitle = "",
  data = [],
  button = false,
}) {
  const carouselRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  if (!data || data.length === 0) return null;

  const defaultEyebrow =
    eyebrow ||
    (title.toLowerCase().includes("sub")
      ? "EXPLORE FORMATS"
      : title.toLowerCase().includes("new")
      ? "NEW ARRIVALS"
      : "COLLECTION");

  const defaultSubtitle =
    subtitle ||
    (title.toLowerCase().includes("sub")
      ? "Explore specific cuts, profiles, and surface finishes across our catalog."
      : "Fresh additions from our Rajasthan quarries and fabrication facilities.");

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
  }, [data]);

  const scrollPrev = () => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.querySelector(".carousel-card");
    const cardWidth = card ? card.offsetWidth : 280;
    carouselRef.current.scrollBy({ left: -(cardWidth + 20), behavior: "smooth" });
  };

  const scrollNext = () => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.querySelector(".carousel-card");
    const cardWidth = card ? card.offsetWidth : 280;
    carouselRef.current.scrollBy({ left: cardWidth + 20, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white dark:bg-[#12100E] text-[#26221E] dark:text-stone-100 py-16 sm:py-20 lg:py-24 border-b-2 border-[#C9BDB2]/50 dark:border-stone-800">
      <div className="max-w-[1320px] mx-auto px-4.5 sm:px-8 lg:px-16">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#8A8078] dark:text-stone-400 mb-2.5 font-semibold">
              {defaultEyebrow}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] font-normal tracking-tight text-[#26221E] dark:text-stone-100 leading-[1.12] mb-2">
              {title}
            </h2>
            {defaultSubtitle && (
              <p className="text-sm sm:text-base text-[#6E645A] dark:text-stone-400 max-w-[60ch]">
                {defaultSubtitle}
              </p>
            )}
          </div>

          {/* SLIDER CONTROLS */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous"
              className="size-10 border border-[#26221E]/20 dark:border-stone-700 bg-white dark:bg-stone-900 flex items-center justify-center transition-all hover:border-[#26221E] dark:hover:border-stone-400 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="size-4 text-[#26221E] dark:text-stone-200" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next"
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
          {data.map((item, idx) => {
            const titleText = item.title || item.name || "Stoneza";
            const validImg = isValidImageUrl(item.image)
              ? item.image
              : getPlaceholderImage(titleText, idx);
            const targetHref = item.href || (item.slug ? `/product/${item.slug}` : "#");

            return (
              <Link
                key={item.id || item.slug || idx}
                href={targetHref}
                className="carousel-card group shrink-0 w-[240px] sm:w-[260px] md:w-[280px] lg:w-[calc((100%-72px)/4)] xl:w-[calc((100%-96px)/5)] snap-start text-inherit no-underline flex flex-col"
              >
                {/* IMAGE CONTAINER */}
                <div className="aspect-square relative overflow-hidden bg-[#F5F1EB] dark:bg-stone-900 border border-[#E4DDD3] dark:border-stone-800">
                  <ImageWithLoader
                    src={validImg}
                    alt={titleText}
                    fill
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 20vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    placeholderTitle={titleText}
                  />
                </div>

                {/* DETAILS */}
                <div className="pt-3.5 flex flex-col flex-1">
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-[#26221E] dark:text-stone-100 group-hover:underline group-hover:underline-offset-4 transition-all">
                    {titleText}
                  </h3>

                  {item.categoryMeta && (
                    <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#8A8078] dark:text-stone-400 mt-1">
                      {item.categoryMeta}
                    </p>
                  )}

                  {item.price && (
                    <p className="font-sans text-[13px] text-[#8A8078] dark:text-stone-400 mt-0.5">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>
                  )}

                  <div className="mt-auto pt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#8A8078] group-hover:text-[#26221E] dark:group-hover:text-white transition-colors inline-flex items-center gap-1.5 font-medium">
                    <span>EXPLORE</span>
                    <span className="text-[12px] transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}