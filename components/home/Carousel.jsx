"use client";

import { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { PiCaretLeftThin, PiCaretRightThin } from "react-icons/pi";
import ImageWithLoader from "../common/Loader";

import Container from "@/components/common/Container";

export default function Carousel({ title, data, itemsPerView = 3 }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    duration: 25,
  });

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;

    const width = window.innerWidth;

    if (width >= 1024) {
      emblaApi.scrollTo(emblaApi.selectedScrollSnap() + itemsPerView);
    } else if (width >= 768) {
      emblaApi.scrollTo(emblaApi.selectedScrollSnap() + 2);
    } else {
      emblaApi.scrollTo(emblaApi.selectedScrollSnap() + 1);
    }
  }, [emblaApi, itemsPerView]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;

    const width = window.innerWidth;

    if (width >= 1024) {
      emblaApi.scrollTo(emblaApi.selectedScrollSnap() - itemsPerView);
    } else if (width >= 768) {
      emblaApi.scrollTo(emblaApi.selectedScrollSnap() - 2);
    } else {
      emblaApi.scrollTo(emblaApi.selectedScrollSnap() - 1);
    }
  }, [emblaApi, itemsPerView]);

  return (
    <section className="pt-12 lg:pb-20 sm:pb-4">
      <Container>
        <div className="relative">
          {/* Heading */}

          <h2 className="mb-12 text-center lg:text-[32px] sm:text-[22px] uppercase tracking-[8px] font-display text-[#393938]">
            {title}
          </h2>

          {/* Left Arrow */}

          <button
            onClick={scrollPrev}
            className="absolute left-[-50px] top-1/2 z-20 hidden -translate-y-1/2 text-5xl text-[#393938] transition hover:opacity-60 lg:block"
          >
            <PiCaretLeftThin />
          </button>

          {/* Right Arrow */}

          <button
            onClick={scrollNext}
            className="absolute right-[-50px] top-1/2 z-20 hidden -translate-y-1/2 text-5xl text-[#393938] transition hover:opacity-60 lg:block"
          >
            <PiCaretRightThin />
          </button>

          {/* Embla */}

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="px-3 flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_var(--slide-width)]"
                  style={{
                    "--slide-width": `${100 / itemsPerView}%`
                  }}
                >
                  <ProductCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ProductCard({ item }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={item.href}>
        <div className="relative aspect-square overflow-hidden bg-[#f5f2ec]">
          {/* Sold Out */}

          {item.hasOwnProperty("soldOut") && item.soldOut && (
            <div className="absolute left-4 top-4 z-20 bg-black px-3 py-1 text-[10px] uppercase tracking-[2px] text-white">
              Sold Out
            </div>
          )}

          {/* Images */}

          <AnimatePresence initial={false}>
            <motion.div
              key={hovered ? (item.hoverImage ? item.hoverImage : item.image) : item.image}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <ImageWithLoader
                src={hovered ? (item.hoverImage ? item.hoverImage : item.image) : item.image}
                alt={item.title}
                fill
                className="object-contain transition-transform duration-700"
              />
            </motion.div>
          </AnimatePresence>

          {/* Buttons */}

          {item.hasOwnProperty("soldOut") && (
            <div
              className="absolute bottom-0 left-0 right-0 z-20 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex items-center bg-white py-2
              ">
              <Link
                href={item.href || "#"}
                className="w-full py-3 text-[12px] uppercase tracking-[3px] font-heading cursor-pointer text-center hover:bg-black/5 transition-colors text-stone-900"
              >
                View Details
              </Link>
            </div>
          )}
        </div>

        {/* Content */}

        <div className="pt-5 text-center">
          <h3 className={` ${item.titleStyle ? item.titleStyle : 'font-body'} "text-[15px]  text-[#393938]`}>
            {item.title || item.name}{item.titleStyle ? " >" : ''}
          </h3>

          <p className="mt-1 text-[14px] font-body text-[#6a6a6a]">
            {item.price && `₹${item.price}`}
          </p>
        </div>
      </Link>
    </div>
  );
}