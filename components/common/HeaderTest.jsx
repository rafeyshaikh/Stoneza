"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/context/CategoriesContext";

export default function HeaderTest() {
  const [activeTab, setActiveTab] = useState(null);

  // Safely retrieve context categories from DB if available
  let categoriesFromDb = [];
  let collectionsFromDb = null;
  try {
    const context = useCategories();
    categoriesFromDb = context.categories || [];
    collectionsFromDb = context.collections || null;
  } catch (err) {
    // Graceful fallback if rendered outside provider
  }

  const handleMouseEnterTab = (index) => {
    setActiveTab(index);
  };

  const handleHeaderMouseLeave = () => {
    setActiveTab(null);
  };

  const toggleTab = (index) => {
    setActiveTab((prev) => (prev === index ? null : index));
  };

  const displayNavItems =
    categoriesFromDb && categoriesFromDb.length > 0
      ? collectionsFromDb
        ? [...categoriesFromDb, collectionsFromDb]
        : categoriesFromDb
      : null;

  const tabs =
    displayNavItems && displayNavItems.length > 0
      ? displayNavItems.map((item) => item.title)
      : [
          "Paving & Flooring",
          "Wall Cladding",
          "Landscape & Garden",
          "Collections",
        ];

  return (
    <header
      className="sticky top-0 z-[900] bg-[#C9BDB2] border-b border-[#B5A899] font-sans text-[#26221E] antialiased"
      onMouseLeave={handleHeaderMouseLeave}
    >
      {/* Top Header Bar */}
      <div className="max-w-[1440px] mx-auto px-[clamp(18px,4.5vw,64px)] py-[15px] grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Left Links */}
        <div className="flex gap-5.5 items-center font-mono text-[10.5px] tracking-[0.17em] uppercase">
          <Link
            href="/projects"
            className="text-[#26221E] no-underline opacity-80 hover:opacity-100 transition-opacity"
          >
            Projects
          </Link>
          <Link
            href="/pages/about-us"
            className="text-[#26221E] no-underline opacity-80 hover:opacity-100 transition-opacity"
          >
            About
          </Link>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center items-center">
          <Link href="/" className="inline-block cursor-pointer">
            <Image
              src="/assets/logo/The-Stoneza-Logo.webp"
              alt="Stoneza - Timeless Surfaces"
              width={200}
              height={55}
              priority
              className="h-auto w-[160px] lg:w-[210px]"
            />
          </Link>
        </div>

        {/* Right Links & Search */}
        <div className="flex gap-5.5 items-center justify-end font-mono text-[10.5px] tracking-[0.17em] uppercase">
          <Link
            href="/pages/contact"
            className="text-[#26221E] no-underline opacity-80 hover:opacity-100 transition-opacity font-body"
          >
            Contact
          </Link>
          <Link
            href="/products"
            className="flex opacity-85 hover:opacity-100 transition-opacity text-[#26221E]"
            aria-label="Search"
          >
            <svg
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <circle cx="10.5" cy="10.5" r="6.6" />
              <line x1="15.5" y1="15.5" x2="21" y2="21" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Nav Tabs Row */}
      <div className="border-t border-[#26221E]/12">
        <ul className="list-none m-0 p-0 flex justify-center gap-4 sm:gap-8 md:gap-14 flex-wrap">
          {tabs.map((tab, idx) => (
            <li key={idx} onMouseEnter={() => handleMouseEnterTab(idx)}>
              <button
                type="button"
                onClick={() => toggleTab(idx)}
                aria-expanded={activeTab === idx}
                className={`appearance-none bg-transparent border-0 cursor-pointer font-sans text-[15px] font-semibold tracking-[0.13em] uppercase text-[#26221E] py-3.5 px-1 border-b-[3px] transition-colors font-heading ${
                  activeTab === idx
                    ? "border-[#26221E]"
                    : "border-transparent hover:border-[#26221E]/30"
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mega Menu Overlay Wrapper */}
      {activeTab !== null && (
        <div className="block bg-[#C9BDB2] border-t border-[#26221E]/16 px-4 md:px-8 shadow-[0_22px_40px_-26px_rgba(38,34,30,0.5)]">
          {/* Panel 0: Paving & Flooring */}
          {activeTab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(148px,1fr))_minmax(240px,336px)] gap-6 lg:gap-10 py-8.5 pb-11.5 max-w-[1620px] mx-auto items-start">
              {/* Col 1 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Paving
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  CobbleCraft &middot; Nature Mosaic &middot; OutFloor
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/cobblestone"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Cobblestone
                      </b>
                      <span className="font-mono text-[11px] opacity-50">15</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/crazy-paving"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Crazy Paving
                      </b>
                      <span className="font-mono text-[11px] opacity-50">8</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/paving-tiles"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Paving Tiles &amp; Patio Packs
                      </b>
                      <span className="font-mono text-[11px] opacity-50">13</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 2 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Flooring
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  Foundations &middot; StoneWeave
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/kota-stone"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Kota Stone
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">2</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/kadappa-stone"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Midnight Black &middot; Kadappa
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">1</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/jaisalmer-stone"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Jaisalmer Stone
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">1</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/sandstone-flooring"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Sandstone Flooring
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">6</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/pattern-inlay"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Pattern &amp; Inlay
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">4</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Tandur Stone
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.25 py-0.5 text-[#26221E] opacity-45 border border-[#26221E]/30 relative -top-px">
                          SOON
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">&ndash;</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Pool &amp; Water
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  OutFloor &middot; Stone Artistry
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/pool-tiles"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Pool Tiles
                      </b>
                      <span className="font-mono text-[11px] opacity-50">2</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/pool-copings"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Pool Copings
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">6</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 4 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Steps &amp; Paths
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  Stone Rise &middot; Stone Artistry
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/stone-steps"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Steps &amp; Treads
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">4</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/stepping-stones"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Stepping Stones
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">1</span>
                    </Link>
                  </li>
                </ul>
                <div className="mt-3.5 pt-3.75 border-t border-[#26221E]/30">
                  <a
                    href="#spec"
                    className="block font-sans text-[15px] text-[#26221E] no-underline py-1.75 opacity-82 hover:opacity-100 hover:underline underline-offset-4"
                  >
                    Help me choose a thickness
                  </a>
                  <a
                    href="mailto:sales@stoneza.in?subject=Sample%20request"
                    className="block font-sans text-[15px] text-[#26221E] no-underline py-1.75 opacity-82 hover:opacity-100 hover:underline underline-offset-4"
                  >
                    Request samples
                  </a>
                </div>
              </div>

              {/* Featured Product Card - Paving & Flooring */}
              <Link
                href="/categories/crazy-paving"
                className="block no-underline text-inherit bg-[#F5F1EB] group overflow-hidden md:col-span-2 lg:col-span-1 border border-[#E4DDD3]/60 transition-shadow hover:shadow-md"
              >
                <div className="aspect-[16/11] relative bg-stone-300 overflow-hidden">
                  <Image
                    src="https://stoneza.in/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-20-at-3.41.21-PM-1-1.png"
                    alt="Castle Grey Crazy Paving"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <span className="absolute top-2.5 left-2.5 bg-[#9C7233] text-white font-mono text-[8.5px] uppercase tracking-[0.16em] px-2 py-0.5 font-bold shadow-xs">
                    Featured Product
                  </span>
                  <span className="absolute left-2.5 bottom-2 font-mono text-[9px] text-white/90 bg-black/40 px-2 py-0.5 rounded-xs backdrop-blur-xs">
                    castle-grey-crazy-paving.webp
                  </span>
                </div>
                <div className="p-4.5 sm:p-5 md:p-5.5">
                  <p className="font-mono text-[9.5px] tracking-[0.17em] uppercase text-[#9C7233] mb-2 font-bold">
                    Paving &amp; Flooring
                  </p>
                  <h5 className="font-serif text-[21px] font-normal mb-2 text-[#26221E] group-hover:underline underline-offset-4 leading-tight">
                    Castle Grey Crazy Paving
                  </h5>
                  <p className="font-serif text-[13.5px] leading-relaxed text-[#57504A] m-0 line-clamp-2">
                    Supplied to JW Marriott Ranthambore. Quarry-direct, batch-matched across phases.
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Panel 1: Wall Cladding */}
          {activeTab === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(148px,1fr))_minmax(240px,336px)] gap-6 lg:gap-10 py-8.5 pb-11.5 max-w-[1620px] mx-auto items-start">
              {/* Col 1 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Facade &amp; Elevation
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  Facade Stone &middot; EarthSkin &middot; Veneer Series
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/facade-slabs"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Facade Slabs
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">23</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/earthskin"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        EarthSkin &mdash; Natural Face
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">8</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Stone Veneer
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.25 py-0.5 text-[#26221E] opacity-45 border border-[#26221E]/30 relative -top-px">
                          SOON
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">1</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 2 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Textured Cladding
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  Rawscape &middot; Stonefield &middot; Ledge Form
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/rockface"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Rockface &amp; Raw
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">10</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/fieldstone"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Fieldstone Cladding
                      </b>
                      <span className="font-mono text-[11px] opacity-50">7</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/ledge-stone"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Ledge Stone
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">6</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/brick-cladding"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Stone Bricks
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">&ndash;</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/fluted-panels"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Stone Flutes
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">1</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/cascade"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Cascade
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">2</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Carved &amp; Sculpted
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  CNC Atelier &middot; Cascade
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/carved-jaali"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Carved Jaali
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">1</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/3d-panels"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        3D Stone Panels
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">1</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/carved-feature-walls"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Carved Feature Walls
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">1</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/tacha-tales"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Tacha Tales
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">1</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 4 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  By Application
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  Landing pages, phase 1
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/products"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Elevation Design
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.25 py-0.5 text-[#26221E] opacity-45 border border-[#26221E]/30 relative -top-px">
                          SOON
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">&ndash;</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Boundary Walls
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.25 py-0.5 text-[#26221E] opacity-45 border border-[#26221E]/30 relative -top-px">
                          SOON
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">&ndash;</span>
                    </Link>
                  </li>
                </ul>
                <div className="mt-3.5 pt-3.75 border-t border-[#26221E]/30">
                  <a
                    href="#choosing"
                    className="block font-sans text-[15px] text-[#26221E] no-underline py-1.75 opacity-82 hover:opacity-100 hover:underline underline-offset-4"
                  >
                    Help me choose
                  </a>
                  <a
                    href="mailto:sales@stoneza.in?subject=Sample%20request"
                    className="block font-sans text-[15px] text-[#26221E] no-underline py-1.75 opacity-82 hover:opacity-100 hover:underline underline-offset-4"
                  >
                    Request samples
                  </a>
                </div>
              </div>

              {/* Featured Product Card - Wall Cladding */}
              <Link
                href="/categories/fieldstone"
                className="block no-underline text-inherit bg-[#F5F1EB] group overflow-hidden md:col-span-2 lg:col-span-1 border border-[#E4DDD3]/60 transition-shadow hover:shadow-md"
              >
                <div className="aspect-[16/11] relative bg-stone-300 overflow-hidden">
                  <Image
                    src="https://stoneza.in/wp-content/uploads/2026/04/Home-Page.webp"
                    alt="Cosmic Rust Fieldstone"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <span className="absolute top-2.5 left-2.5 bg-[#9C7233] text-white font-mono text-[8.5px] uppercase tracking-[0.16em] px-2 py-0.5 font-bold shadow-xs">
                    Featured Product
                  </span>
                  <span className="absolute left-2.5 bottom-2 font-mono text-[9px] text-white/90 bg-black/40 px-2 py-0.5 rounded-xs backdrop-blur-xs">
                    cosmic-rust-fieldstone.webp
                  </span>
                </div>
                <div className="p-4.5 sm:p-5 md:p-5.5">
                  <p className="font-mono text-[9.5px] tracking-[0.17em] uppercase text-[#9C7233] mb-2 font-bold">
                    Wall Cladding
                  </p>
                  <h5 className="font-serif text-[21px] font-normal mb-2 text-[#26221E] group-hover:underline underline-offset-4 leading-tight">
                    Cosmic Rust Fieldstone
                  </h5>
                  <p className="font-serif text-[13.5px] leading-relaxed text-[#57504A] m-0 line-clamp-2">
                    Pre-blended crates held to a fixed ratio. The hand-laid wall, without the hand-laid variance.
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Panel 2: Landscape & Garden */}
          {activeTab === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(148px,1fr))_minmax(240px,336px)] gap-6 lg:gap-10 py-8.5 pb-11.5 max-w-[1620px] mx-auto items-start">
              {/* Col 1 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Boulders &amp; Feature Stone
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  BoulderScape
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/boulders"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Sculptural Boulders
                      </b>
                      <span className="font-mono text-[11px] opacity-50">9</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 2 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Ground Cover
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  PebbleScape &middot; GravelScape
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/pebbles"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Pebbles
                      </b>
                      <span className="font-mono text-[11px] opacity-50">6</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/gravels"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Gravels
                      </b>
                      <span className="font-mono text-[11px] opacity-50">4</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Stone Objects
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  Stone Artistry &middot; Stone Glow
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/stone-furniture"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Stone Furniture
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">4</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/stone-glow"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Stone Glow Lighting
                        <em className="font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 text-white bg-[#8E4B2A] relative -top-px">
                          NEW
                        </em>
                      </b>
                      <span className="font-mono text-[11px] opacity-50">6</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 4 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Also in Landscape
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  Primary home is Paving
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/stepping-stones"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        &#8599;&nbsp; Stepping Stones
                      </b>
                      <span className="font-mono text-[11px] opacity-50"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/stone-steps"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        &#8599;&nbsp; Steps &amp; Treads
                      </b>
                      <span className="font-mono text-[11px] opacity-50"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/pool-copings"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        &#8599;&nbsp; Pool Copings
                      </b>
                      <span className="font-mono text-[11px] opacity-50"></span>
                    </Link>
                  </li>
                </ul>
                <div className="mt-3.5 pt-3.75 border-t border-[#26221E]/30">
                  <a
                    href="mailto:sales@stoneza.in?subject=Sample%20request"
                    className="block font-sans text-[15px] text-[#26221E] no-underline py-1.75 opacity-82 hover:opacity-100 hover:underline underline-offset-4"
                  >
                    Request samples
                  </a>
                </div>
              </div>

              {/* Featured Product Card - Landscape & Garden */}
              <Link
                href="/categories/stone-glow"
                className="block no-underline text-inherit bg-[#F5F1EB] group overflow-hidden md:col-span-2 lg:col-span-1 border border-[#E4DDD3]/60 transition-shadow hover:shadow-md"
              >
                <div className="aspect-[16/11] relative bg-stone-300 overflow-hidden">
                  <Image
                    src="https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png"
                    alt="Stone Glow Lighting Collection"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <span className="absolute top-2.5 left-2.5 bg-[#9C7233] text-white font-mono text-[8.5px] uppercase tracking-[0.16em] px-2 py-0.5 font-bold shadow-xs">
                    Featured Product
                  </span>
                  <span className="absolute left-2.5 bottom-2 font-mono text-[9px] text-white/90 bg-black/40 px-2 py-0.5 rounded-xs backdrop-blur-xs">
                    stone-glow-lighting.webp
                  </span>
                </div>
                <div className="p-4.5 sm:p-5 md:p-5.5">
                  <p className="font-mono text-[9.5px] tracking-[0.17em] uppercase text-[#9C7233] mb-2 font-bold">
                    Landscape &amp; Garden
                  </p>
                  <h5 className="font-serif text-[21px] font-normal mb-2 text-[#26221E] group-hover:underline underline-offset-4 leading-tight">
                    Stone Glow Collection
                  </h5>
                  <p className="font-serif text-[13.5px] leading-relaxed text-[#57504A] m-0 line-clamp-2">
                    Sculptural natural stone bollards and garden lighting. Din mein sculpture, raat mein vibe.
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Panel 3: Collections */}
          {activeTab === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(148px,1fr))_minmax(240px,336px)] gap-6 lg:gap-10 py-8.5 pb-11.5 max-w-[1620px] mx-auto items-start">
              {/* Col 1 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Surface Collections
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  How the face is made
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/cobblestone"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        CobbleCraft
                      </b>
                      <span className="font-mono text-[11px] opacity-50">15</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/rockface"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Rawscape
                      </b>
                      <span className="font-mono text-[11px] opacity-50">10</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/fieldstone"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Stonefield
                      </b>
                      <span className="font-mono text-[11px] opacity-50">7</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/ledge-stone"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Ledge Form
                      </b>
                      <span className="font-mono text-[11px] opacity-50">6</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 2 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Facade Collections
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  Slab and panel
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/facade-slabs"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Facade Stone
                      </b>
                      <span className="font-mono text-[11px] opacity-50">23</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/earthskin"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        EarthSkin
                      </b>
                      <span className="font-mono text-[11px] opacity-50">8</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Atelier &amp; Artistry
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  Cut, carved and made to order
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/carved-jaali"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        CNC Atelier
                      </b>
                      <span className="font-mono text-[11px] opacity-50">4</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/cascade"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Cascade
                      </b>
                      <span className="font-mono text-[11px] opacity-50">2</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/pattern-inlay"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        StoneWeave
                      </b>
                      <span className="font-mono text-[11px] opacity-50">4</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 4 */}
              <div className="flex flex-col">
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  Landscape Collections
                </h4>
                <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                  Objects and ground
                </p>
                <ul className="list-none m-0 p-0">
                  <li>
                    <Link
                      href="/categories/stone-glow"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Stone Glow
                      </b>
                      <span className="font-mono text-[11px] opacity-50">6</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/stone-furniture"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        Stone Artistry
                      </b>
                      <span className="font-mono text-[11px] opacity-50">4</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/boulders"
                      className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                    >
                      <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                        BoulderScape
                      </b>
                      <span className="font-mono text-[11px] opacity-50">9</span>
                    </Link>
                  </li>
                </ul>
                <div className="mt-3.5 pt-3.75 border-t border-[#26221E]/30">
                  <a
                    href="mailto:sales@stoneza.in?subject=Sample%20request"
                    className="block font-sans text-[15px] text-[#26221E] no-underline py-1.75 opacity-82 hover:opacity-100 hover:underline underline-offset-4"
                  >
                    Request samples
                  </a>
                </div>
              </div>

              {/* Featured Card - Collections */}
              <Link
                href="/collections"
                className="block no-underline text-inherit bg-[#F5F1EB] group overflow-hidden md:col-span-2 lg:col-span-1 border border-[#E4DDD3]/60 transition-shadow hover:shadow-md"
              >
                <div className="aspect-[16/11] relative bg-stone-300 overflow-hidden">
                  <Image
                    src="https://stoneza.in/wp-content/uploads/2026/02/Patterns-Finishes-natural-stone.webp"
                    alt="Ten Named Collections"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <span className="absolute top-2.5 left-2.5 bg-[#9C7233] text-white font-mono text-[8.5px] uppercase tracking-[0.16em] px-2 py-0.5 font-bold shadow-xs">
                    Featured Collection
                  </span>
                  <span className="absolute left-2.5 bottom-2 font-mono text-[9px] text-white/90 bg-black/40 px-2 py-0.5 rounded-xs backdrop-blur-xs">
                    stoneza-collections.webp
                  </span>
                </div>
                <div className="p-4.5 sm:p-5 md:p-5.5">
                  <p className="font-mono text-[9.5px] tracking-[0.17em] uppercase text-[#9C7233] mb-2 font-bold">
                    Surface Collections
                  </p>
                  <h5 className="font-serif text-[21px] font-normal mb-2 text-[#26221E] group-hover:underline underline-offset-4 leading-tight">
                    Ten Named Collections
                  </h5>
                  <p className="font-serif text-[13.5px] leading-relaxed text-[#57504A] m-0 line-clamp-2">
                    Each one is a way of working with stone, not a group of colours.
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
