"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const heroItems = [
  {
    eyebrow: "OUTDOOR SPACES · LANDSCAPES · TIMELESS DESIGN",
    heading: "Natural stone for spaces that inspire.",
    paragraph:
      "Transform open spaces with natural stone crafted for lasting beauty, enduring performance, and effortless outdoor living.",
    primaryButtonText: "EXPLORE THE COLLECTION",
    primaryButtonLink: "/collections/landscape-and-outdoor-living",
    image: "/assets/hero/NewSlide1.png",
  },
  {
    eyebrow: "FLOORING · PAVING · ENDURING DESIGN",
    heading: "Natural stone for every step you take.",
    paragraph:
      "Elevate interiors and outdoor spaces with natural stone crafted for lasting strength, refined beauty, and enduring performance.",
    primaryButtonText: "EXPLORE THE COLLECTION",
    primaryButtonLink: "/collections/flooring-paving-surfaces",
    image: "/assets/hero/NewSlide2.png",
  },
  {
    eyebrow: "WALLS · FACADES · ARCHITECTURAL CHARACTER",
    heading: "Stone that shapes architectural identity.",
    paragraph:
      "Transform walls into lasting architectural statements with natural stone crafted for depth, distinction, and timeless exterior beauty.",
    primaryButtonText: "EXPLORE THE COLLECTION",
    primaryButtonLink: "/collections/wall-cladding-facade-stones",
    image: "/assets/hero/NewSlide3.png",
  },
  {
    eyebrow: "TEXTURES · PATTERNS · DISTINCTIVE FINISHES",
    heading: "Crafted details that bring stone to life.",
    paragraph:
      "Discover distinctive patterns and refined finishes designed to add depth, texture, and timeless character to every surface.",
    primaryButtonText: "EXPLORE THE COLLECTION",
    primaryButtonLink: "/collections/patterns-finishes",
    image: "/assets/hero/NewSlide4.png",
  }
];

export default function HeroSection({ slides = [] }) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [activeSlide, setActiveSlide] = useState(0);

  // Filter active slides and map fields to match UI keys
  const activeSlides = slides && slides.length > 0
    ? slides
        .filter((s) => s.isActive !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((s) => ({
          eyebrow: s.eyebrow || "",
          heading: s.title || "",
          paragraph: s.paragraph || "",
          primaryButtonText: s.buttonText || "",
          primaryButtonLink: s.buttonLink || "",
          image: s.image?.url || "/assets/placeholder.jpg",
        }))
    : [];

  const displayItems = activeSlides.length > 0 ? activeSlides : heroItems;

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 10000);

    return () => clearTimeout(timer);
  }, [activeSlide, displayItems.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % displayItems.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? displayItems.length - 1 : prev - 1));
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

  const current = displayItems[activeSlide];

  return (
    <section
      className="relative h-screen overflow-hidden bg-[#2a2118]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}

      {displayItems.map((item, index) => (
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
            alt={item.heading}
            fill
            priority={index === 0}
            className="object-cover"
            unoptimized={item.image.startsWith("http")}
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
            className="max-w-2xl text-left lg:mt-10 "
          >
            {/* Eyebrow */}
            <p className="font-heading text-xs font-medium uppercase tracking-[4px] text-[#c9a877] sm:text-sm sm:tracking-[6px]">
              {current.eyebrow}
            </p>

            {/* Heading */}
            <h1 className="mt-6 font-heading text-[40px] font-normal leading-[1.15] text-white sm:text-[52px] lg:text-[64px]">
              {(() => {
                const text = current.heading || "";
                const lastSpaceIndex = text.lastIndexOf(" ");
                if (lastSpaceIndex === -1) {
                  return <span>{text}</span>;
                }
                return (
                  <>
                    {text.slice(0, lastSpaceIndex)}{" "}
                    <em className="font-serif italic text-[#c9a877]">
                      {text.slice(lastSpaceIndex)}
                    </em>
                  </>
                );
              })()}
            </h1>

            {/* Paragraph */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {current.paragraph}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={current.primaryButtonLink}
                className="bg-[#f2ede4] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-stone-900 transition hover:bg-white cursor-pointer"
              >
                {current.primaryButtonText}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {displayItems.map((_, index) => (
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