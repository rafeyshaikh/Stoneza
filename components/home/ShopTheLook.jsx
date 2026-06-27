"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PiCaretLeftThin, PiCaretRightThin } from "react-icons/pi";

import { shopTheLookData } from "@/data/ShopTheLookData";

export default function ShopTheLook() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    duration: 30,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSlideIndex(emblaApi.selectedScrollSnap());
      setProductIndex(0);
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const currentSlide = shopTheLookData[slideIndex];
  const currentProduct = currentSlide.products[productIndex];

  return (
    <section className="pb-15 border-b border-gray-300 mb-20">
      <div className="relative mx-auto max-w-[1480px] px-4 lg:px-[130px] pt-5">
        {/* TITLE */}

        <h2 className="mb-10 text-center font-display text-[28px] uppercase tracking-[6px] text-[#1C1B1B]">
          Shop The Look
        </h2>

        {/* LEFT ARROW */}

        <button
          onClick={scrollPrev}
          className="
            absolute left-2 lg:left-[20px]
            top-[58%]
            z-30
            hidden lg:block
            -translate-y-1/2
            text-[58px]
            text-[#5d5d5d]
            transition
            hover:opacity-60
          "
        >
          <PiCaretLeftThin />
        </button>

        {/* RIGHT ARROW */}

        <button
          onClick={scrollNext}
          className="
            absolute right-2 lg:right-[20px]
            top-[58%]
            z-30
            hidden lg:block
            -translate-y-1/2
            text-[58px]
            text-[#5d5d5d]
            transition
            hover:opacity-60
          "
        >
          <PiCaretRightThin />
        </button>

        {/* EMBLA */}

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {shopTheLookData.map((slide) => (
              <div
                key={slide.id}
                className="
                  min-w-full
                  flex
                  flex-col lg:flex-row
                  items-center
                  justify-center
                  gap-10 lg:gap-[80px]
                  min-h-[550px]
                "
              >
                {/* LEFT IMAGE */}

                <div className="relative h-[420px] w-full max-w-[550px] lg:h-[550px] overflow-hidden">
                  <Image
                    src={slide.banner}
                    alt="Shop The Look"
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* HOTSPOTS */}

                  {slide.products.map((product, index) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        setSlideIndex(slide.id - 1);
                        setProductIndex(index);
                      }}
                      className="absolute z-20"
                      style={{
                        top: product.hotspot.top,
                        left: product.hotspot.left,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div
                        className={`
                          flex
                          h-[42px]
                          w-[42px]
                          items-center
                          justify-center
                          rounded-full
                          transition-all
                          duration-300
                          hover:scale-110
                          ${
                            slideIndex === slide.id - 1 &&
                            productIndex === index
                              ? "bg-white/30"
                              : "bg-white/20"
                          }
                        `}
                      >
                        <div className="h-[14px] w-[14px] rounded-full bg-white" />
                      </div>
                    </button>
                  ))}
                </div>
                {/* RIGHT PRODUCT */}

                <div className="w-full max-w-[290px] lg:w-[270px]">
                  <motion.div
                    key={`${slideIndex}-${productIndex}`}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center"
                  >
                    {/* PRODUCT IMAGE */}

                    <div
                      className="group relative mb-5 h-[270px] w-[270px] bg-[#F4F1EB]"
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                    >
                      <Image
                        src={
                          hovered
                            ? currentProduct.imageHover
                            : currentProduct.image
                        }
                        alt={currentProduct.title}
                        width={250}
                        height={250}
                        className="h-full w-full object-contain"
                      />
                      {hovered && (
                      <div
                        className="
                        absolute bottom-0 left-0 right-0 z-20
                        translate-y-full opacity-0
                        transition-all duration-300
                        group-hover:translate-y-0
                        group-hover:opacity-100
                        flex items-center bg-white"
                        >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            console.log("Add To Bag", item.id);
                          }}
                          className="w-full border-r border-black py-3 text-[12px] uppercase tracking-[3px] font-heading cursor-pointer"
                        >
                          Add To Bag
                        </button>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            console.log("Buy Now", item.id);
                          }}
                          className="w-full py-3 text-[12px] uppercase tracking-[3px] font-heading cursor-pointer"
                        >
                          Buy Now
                        </button>
                      </div>)}
                    </div>

                    {/* TITLE */}

                    <h3 className="text-center font-body text-[14px] text-[#1C1B1B]">
                      {currentProduct.title}
                    </h3>

                    {/* PRICE */}

                    <p className="mt-2 font-body text-[14px] text-[#6D6D6D]">
                      {currentProduct.price}
                    </p>

                    {/* BUTTON */}

                    <Link
                      href={currentProduct.href}
                      className="
                        mt-8
                        flex
                        h-[48px]
                        w-full
                        items-center
                        justify-center
                        bg-[#6B615B]
                        text-[12px]
                        uppercase
                        tracking-[4px]
                        text-white
                        transition
                        hover:bg-[#5B514A]
                      "
                    >
                      View This Product
                    </Link>

                    {/* PAGINATION */}

                    <div className="mt-8 flex items-center gap-[14px]">
                      {currentSlide.products.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setProductIndex(index)}
                          className={`
                            h-[9px]
                            w-[9px]
                            rounded-full
                            transition-all
                            duration-300
                            cursor-pointer
                            
                            ${
                              productIndex === index
                                ? "bg-black scale-110"
                                : "border-2 border-[#CFCFCF] bg-transparent"
                            }
                          `}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE ARROWS */}

        <div className="mt-8 flex justify-center gap-8 lg:hidden">
          <button onClick={scrollPrev} className="text-4xl text-[#5d5d5d]">
            <PiCaretLeftThin />
          </button>

          <button onClick={scrollNext} className="text-4xl text-[#5d5d5d]">
            <PiCaretRightThin />
          </button>
        </div>
      </div>
    </section>
  );
}
