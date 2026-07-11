"use client";

import Link from "next/link";

import Image from "next/image";
import { PiCaretLeftLight } from "react-icons/pi";
import { useState } from "react";
import ImageWithLoader from "../common/Loader";

const largeShopData = [
  {
    title: "Ming Blue Decor Jar",
    image: "/assets/gifting/1-Ming-Blue-Decor-Jar.jpg",
    image_hover: "/assets/gifting/1-Ming-Blue-Decor-Jar-hover.jpg",
  },
  {
    title: "Tidal Beige Decor Platter",
    image: "/assets/gifting/2-Tidal-Beige-Decor-Platter.jpg",
    image_hover: "/assets/gifting/2-Tidal-Beige-Decor-Platter-hover.jpg",
  },
  {
    title: "Brushstroke Grey Decor Ball",
    image: "/assets/gifting/3-Brushstroke-Grey-Decor-Ball.jpg",
    image_hover: "/assets/gifting/3-Brushstroke-Grey-Decor-Ball-hover.jpg",
  },
  {
    title: "Auric Grey Gold Fern Vase 1",
    image: "/assets/gifting/4-Auric-Grey-Gold-Fern-Vase-1.jpg",
    image_hover: "/assets/gifting/4-Auric-Grey-Gold-Fern-Vase-1-hover.jpg",
  },
  {
    title: "Custard Apple Grey Gold Decor Set Of 2",
    image: "/assets/gifting/5-Custard-Apple-Grey-Gold-Decor-Set-Of-2.jpg",
    image_hover: "/assets/gifting/5-Custard-Apple-Grey-Gold-Decor-Set-Of-2-hover.jpg",
  },
  {
    title: "Auric Grey Gold Fern Vase S",
    image: "/assets/gifting/6-Auric-Grey-Gold-Fern-Vase-S.jpg",
    image_hover: "/assets/gifting/6-Auric-Grey-Gold-Fern-Vase-S-hover.jpg",
  },
  {
    title: "Audra Gold Table Clock",
    image: "/assets/gifting/7-Audra-Gold-Table-Clock.jpg",
    image_hover: "/assets/gifting/7-Audra-Gold-Table-Clock-hover.jpg",
  },
  {
    title: "Fern White Gold Bookend",
    image: "/assets/gifting/8-Fern-White-Gold-Bookend.jpg",
    image_hover: "/assets/gifting/8-Fern-White-Gold-Bookend-hover.jpg",
  },
  {
    title: "Primate Off-White Ceramic Vase",
    image: "/assets/gifting/9-Primate-Off-White-Ceramic-Vase.jpg",
    image_hover: "/assets/gifting/9-Primate-Off-White-Ceramic-Vase-hover.jpg",
  },
  {
    title: "Primate Grey Ceramic Vase",
    image: "/assets/gifting/10-Primate-Grey-Ceramic-Vase.jpg",
    image_hover: "/assets/gifting/9-Primate-Off-White-Ceramic-Vase-hover.jpg",
  },
  {
    title: "Sparkle Brown Candle Holder",
    image: "/assets/gifting/11-Sparkle-Brown-Candle-Holder.jpg",
    image_hover: "/assets/gifting/11-Sparkle-Brown-Candle-Holder-hover.jpg",
  },
  {
    title: "Sparkle Grey Candle Holder",
    image: "/assets/gifting/12-Sparkle-Grey-Candle-Holder.jpg",
    image_hover: "/assets/gifting/11-Sparkle-Brown-Candle-Holder-hover.jpg",
  },
  {
    title: "Sparkle Grey Bird Sculptures",
    image: "/assets/gifting/13-Sparkle-Grey-Bird-Sculptures.jpg",
    image_hover: "/assets/gifting/13-Sparkle-Grey-Bird-Sculptures-hover.jpg",
  },
  {
    title: "Sparkle Grey Candlebra",
    image: "/assets/gifting/14-Sparkle-Grey-Candlebra.jpg",
    image_hover: "/assets/gifting/11-Sparkle-Brown-Candle-Holder-hover.jpg",
  },
  {
    title: "Agate Brown Reed Diffuser",
    image: "/assets/gifting/15-Agate-Brown-Reed-Diffuser.jpg",
    image_hover: "/assets/gifting/15-Agate-Brown-Reed-Diffuser-hover.jpg",
  }
];

export default function FeaturedProducts({ products = [], cmsData }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayProducts = products.length > 0
    ? products.map((prod) => ({
        title: prod.name,
        image: prod.images?.[0]?.url || "/assets/placeholder.jpg",
        image_hover: prod.hoverImage?.url || prod.images?.[0]?.url || "/assets/placeholder.jpg",
        slug: prod.slug,
      }))
    : largeShopData;

  return (
    <section className="w-full py-10 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-5 lg:gap-10 items-center">
        {/* Left Banner */}
        <div className="relative overflow-hidden">
          <Image
            src={cmsData?.bannerImage?.url || "/assets/gifting/Gifting_Banner.jpg"}
            alt={cmsData?.title || "Featured Products"}
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
            priority
            unoptimized={cmsData?.bannerImage?.url ? cmsData.bannerImage.url.startsWith("http") : false}
          />
        </div>

        {/* Right Content */}
        <div className="flex flex-col items-center mr-4">
          {/* Product Slider */}
          <div className="flex items-center justify-between gap-6 mb-10 w-full">
            <button 
              className="text-[#6B6765] hover:opacity-70 transition cursor-pointer"
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? displayProducts.length - 1 : prev - 1))}
            >
              <PiCaretLeftLight size={50} className="text-[#1c1b1b] text-bold cursor-pointer" />
            </button>

            {displayProducts.map((item, index) => (
              <Link
                key={index}
                href={item.slug ? `/products/${item.slug}` : "#"}
                className={`relative w-[160px] h-[160px] lg:w-[220px] lg:h-[220px] overflow-hidden group cursor-pointer
                ${currentIndex === index ? "opacity-100" : "hidden pointer-events-none "}`}
              >
                {/* Main Image */}
                <ImageWithLoader
                  src={item.image}
                  alt={item.title}
                  width={300}
                  height={400}
                  className="w-full h-auto transition-opacity duration-500 group-hover:opacity-0"
                />

                {/* Hover Image */}
                <Image
                  src={item.image_hover}
                  alt={item.title}
                  width={300}
                  height={400}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </Link>
            ))}

            <button 
              className="text-[#6B6765] hover:opacity-70 transition cursor-pointer"
              onClick={() => setCurrentIndex((prev) => (prev === displayProducts.length - 1 ? 0 : prev + 1))}
            >
              <PiCaretLeftLight size={50} className="text-[#1c1b1b] text-bold rotate-180" />
            </button>
          </div>

          {/* Text Content */}
          <div className="max-w-md text-center">
            <h2 className="font-display text-[32px] text-[#6B6765] mb-6">
              {cmsData?.title || "Featured Products"}
            </h2>

            <p className="font-body text-[14px] leading-7 text-[#1c1b1b] mb-8 text-left">
              {cmsData?.caption || "Discover Our Handpicked Collection of Best-Selling Items. Perfect for Adding a Touch of Elegance to Your Home."}
            </p>

            <Link href="/products">
              <button className="border border-[#6B6765] px-8 py-3 text-sm tracking-[0.15em] uppercase text-[#6B6765] transition-all duration-300 hover:bg-[#6B6765] hover:text-white cursor-pointer">
                {cmsData?.buttonText || "Explore"}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}