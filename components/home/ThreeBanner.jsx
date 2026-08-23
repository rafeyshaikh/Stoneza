"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ImageWithLoader from "@/components/common/Loader";
import Link from "next/link";

const staticBanners = [
  {
    image: "/assets/others/Below_Banner_1.jpg",
    title: "Photo Frames",
    link: "/product",
  },
  {
    image: "/assets/others/Below_Banner_2.jpg",
    title: "Decor Object",
    link: "/product",
  },
  {
    image: "/assets/others/Below_Banner_3.jpg",
    title: "Book Boxes",
    link: "/product",
  },
];

export default function ThreeBanner({ banners }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((api) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const displayBanners = banners && banners.length > 0
    ? banners.map((b) => ({
        image: b.image?.url || "",
        title: b.title || "",
        link: b.buttonLink || "/product",
      }))
    : staticBanners;

  return (
    <div className="mt-12 lg:mt-0">
      {/* MOBILE VIEW SLIDER (< md) */}
      <div className="block md:hidden relative overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {displayBanners.map((item, index) => (
            <div
              key={index}
              className="relative w-full h-[450px] shrink-0 group overflow-hidden"
            >
              <ImageWithLoader
                src={item.image}
                alt={item.title || "Stoneza Banner"}
                fill
                className="object-cover"
                seedIndex={index}
                placeholderTitle={item.title}
              />

              {item.title && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
                  <Link href={item.link}>
                    <button className="border border-white px-7 py-3 font-heading text-[11px] font-medium uppercase tracking-[0.3em] text-white whitespace-nowrap cursor-pointer hover:bg-white hover:text-black transition duration-300 bg-black/20 backdrop-blur-xs">
                      {item.title}
                    </button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {displayBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                selectedIndex === idx ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
              aria-label={`Go to banner slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP VIEW ROW (>= md) */}
      <div className="hidden md:flex flex-row">
        {displayBanners.map((item, index) => (
          <div
            key={index}
            className="group relative w-full h-[500px] flex-1 overflow-hidden"
          >
            <ImageWithLoader
              src={item.image}
              alt={item.title || "Stoneza Banner"}
              fill
              className="object-cover transition-transform duration-[4000ms] group-hover:scale-110"
              seedIndex={index}
              placeholderTitle={item.title}
            />

            {item.title && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                <Link href={item.link}>
                  <button className="border border-white px-6 md:px-8 py-3 font-heading text-[11px] md:text-[12px] font-medium uppercase tracking-[0.3em] text-white whitespace-nowrap cursor-pointer hover:bg-white hover:text-black transition duration-300">
                    {item.title}
                  </button>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}