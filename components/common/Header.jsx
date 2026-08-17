"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/context/CategoriesContext";
import { CiSearch } from "react-icons/ci";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { PiXBold } from "react-icons/pi";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";

import HeaderSearchOverlay from "./HeaderSearchOverlay";

export default function Header() {
  const [activeTab, setActiveTab] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

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
      className="fixed w-full top-0 z-[900] bg-[#C9BDB2] border-b border-[#B5A899] font-sans text-[#26221E] antialiased"
      onMouseLeave={handleHeaderMouseLeave}
    >
      {/* Top Header Bar */}
      <div className="max-w-[1440px] mx-auto px-[clamp(18px,4.5vw,64px)] py-[15px] flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden text-2xl text-[#26221E] p-1 cursor-pointer"
          aria-label="Open mobile menu"
        >
          <HiOutlineMenuAlt3 />
        </button>

        {/* Left Links (Desktop) */}
        <div className="hidden lg:flex gap-5.5 items-center font-mono text-[10.5px] tracking-[0.17em] uppercase">
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
              className="h-auto w-[150px] sm:w-[170px] lg:w-[210px]"
            />
          </Link>
        </div>

        {/* Right Links & Search */}
        <div className="flex gap-5.5 items-center justify-end font-mono text-[10.5px] tracking-[0.17em] uppercase">
          <Link
            href="/pages/contact"
            className="hidden lg:block text-[#26221E] no-underline opacity-80 hover:opacity-100 transition-opacity font-body"
          >
            Contact
          </Link>
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-2xl text-[#26221E] transition-colors cursor-pointer"
            aria-label="Toggle search"
          >
            <CiSearch />
          </button>
        </div>
      </div>

      {/* Nav Tabs Row (Desktop) */}
      {tabs.length > 0 && (
        <div className="hidden lg:block border-t border-[#26221E]/12">
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
        <div className="hidden lg:block absolute top-full left-0 right-0 w-full bg-[#C9BDB2] border-t border-[#26221E]/16 px-4 md:px-8 shadow-[0_22px_40px_-26px_rgba(38,34,30,0.5)] z-[999] pointer-events-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(148px,1fr))_minmax(240px,336px)] gap-6 lg:gap-10 py-8.5 pb-11.5 max-w-[1620px] mx-auto items-start">
            {/* Dynamic Columns */}
            {displayNavItems[activeTab].categories?.map((col, cIdx) => (
              <div key={cIdx} className="flex flex-col">
                <Link href={col.href || `/categories/${col.slug}`}>
                  <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30 hover:underline underline-offset-4">
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

      {/* MOBILE SLIDE-OUT DRAWER MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[#C9BDB2] text-[#26221E] z-[10001] flex flex-col justify-between p-6 overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#26221E]/20 pb-4">
                  <div className="relative w-32 h-9">
                    <Image
                      src="/assets/logo/The-Stoneza-Logo.webp"
                      alt="Stoneza Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl text-[#26221E] cursor-pointer"
                    aria-label="Close menu"
                  >
                    <PiXBold />
                  </button>
                </div>

                <div className="space-y-4 font-heading text-sm tracking-widest uppercase">
                  {displayNavItems.map((item) => {
                    const isOpen = openCategory === item.title;
                    return (
                      <div
                        key={item.title}
                        className="border-b border-[#26221E]/15 pb-3"
                      >
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/categories/${item.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="font-bold text-[#26221E] hover:underline"
                          >
                            {item.title}
                          </Link>
                          {item.categories && item.categories.length > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setOpenCategory(isOpen ? null : item.title)
                              }
                              className="text-lg text-[#26221E] p-1 cursor-pointer"
                              aria-label="Expand category"
                            >
                              {isOpen ? <LuMinus /> : <GoPlus />}
                            </button>
                          )}
                        </div>

                        <AnimatePresence>
                          {isOpen && item.categories && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-4 pt-3 space-y-3 normal-case tracking-normal font-sans text-xs"
                            >
                              {item.categories.map((sub) => (
                                <div key={sub.title} className="space-y-1">
                                  <Link
                                    href={sub.href || `/categories/${sub.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="font-semibold text-[#26221E] block hover:underline"
                                  >
                                    {sub.title}
                                  </Link>
                                  {sub.links && (
                                    <div className="pl-3 space-y-1 border-l border-[#26221E]/20">
                                      {sub.links.map((link) => (
                                        <Link
                                          key={link.name}
                                          href={link.href || `/categories/${link.slug}`}
                                          onClick={() => setMobileMenuOpen(false)}
                                          className="block hover:underline"
                                        >
                                          {link.name}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  <Link
                    href="/projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-bold text-[#26221E] hover:underline border-b border-[#26221E]/15 pb-3"
                  >
                    Projects
                  </Link>
                  <Link
                    href="/pages/about-us"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-bold text-[#26221E] hover:underline border-b border-[#26221E]/15 pb-3"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/pages/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-bold text-[#26221E] hover:underline border-b border-[#26221E]/15 pb-3"
                  >
                    Contact
                  </Link>
                </div>
              </div>

              <div className="border-t border-[#26221E]/20 pt-6 space-y-2">
                <p className="text-[10.5px] text-[#26221E]/70 font-mono tracking-wider">
                  © 2026 Anantay Exports Pvt. Ltd. — trading as Stoneza.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SEARCH OVERLAY & RESULTS COMPONENT */}
      <HeaderSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        categories={categoriesFromDb}
      />
    </header>
  );
}