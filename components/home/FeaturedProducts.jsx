"use client";

import Link from "next/link";
import Image from "next/image";
import { PiCaretLeftLight } from "react-icons/pi";
import { useState } from "react";
import ImageWithLoader from "../common/Loader";
import ProductWatermark from "../common/ProductWatermark";
import { isValidImageUrl, optimizeImageUrl } from "@/lib/utils";
import { getPlaceholderImage } from "@/lib/placeholderImage";

export default function FeaturedProducts({ products = [], cmsData }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayProducts =
    products.length > 0
      ? products.map((prod, idx) => {
          const firstImg = prod.image || prod.images?.[0]?.url || "";
          const secondImg = prod.hoverImage?.url || prod.images?.[1]?.url || "";
          const mainImg = isValidImageUrl(firstImg)
            ? optimizeImageUrl(firstImg)
            : getPlaceholderImage(prod.name || "Featured Stone", idx);
          const hoverImg = isValidImageUrl(secondImg)
            ? optimizeImageUrl(secondImg)
            : isValidImageUrl(firstImg)
            ? optimizeImageUrl(firstImg)
            : getPlaceholderImage(prod.name || "Featured Stone", idx + 50);

          return {
            title: prod.name || prod.title || "Featured Stone",
            image: mainImg,
            image_hover: hoverImg,
            slug: prod.slug,
          };
        })
      : [];

  if (displayProducts.length === 0) return null;

  return (
    <section className="w-full pb-10 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-5 lg:gap-10 items-center">
        {/* Left Banner */}
        <div className="relative overflow-hidden">
          <Image
            src={cmsData?.bannerImage?.url || "/assets/Banner/All_products_banner.png"}
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
                href={item.slug ? `/product/${item.slug}` : "#"}
                className={`relative w-[160px] h-[160px] lg:w-[220px] lg:h-[220px] overflow-hidden group cursor-pointer
                ${currentIndex === index ? "opacity-100" : "hidden pointer-events-none "}`}
              >
                {/* Main Image */}
                <div className="w-full h-full relative transition-opacity duration-500 group-hover:opacity-0">
                  <ImageWithLoader
                    src={item.image}
                    alt={item.title}
                    fill
                    className="w-full h-full object-cover"
                    placeholderTitle={item.title}
                  />
                </div>

                {/* Hover Image */}
                <div className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
                  <ImageWithLoader
                    src={item.image_hover}
                    alt={`${item.title} - hover`}
                    fill
                    className="w-full h-full object-cover"
                    placeholderTitle={item.title}
                    seedIndex={50}
                  />
                </div>

                {/* Product Watermark */}
                <ProductWatermark />
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

            <Link href="/product">
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