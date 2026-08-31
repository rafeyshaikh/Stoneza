"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { PiCaretLeftThin, PiCaretRightThin } from "react-icons/pi";
import ImageWithLoader from "@/components/common/Loader";
import { getPlaceholderImage } from "@/lib/placeholderImage";

export default function SiblingCollectionsCarousel({
  parentCollectionName = "Collection",
  siblingCollections = [],
  // aliases for backwards compatibility
  parentCategoryName,
  siblingCategories,
}) {
  const items =
    siblingCollections && siblingCollections.length > 0
      ? siblingCollections
      : siblingCategories || [];
  const parentName = parentCollectionName || parentCategoryName || "Collection";

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: items.length > 4,
    align: "start",
    duration: 25,
    dragFree: true,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setPrevBtnDisabled(!emblaApi.canScrollPrev());
      setNextBtnDisabled(!emblaApi.canScrollNext());
    };

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  if (!items || items.length === 0) {
    return null;
  }

  const formattedParent = parentName;

  return (
    <section className="py-14 sm:py-20 border-t border-[#CBC9C4] bg-[#EAE8E2] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="font-heading text-[11px] uppercase tracking-[0.25em] text-[#8A7F73] font-semibold block mb-2">
              EXPLORE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1714] font-normal tracking-tight">
              Elsewhere in {formattedParent}
            </h2>
            <p className="font-body text-sm sm:text-base text-[#57534E] max-w-2xl mt-3 leading-relaxed">
              {items.length} more series from the same quarries, cut and finished in the same works.
            </p>
          </div>

          {/* Navigation Controls */}
          {items.length > 1 && (
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={prevBtnDisabled}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-full border border-[#CBC9C4] bg-white/80 backdrop-blur-sm flex items-center justify-center text-xl text-[#1C1714] hover:bg-white hover:border-[#1C1714] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
              >
                <PiCaretLeftThin />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={nextBtnDisabled}
                aria-label="Next slide"
                className="w-10 h-10 rounded-full border border-[#CBC9C4] bg-white/80 backdrop-blur-sm flex items-center justify-center text-xl text-[#1C1714] hover:bg-white hover:border-[#1C1714] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
              >
                <PiCaretRightThin />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 sm:-ml-6">
            {items.map((item, idx) => (
              <div
                key={item._id || item.slug || idx}
                className="pl-4 sm:pl-6 flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0"
              >
                <Link
                  href={item.href || `/collections/${item.slug}`}
                  className="group relative block aspect-[3/4] rounded-sm overflow-hidden bg-[#24201D] shadow-md text-white no-underline transition-all duration-500 hover:shadow-2xl"
                >
                  {/* Background Stone Image */}
                  <ImageWithLoader
                    src={item.image || getPlaceholderImage(item.name, idx + 10)}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    placeholderTitle={item.name}
                  />

                  {/* Dark Gradient Overlay for optimal text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-transparent z-10" />

                  {/* Bottom Text Content */}
                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-20 flex flex-col justify-end">
                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-white leading-snug group-hover:text-[#F3EFEA] transition-colors">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="font-body text-xs sm:text-[13px] text-stone-300/90 line-clamp-3 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-4 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] sm:text-[11px] font-heading font-medium tracking-[0.2em] text-white/80 uppercase group-hover:text-white transition-colors">
                      <span>
                        {item.productCount > 0
                          ? `${item.productCount} VARIETIES`
                          : "EXPLORE"}
                      </span>
                      <span className="text-sm transition-transform duration-300 group-hover:translate-x-1.5">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
