"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const heroItems = [
  {
    title: "Le' Floret",
    type: "Dinnerware",
    image: "/assets/hero/hero1.jpg",
  },
  {
    title: "L'arte Del Movimento",
    type: "Platters & Bowls",
    image: "/assets/hero/hero2.jpg",
  },
  {
    title: "Eredità Fiorita",
    type: "Cushion Covers",
    image: "/assets/hero/hero3.jpg",
  },
  {
    title: "Lumière Voilée",
    type: "Furniture",
    image: "/assets/hero/hero4.jpg",
  },
  {
    title: "Jardin Majestueux",
    type: "Leather",
    image: "/assets/hero/hero5.jpg",
  },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % heroItems.length);
    }, 10000);

    return () => clearTimeout(timer);
  }, [activeSlide]);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}

      {heroItems.map((item, index) => (
        <motion.div
          key={item.title}
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: activeSlide === index ? 1 : 1,
            scale: activeSlide === index ? 1 : 1.08,
          }}
          transition={{
            opacity: {
              duration: 1.2,
              ease: "easeInOut",
            },
            scale: {
              duration: 1,
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
            alt={item.title}
            fill
            priority={index === 0}
            className="object-cover"
          />
        </motion.div>
      ))}

      {/* Content */}
      <div
        className={`absolute ${heroItems[activeSlide].title === "Le' Floret" ? "left-9 bottom-18 text-left" : "inset-0 text-center"} z-10 flex flex-col items-center justify-center px-6 text-white`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`content-${activeSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={` ${heroItems[activeSlide].title === "Le' Floret" ? "text-left" : "flex flex-col items-center"}`}
          >
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`font-heading font-display text-[52px] font-light tracking-wide md:text-[48px] ${heroItems[activeSlide].title === "Le' Floret" ? "ml-2" : "ml-0"}`}
            >
              {heroItems[activeSlide].title}
            </motion.h1>

            <motion.button className="mt-6 border border-white px-8 py-3 font-heading text-[11px] font-medium uppercase tracking-[0.3em] transition-all duration-300 hover:bg-white hover:text-black">
              {heroItems[activeSlide].type}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 right-[-2] z-20 flex -translate-x-1/2 gap-3">
        {heroItems.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index !== activeSlide) {
                setActiveSlide(index);
              }
            }}
            className={`h-[10px] w-[10px] rounded-full transition-all border-2 duration-300 ${
              activeSlide === index ? "bg-white border-white" : "border-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
