'use client';

import React from 'react';
import ImageWithLoader from "@/components/common/Loader";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductHeroGallery({ slides, activeThumb, setActiveThumb }) {
  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[activeThumb] || slides[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveThumb((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveThumb((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col sm:grid sm:grid-cols-[76px_1fr] gap-3 w-full">
      {/* 1. Thumbnail Strip (Renders below on mobile, on the left on desktop) */}
      <div className="order-2 sm:order-1 flex flex-row sm:flex-col gap-2 sm:gap-2.5 overflow-x-auto p-1 sm:p-0.5">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            type="button"
            className={`size-14 sm:size-auto sm:w-full aspect-square shrink-0 p-0 border bg-none cursor-pointer relative block transition-all overflow-hidden rounded-[2px] ${
              activeThumb === idx
                ? 'border-[#1C1714] ring-2 ring-[#1C1714] opacity-100 shadow-xs'
                : 'border-[#CBC9C4] opacity-65 hover:opacity-100 hover:border-[#78716C]'
            }`}
            onClick={() => setActiveThumb(idx)}
            aria-label={slide.caption || slide.url || `Image ${idx + 1}`}
          >
            <ImageWithLoader
              src={slide.url}
              alt={slide.caption || `Thumbnail ${idx + 1}`}
              fill
              className="object-cover"
              seedIndex={idx}
            />
          </button>
        ))}
      </div>

      {/* 2. Main Large Image (Renders on top on mobile, on the right on desktop) */}
      <div className="order-1 sm:order-2 w-full">
        <div className="relative aspect-square border border-[#CBC9C4] overflow-hidden bg-white rounded-[2px] shadow-xs group">
          <ImageWithLoader
            src={currentSlide.url}
            alt={currentSlide.caption || "Product view"}
            fill
            className="object-cover transition-opacity duration-300"
            seedIndex={activeThumb}
          />

          {/* Mobile Previous / Next Arrow Controls */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Image"
                className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs active:scale-95 transition-transform"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Image"
                className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs active:scale-95 transition-transform"
              >
                <ChevronRight className="size-5" />
              </button>

              {/* Mobile Slide Counter Indicator */}
              <div className="sm:hidden absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white tracking-wider">
                {activeThumb + 1} / {slides.length}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
