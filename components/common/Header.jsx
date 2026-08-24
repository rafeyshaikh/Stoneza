"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCategories } from "@/context/CategoriesContext";
import { CiSearch } from "react-icons/ci";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { PiXBold } from "react-icons/pi";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";

import HeaderSearchOverlay from "./HeaderSearchOverlay";

export default function Header() {
  const pathname = usePathname();
  const normalizedPath = (pathname || "").replace(/\/$/, "");
  const isHomePage = normalizedPath === "";

  const [activeTab, setActiveTab] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileMenuOpen]);

  // Auto close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveTab(null);
    setOpenCategory(null);
  }, [pathname]);

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

  const isSolidHeader =
    !isHomePage || isScrolled || activeTab !== null || isSearchOpen || mobileMenuOpen;

  const logoSrc = isSolidHeader
    ? "/assets/logo/The-Stoneza-Logo.webp"
    : "/assets/logo/The-Stoneza-Logo-light.png";

  return (
    <header
      className={`fixed w-full top-0 z-[900] font-sans antialiased transition-all duration-300 ${
        isSolidHeader
          ? "bg-[#C9BDB2] border-b border-[#B5A899] shadow-sm text-[#26221E]"
          : "bg-black/15 border-b border-transparent shadow-none text-white"
      }`}
      onMouseLeave={handleHeaderMouseLeave}
    >
      {/* Top Header Bar */}
      <div className="max-w-[1440px] mx-auto px-[clamp(18px,4.5vw,64px)] py-[15px] flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className={`lg:hidden flex items-center justify-center w-10 h-10 -ml-2 rounded-lg cursor-pointer transition-colors active:scale-95 ${
            isSolidHeader ? "text-[#26221E] hover:bg-[#26221E]/10" : "text-white hover:bg-white/15"
          }`}
          aria-label="Open mobile menu"
        >
          <HiOutlineMenuAlt3 className="w-6 h-6" />
        </button>

        {/* Left Links (Desktop) */}
        <div className="hidden lg:flex gap-5.5 items-center font-mono text-[10.5px] tracking-[0.17em] uppercase">
          <Link
            href="/projects"
            className={`no-underline opacity-85 font-body hover:opacity-100 transition-all ${
              isSolidHeader ? "text-[#26221E]" : "text-white"
            }`}
          >
            Projects
          </Link>
          <Link
            href="/pages/about-us"
            className={`no-underline font-body opacity-85 hover:opacity-100 transition-all ${
              isSolidHeader ? "text-[#26221E]" : "text-white"
            }`}
          >
            About
          </Link>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center items-center">
          <Link href="/" className="inline-block cursor-pointer">
            <Image
              src={logoSrc}
              alt="Stoneza - Timeless Surfaces"
              width={200}
              height={55}
              priority
              className="h-auto w-[150px] sm:w-[170px] lg:w-[210px] transition-opacity duration-300"
            />
          </Link>
        </div>

        {/* Right Links & Search */}
        <div className="flex gap-5.5 items-center justify-end font-mono text-[10.5px] tracking-[0.17em] uppercase">
          <Link
            href="/pages/contact"
            className={`hidden lg:block no-underline opacity-85 hover:opacity-100 transition-all font-body ${
              isSolidHeader ? "text-[#26221E]" : "text-white"
            }`}
          >
            Contact
          </Link>
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`text-2xl transition-colors cursor-pointer ${
              isSolidHeader ? "text-[#26221E]" : "text-white"
            }`}
            aria-label="Toggle search"
          >
            <CiSearch />
          </button>
        </div>
      </div>

      {/* Nav Tabs Row (Desktop) */}
      {displayNavItems.length > 0 && (
        <div
          className={`hidden lg:block border-t transition-colors duration-300 ${
            isSolidHeader ? "border-[#26221E]/12" : "border-transparent"
          }`}
        >
          <ul className="list-none m-0 p-0 flex justify-center gap-4 sm:gap-8 md:gap-14 flex-wrap">
            {displayNavItems.map((item, idx) => (
              <li key={idx} onMouseEnter={() => handleMouseEnterTab(idx)}>
                <Link
                  href={item.href || `/product-category/${item.slug}`}
                  onClick={() => toggleTab(idx)}
                  className={`appearance-none bg-transparent border-0 cursor-pointer font-sans text-[15px] font-semibold tracking-[0.13em] uppercase py-3.5 px-1 border-b-[3px] transition-colors font-heading inline-block no-underline ${
                    isSolidHeader ? "text-[#26221E]" : "text-white"
                  } ${
                    activeTab === idx
                      ? isSolidHeader
                        ? "border-[#26221E]"
                        : "border-white"
                      : isSolidHeader
                      ? "border-transparent hover:border-[#26221E]/30"
                      : "border-transparent hover:border-white/40"
                  }`}
                >
                  {item.title}
                </Link>
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
            {displayNavItems[activeTab].categories?.map((col, cIdx) => {
              const isClickable = !col.isCmsColumn && (col.isDbCategory || col.isCollection || Boolean(col.href));
              return (
                <div key={cIdx} className="flex flex-col">
                  {isClickable ? (
                    <Link href={col.href || `/product-category/${col.slug}`}>
                      <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30 hover:underline underline-offset-4 cursor-pointer">
                        {col.title}
                      </h4>
                    </Link>
                  ) : (
                    <h4 className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[#26221E] mb-3 pb-2.75 border-b border-[#26221E]/30 cursor-default select-none">
                      {col.title}
                    </h4>
                  )}
                {col.subtitle && (
                  <p className="font-mono text-[10.5px] tracking-[0.03em] text-[#26221E] opacity-50 mb-4 leading-normal">
                    {col.subtitle}
                  </p>
                )}
                <ul className="list-none m-0 p-0">
                  {col.links?.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.href || `/product-category/${link.slug}`}
                        className="flex justify-between items-baseline gap-2.5 text-[#26221E] no-underline py-2 group"
                      >
                        <b className="font-sans text-[16px] font-normal flex items-center gap-2.25 group-hover:underline underline-offset-4">
                          {link.name || link.title}
                          {link.badge && (
                            <em
                              className={`font-mono text-[8.5px] not-italic tracking-[0.11em] px-1.5 py-0.75 relative -top-px ${link.badge === "NEW"
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
              );
            })}

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
          <div className="fixed inset-0 z-[10000] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-[88%] max-w-[360px] h-[100dvh] bg-[#C9BDB2] text-[#26221E] shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Drawer Header with Logo & Close */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#26221E]/15 bg-[#C9BDB2]/95 backdrop-blur-md shrink-0">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative w-28 h-8 block"
                >
                  <Image
                    src="/assets/logo/The-Stoneza-Logo.webp"
                    alt="Stoneza Logo"
                    fill
                    className="object-contain"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-2xl text-[#26221E] hover:bg-[#26221E]/10 active:scale-95 transition-transform cursor-pointer"
                  aria-label="Close menu"
                >
                  <PiXBold />
                </button>
              </div>

              {/* Quick Search Button in Drawer */}
              <div className="px-5 pt-3 pb-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-[#FAF8F5]/70 border border-[#26221E]/15 text-[#26221E]/70 font-sans text-xs tracking-wide text-left cursor-pointer transition-colors hover:bg-[#FAF8F5]"
                >
                  <CiSearch className="w-4 h-4 text-[#26221E]" />
                  <span>Search natural stones, paving...</span>
                </button>
              </div>

              {/* Scrollable Navigation List */}
              <div className="flex-1 overflow-y-auto px-5 py-2 space-y-1 divide-y divide-[#26221E]/10 overscroll-contain">
                {/* Product Categories & Collections */}
                <div className="space-y-1 pb-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#9C7233] font-bold px-1 pt-2 pb-1">
                    Collections &amp; Stones
                  </p>
                  {displayNavItems.map((item) => {
                    const isOpen = openCategory === item.title;
                    const hasChildren = item.categories && item.categories.length > 0;
                    const mainHref = item.isCollection || item.slug === "collections"
                      ? "/collections"
                      : `/product-category/${item.slug}`;

                    return (
                      <div
                        key={item.title}
                        className="rounded-lg overflow-hidden transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <Link
                            href={mainHref}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex-1 py-2.5 px-2 font-heading text-sm font-semibold tracking-wider uppercase text-[#26221E] hover:text-[#9A4A2E] transition-colors"
                          >
                            {item.title}
                          </Link>
                          {hasChildren && (
                            <button
                              type="button"
                              onClick={() =>
                                setOpenCategory(isOpen ? null : item.title)
                              }
                              className="w-10 h-10 flex items-center justify-center text-lg text-[#26221E] hover:bg-[#26221E]/10 rounded-lg cursor-pointer transition-transform active:scale-90"
                              aria-label={`Toggle ${item.title} subcategories`}
                            >
                              {isOpen ? <LuMinus /> : <GoPlus />}
                            </button>
                          )}
                        </div>

                        <AnimatePresence>
                          {isOpen && hasChildren && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-[#FAF8F5]/40 rounded-lg mx-1 mb-2 p-3 space-y-2.5 text-xs font-sans"
                            >
                              {/* Direct view-all link */}
                              <Link
                                href={mainHref}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block font-semibold text-[#9A4A2E] pb-1 border-b border-[#26221E]/10 uppercase font-heading text-[10.5px] tracking-wider"
                              >
                                View all {item.title} →
                              </Link>

                              {item.categories.map((sub) => {
                                const isClickable = !sub.isCmsColumn && (sub.isDbCategory || sub.isCollection || Boolean(sub.href));
                                const subHref = sub.href || (sub.isCollection ? `/collections/${sub.slug}` : `/product-category/${sub.slug}`);

                                return (
                                  <div key={sub.title} className="space-y-1">
                                    {isClickable ? (
                                      <Link
                                        href={subHref}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="font-medium text-[#26221E] block hover:underline hover:text-[#9A4A2E] transition-colors"
                                      >
                                        {sub.title}
                                      </Link>
                                    ) : (
                                      <span className="font-semibold text-[#26221E]/80 block text-[11.5px] uppercase font-heading tracking-wide">
                                        {sub.title}
                                      </span>
                                    )}

                                    {sub.links && sub.links.length > 0 && (
                                      <div className="pl-3 space-y-1 border-l-2 border-[#26221E]/20 mt-1">
                                        {sub.links.map((link) => (
                                          <Link
                                            key={link.name}
                                            href={link.href || `/product-category/${link.slug}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-[#4A423C] hover:text-[#1C1714] hover:underline transition-colors py-0.5"
                                          >
                                            {link.name}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Company & Resource Links */}
                <div className="space-y-1 pt-3 pb-3 font-heading text-sm tracking-wider uppercase">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#9C7233] font-bold px-1 pt-1 pb-1">
                    Explore
                  </p>
                  <Link
                    href="/projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-2 font-semibold text-[#26221E] hover:text-[#9A4A2E] transition-colors"
                  >
                    Projects
                  </Link>
                  <Link
                    href="/blogs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-2 font-semibold text-[#26221E] hover:text-[#9A4A2E] transition-colors"
                  >
                    The Journal
                  </Link>
                  <Link
                    href="/pages/about-us"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-2 font-semibold text-[#26221E] hover:text-[#9A4A2E] transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/pages/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-2 font-semibold text-[#26221E] hover:text-[#9A4A2E] transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </div>

              {/* Drawer Bottom Actions: WhatsApp & Enquiry CTA */}
              <div className="p-4 border-t border-[#26221E]/15 bg-[#FAF8F5]/80 shrink-0 space-y-2">
                <a
                  href="https://wa.me/917877108154?text=Hi%20Stoneza%2C%20I%20would%20like%20to%20enquire%20about%20natural%20stone%20surfaces."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#1C1714] text-white font-heading text-xs font-bold tracking-[0.15em] uppercase rounded flex items-center justify-center gap-2 hover:bg-[#25D366] transition-colors no-underline shadow-xs"
                >
                  WhatsApp Enquiry
                </a>
                <Link
                  href="/pages/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 px-4 border border-[#26221E]/30 text-[#26221E] font-heading text-[11px] font-semibold tracking-[0.15em] uppercase rounded flex items-center justify-center hover:bg-[#26221E]/10 transition-colors no-underline"
                >
                  Request Sample Box
                </Link>
              </div>
            </motion.div>
          </div>
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