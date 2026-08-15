'use client';

import React from 'react';
import ImageWithLoader from "@/components/common/Loader";

export default function ProductHeroGallery({ slides, activeThumb, setActiveThumb }) {
  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[activeThumb] || slides[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[76px_1fr] gap-3">
      <div className="flex flex-row sm:flex-col gap-2.5">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            className={`flex-1 sm:flex-none p-0 border bg-none cursor-pointer aspect-square relative block transition-colors overflow-hidden rounded-[2px] ${
              activeThumb === idx
                ? 'border-[#1C1714] ring-2 ring-[#1C1714] -ring-offset-1'
                : 'border-[#CBC9C4] hover:border-[#78716C]'
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
      <div>
        <div className="relative aspect-square border border-[#CBC9C4] overflow-hidden bg-white rounded-[2px]">
          <ImageWithLoader
            src={currentSlide.url}
            alt={currentSlide.caption || "Product view"}
            fill
            className="object-cover"
            seedIndex={activeThumb}
          />
        </div>
      </div>
    </div>
  );
}
