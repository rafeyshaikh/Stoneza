"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ShopGiftStyle({title,data}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = data.length - itemsPerView;

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev >= maxIndex ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev <= 0 ? maxIndex : prev - 1
    );
  };
  const createSlug = (title) =>
  title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return (
    <section className="py-12 lg:py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h2 className="text-center text-[18px] md:text-[28px] tracking-[0.35em] font-normal uppercase mb-10 uppercase font-display">
          {title}
        </h2>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 h-11 w-11 rounded-full border bg-white shadow-sm flex items-center justify-center hover:shadow-md transition"
            aria-label="Previous"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-3 h-3 fill-current"
            >
              <path d="M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 h-11 w-11 rounded-full border bg-white shadow-sm flex items-center justify-center hover:shadow-md transition"
            aria-label="Next"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-3 h-3 rotate-180 fill-current"
            >
              <path d="M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z" />
            </svg>
          </button>

          <div className="overflow-hidden px-12">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerView)
                }%)`,
              }}
            >
              {data.map((item, index) => (
                <Link
                  key={index}
                  href={`/collections/${createSlug(item.title)}`}
                  className="group shrink-0 px-3"
                  style={{
                    width: `${100 / itemsPerView}%`,
                  }}
                  >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <h3 className="mt-5 text-center uppercase tracking-[0.18em] text-[11px] md:text-[15px] font-normal uppercase font-body">
                    {item.title}{ " " }&gt;
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}