"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/context/CategoriesContext";
import { CiSearch } from "react-icons/ci";
import HeaderSearchOverlay from "./HeaderSearchOverlay";

export default function HeaderTest() {
  const [activeTab, setActiveTab] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Safely retrieve context categories & collections from DB
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
      : [];

  const tabs = displayNavItems.map((item) => item.title);

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
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-2xl transition-colors cursor-pointer"
            aria-label="Toggle search"
          >
            <CiSearch />
          </button>
        </div>
      </div>

      {/* Nav Tabs Row */}
      {tabs.length > 0 && (
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
      )}

      {/* Mega Menu Overlay Wrapper (Absolute Positioning - Does not displace page layout) */}
      {activeTab !== null && displayNavItems[activeTab] && (
        <div className="block absolute top-full left-0 right-0 w-full bg-[#C9BDB2] border-t border-[#26221E]/16 px-4 md:px-8 shadow-[0_22px_40px_-26px_rgba(38,34,30,0.5)] z-[999] pointer-events-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(148px,1fr))_minmax(240px,336px)] gap-6 lg:gap-10 py-8.5 pb-11.5 max-w-[1620px] mx-auto items-start">
            {/* Dynamic Columns */}
            {displayNavItems[activeTab].categories?.map((col, cIdx) => (
              <div key={cIdx} className="flex flex-col">
                <Link href={col.href || `/categories/${col.slug}`}>
                <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30">
                  {col.title}
                </h4>
                </Link>
                {col.subtitle && (
                  <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                    {col.subtitle}
                  </p>
                )}
                <ul className="list-none m-0 p-0">
                  {col.links?.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.href || `/categories/${link.slug}`}
                        className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                      >
                        <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                          {link.name || link.title}
                          {link.badge && (
                            <em
                              className={`font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 relative -top-px ${
                                link.badge === "NEW"
                                  ? "text-white bg-[#8E4B2A]"
                                  : "text-[#26221E] opacity-45 border border-[#26221E]/30"
                              }`}
                            >
                              {link.badge}
                            </em>
                          )}
                        </b>
                        {link.count && (
                          <span className="font-mono text-[11px] opacity-50">
                            {link.count}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Dynamic Quick Action Links (at bottom of column 4 / last column) */}
                {cIdx === (displayNavItems[activeTab].categories.length - 1) &&
                  displayNavItems[activeTab].actionLinks &&
                  displayNavItems[activeTab].actionLinks.length > 0 && (
                    <div className="mt-3.5 pt-3.75 border-t border-[#26221E]/30">
                      {displayNavItems[activeTab].actionLinks.map((al, alIdx) => (
                        <a
                          key={alIdx}
                          href={al.href}
                          className="block font-sans text-[15px] text-[#26221E] no-underline py-1.75 opacity-82 hover:opacity-100 hover:underline underline-offset-4"
                        >
                          {al.label}
                        </a>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {/* Standalone Quick Action Links if no category columns exist */}
            {(!displayNavItems[activeTab].categories ||
              displayNavItems[activeTab].categories.length === 0) &&
              displayNavItems[activeTab].actionLinks &&
              displayNavItems[activeTab].actionLinks.length > 0 && (
                <div className="flex flex-col">
                  <div className="pt-1">
                    {displayNavItems[activeTab].actionLinks.map((al, alIdx) => (
                      <a
                        key={alIdx}
                        href={al.href}
                        className="block font-sans text-[15px] text-[#26221E] no-underline py-1.75 opacity-82 hover:opacity-100 hover:underline underline-offset-4"
                      >
                        {al.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

            {/* Dynamic Spotlight Featured Card (5th Column) */}
            {displayNavItems[activeTab].images?.[0] && (
              <Link
                href={displayNavItems[activeTab].images[0].href || "#"}
                className="block no-underline text-inherit bg-[#F5F1EB] group overflow-hidden md:col-span-2 lg:col-span-1 border border-[#E4DDD3]/60 transition-shadow hover:shadow-md"
              >
                <div className="aspect-[16/11] relative bg-stone-300 overflow-hidden">
                  {displayNavItems[activeTab].images[0].image ? (
                    <Image
                      src={displayNavItems[activeTab].images[0].image}
                      alt={displayNavItems[activeTab].images[0].title || "Featured Product"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-stone-300 text-stone-500 font-mono text-xs">
                      {displayNavItems[activeTab].images[0].title}
                    </div>
                  )}
                  <span className="absolute top-2.5 left-2.5 bg-[#9C7233] text-white font-mono text-[8.5px] uppercase tracking-[0.16em] px-2 py-0.5 font-bold shadow-xs">
                    {displayNavItems[activeTab].images[0].eyebrow || "Featured Product"}
                  </span>
                  {displayNavItems[activeTab].images[0].badge && (
                    <span className="absolute left-2.5 bottom-2 font-mono text-[9px] text-white/90 bg-black/40 px-2 py-0.5 rounded-xs backdrop-blur-xs">
                      {displayNavItems[activeTab].images[0].badge}
                    </span>
                  )}
                </div>
                <div className="p-4.5 sm:p-5 md:p-5.5">
                  <p className="font-mono text-[9.5px] tracking-[0.17em] uppercase text-[#9C7233] mb-2 font-bold">
                    {displayNavItems[activeTab].title}
                  </p>
                  <h5 className="font-serif text-[21px] font-normal mb-2 text-[#26221E] group-hover:underline underline-offset-4 leading-tight">
                    {displayNavItems[activeTab].images[0].title}
                  </h5>
                  <p className="font-serif text-[13.5px] leading-relaxed text-[#57504A] m-0 line-clamp-2">
                    {displayNavItems[activeTab].images[0].description}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* SEPARATE SEARCH OVERLAY & RESULTS BOX COMPONENT */}
      <HeaderSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        categories={categoriesFromDb}
      />
    </header>
  );
}
