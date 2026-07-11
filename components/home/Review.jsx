"use client";

import { useState,useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { reviewData } from "@/data/Review";

export default function Review({ reviews }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const displayReviews = reviews && reviews.length > 0
    ? [...reviews]
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((r) => ({
          rating: r.stars || 5,
          review: r.review || "",
          name: r.name || "",
        }))
    : reviewData;

  useEffect(() => {
    if (displayReviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % displayReviews.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [activeSlide, displayReviews.length]);

  if (displayReviews.length === 0) return null;

  const item = displayReviews[activeSlide];

  return (
    <section className="my-10 border-y border-gray-300 py-16">
      <div className="relative max-w-4xl mx-auto text-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Stars */}
            <div className="flex justify-center mb-4">
              {Array.from({ length: item.rating }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-[#393938] mx-0.2 opacity-70"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>

            {/* Review */}
            <h3 className="text-2xl font-display italic text-[#1c1c1b] px-4">
              {item.review}
            </h3>

            <p className="mt-4 text-gray-600">{item.name}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        {displayReviews.length > 1 && (
          <div className="flex justify-center gap-3 mt-8">
            {displayReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === index
                    ? "bg-black"
                    : "border border-black"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}