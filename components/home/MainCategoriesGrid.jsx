"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MainCategoriesGrid({ categories }) {
  // Default 4 Main Categories matching design spec
  const defaultItems = [
    {
      id: "paving-flooring",
      title: "Paving & Flooring",
      image: "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png",
      description: "Cobblestone, crazy paving, patio packs, Kota and Kadappa flooring, pool tiles and copings, steps.",
      countLabel: "4 SUB-CATEGORIES · 12 SERIES",
      href: "/product-category/paving-flooring",
    },
    {
      id: "wall-cladding",
      title: "Wall Cladding",
      image: "https://res.cloudinary.com/chlmognp/image/upload/v1785340266/stoneza/homepage/hero/newslide2-sl58hw9a.png",
      description: "Facade slabs in 21 stones, EarthSkin panels, rockface, fieldstone, ledge stone and carved work.",
      countLabel: "3 SUB-CATEGORIES · 12 SERIES",
      href: "/product-category/wall-cladding",
    },
    {
      id: "landscape-garden",
      title: "Landscape & Garden",
      image: "https://res.cloudinary.com/chlmognp/image/upload/v1785340268/stoneza/homepage/hero/newslide3-kw98hw7m.png",
      description: "Sculptural boulders, pebbles, gravels, stone furniture and the Stone Glow lighting collection.",
      countLabel: "3 SUB-CATEGORIES · 5 SERIES",
      href: "/product-category/landscape-garden",
    },
    {
      id: "collections",
      title: "Collections",
      image: "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png",
      description: "Eighteen named stone series across four master families. Each one is a way of working with stone, not a group of colours.",
      countLabel: "4 FAMILIES · 18 SERIES",
      href: "/collections",
    },
  ];

  const items = (categories && categories.length >= 4)
    ? categories.slice(0, 4).map((cat, idx) => ({
        id: cat.id || cat.slug || idx,
        title: cat.title || cat.name,
        image: cat.image || cat.squareImage || defaultItems[idx % 4].image,
        description: cat.description || defaultItems[idx % 4].description,
        countLabel: cat.countLabel || defaultItems[idx % 4].countLabel,
        href: cat.href || `/product-category/${cat.slug}`,
      }))
    : defaultItems;

  return (
    <section className="py-12 sm:py-16 md:py-20 border-b-2 border-[#C9BDB2]/50 bg-white text-[#26221E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header Intro */}
        <div className="mb-10 sm:mb-12">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#8A8078] mb-3 font-semibold">
            WHERE TO START
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.08] tracking-[-0.02em] text-[#26221E]">
            Four ways into the catalogue
          </h2>
          <p className="font-sans text-[15px] leading-relaxed text-[#57504A] mt-3 max-w-[54ch]">
            Most people arrive knowing the surface they need rather than the stone. Start there.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col no-underline text-inherit"
            >
              {/* Image Container */}
              <div className="aspect-square relative w-full overflow-hidden bg-[#F5F1EB] border border-[#E4DDD3]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  unoptimized
                />
              </div>

              {/* Card Title & Content */}
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#26221E] mt-4 mb-2 group-hover:underline decoration-1 underline-offset-4">
                {item.title}
              </h3>
              <p className="font-sans text-[13.5px] sm:text-[14px] leading-[1.62] text-[#57504A] mb-4 min-h-[48px]">
                {item.description}
              </p>

              {/* Bottom Category Count Link */}
              <div className="mt-auto font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#8A8078] group-hover:text-[#26221E] transition-colors inline-flex items-center gap-1.5 font-medium">
                <span>{item.countLabel}</span>
                <span className="text-[12px] transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
