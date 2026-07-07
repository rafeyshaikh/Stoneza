"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const heroItems = [
  {
    eyebrow: "FOR RESORTS · HOTELS · TOWNSHIPS · ARCHITECTS",
    headingNormal: "Stone that makes a space",
    headingAccent: "unforgettable.",
    paragraph:
      "Quarry-direct sandstone, granite, limestone and basalt — engineered, finished and delivered to spec for India's most ambitious hospitality and architectural projects.",
    primaryButtonText: "Request a Bulk Quote",
    primaryButtonLink: "/quote",
    secondaryButtonText: "Order Material Samples",
    secondaryButtonLink: "/samples",
    image: "/assets/hero/HomePage-Slider-1.webp",
  },
  {
    eyebrow: "FOR RESORTS · HOTELS · TOWNSHIPS · ARCHITECTS",
    headingNormal: "Crafted surfaces for spaces that",
    headingAccent: "endure.",
    paragraph:
      "From poolside decks to grand facades, our natural stone is cut, finished and delivered to exact architectural specification.",
    primaryButtonText: "Request a Bulk Quote",
    primaryButtonLink: "/quote",
    secondaryButtonText: "Order Material Samples",
    secondaryButtonLink: "/samples",
    image: "/assets/hero/HomePage-Slider-2.webp",
  },
  {
    eyebrow: "FOR RESORTS · HOTELS · TOWNSHIPS · ARCHITECTS",
    headingNormal: "Natural stone, engineered for",
    headingAccent: "scale.",
    paragraph:
      "Quarry-direct sourcing and precision finishing, built for large-format hospitality and township developments.",
    primaryButtonText: "Request a Bulk Quote",
    primaryButtonLink: "/quote",
    secondaryButtonText: "Order Material Samples",
    secondaryButtonLink: "/samples",
    image: "/assets/hero/HomePage-Slider-3.webp",
  },
];

export default function HeroSection() {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 10000);

    return () => clearTimeout(timer);
  }, [activeSlide]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroItems.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? heroItems.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;

    // Swipe Left → Next
    if (distance > 10) {
      nextSlide();
    }

    // Swipe Right → Previous
    if (distance < -10) {
      prevSlide();
    }
  };

  const current = heroItems[activeSlide];

  return (
    <section
      className="relative h-screen overflow-hidden bg-[#2a2118]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}

      {heroItems.map((item, index) => (
        <motion.div
          key={item.image}
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: activeSlide === index ? 1 : 0,
            scale: activeSlide === index ? 1 : 1.08,
          }}
          transition={{
            opacity: {
              duration: 1.2,
              ease: "easeInOut",
            },
            scale: {
              duration: 8,
              ease: "linear",
            },
          }}
          style={{
            pointerEvents: activeSlide === index ? "auto" : "none",
            zIndex: activeSlide === index ? 1 : 0,
          }}
        >
          <Image
            src={item.image}
            alt={item.headingNormal}
            fill
            priority={index === 0}
            className="object-cover"
          />

          {/* Dark gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center px-6 sm:px-10 lg:px-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`content-${activeSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-left"
          >
            {/* Eyebrow */}
            <p className="font-heading text-xs font-medium uppercase tracking-[4px] text-[#c9a877] sm:text-sm sm:tracking-[6px]">
              {current.eyebrow}
            </p>

            {/* Heading */}
            <h1 className="mt-6 font-heading text-[40px] font-normal leading-[1.15] text-white sm:text-[52px] lg:text-[64px]">
              {current.headingNormal}{" "}
              <em className="font-serif italic text-[#c9a877]">
                {current.headingAccent}
              </em>
            </h1>

            {/* Paragraph */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {current.paragraph}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={current.primaryButtonLink}
                className="bg-[#f2ede4] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-stone-900 transition hover:bg-white"
              >
                {current.primaryButtonText}
              </Link>

              <Link
                href={current.secondaryButtonLink}
                className="border border-white/70 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
              >
                {current.secondaryButtonText}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {heroItems.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => {
              if (index !== activeSlide) {
                setActiveSlide(index);
              }
            }}
            className={`h-[10px] w-[10px] rounded-full border-2 transition-all duration-300 ${
              activeSlide === index ? "bg-white border-white" : "border-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}