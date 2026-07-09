"use client";

import Container from "./Container";
import Image from "next/image";
import Link from "next/link";
import MegaMenu from "./Megamenu";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/context/CategoriesContext";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import { CiSearch } from "react-icons/ci";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { PiXBold } from "react-icons/pi";
import { PiCaretDownThin } from "react-icons/pi";
import ProductCard from "../product/ProductCard";

export default function Header() {
  const { categories, setCategories } = useCategories();
  const [activeMenu, setActiveMenu] = useState(null);
  const [logoHovered, setLogoHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, userRole } = useAuth();
  const [hoveredId , setHoveredId] = useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/public/products?search=${encodeURIComponent(searchQuery)}&limit=4`);
        const data = await res.json();
        if (data.success && data.data && data.data.items) {
          setSearchResults(data.data.items);
        }
      } catch (err) {
        console.error("Header search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }, [pathname]);

  const matchedCategories = [];
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    categories.forEach((cat) => {
      if (cat.title.toLowerCase().includes(q)) {
        matchedCategories.push({ name: cat.title, slug: cat.slug });
      }
      cat.categories?.forEach((sub) => {
        if (sub.title.toLowerCase().includes(q)) {
          matchedCategories.push({ name: sub.title, slug: sub.slug });
        }
        sub.links?.forEach((third) => {
          if (third.name.toLowerCase().includes(q)) {
            matchedCategories.push({ name: third.name, slug: third.slug });
          }
        });
      });
    });
  }

  const uniqueCategories = [];
  const seenSlugs = new Set();
  matchedCategories.forEach((cat) => {
    if (!seenSlugs.has(cat.slug)) {
      seenSlugs.add(cat.slug);
      uniqueCategories.push(cat);
    }
  });

  const closeTimer = useRef(null);

  const openMenu = (item) => {
    clearTimeout(closeTimer.current);
    setActiveMenu(item);
  };

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
  };



  const displayNavItems = categories;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoggedIn]);

  const darkMode = !isHomePage || isScrolled || logoHovered || isSearchOpen;

  return (
    <>
      <header
        className={`
        fixed top-0 left-0 right-0 z-[9999]
        transition-all duration-500 w-screen
        ${darkMode
            ? "bg-[#C5B9AB] text-[#393938] shadow-sm"
            : "bg-black/10 text-white"
          }
      `}
        onMouseEnter={() => setLogoHovered(true)}
        onMouseLeave={() => setLogoHovered(false)}
      >
        <Container>
          {/* HEADER TOP */}

          <div className="relative flex h-[64px] items-center justify-center lg:h-20">

            {/* MOBILE HAMBURGER */}

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="absolute left-0 text-3xl lg:hidden"
            >
              <HiOutlineMenuAlt3 />
            </button>

            {/* LOGO */}

            <Link href="/" className="absolute left-1/2 -translate-x-1/2 cursor-pointer cursor-pointer">
              {darkMode ? (
                <Image
                  src="/assets/logo/The-Stoneza-Logo.webp"
                  alt="Logo"
                  width={210}
                  height={60}
                  priority
                  className="h-auto w-[150px] lg:w-[210px]"
                />
              ) : (
                <Image
                  src="/assets/logo/The-Stoneza-Logo.webp"
                  alt="Logo"
                  width={210}
                  height={60}
                  priority
                  className="h-auto w-[150px] lg:w-[210px]"
                />
              )}
            </Link>

            {/* SEARCH */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="absolute right-0 top-1/2 -translate-y-1/2 lg:right-10 text-2xl transition-colors cursor-pointer"
              aria-label="Toggle search"
            >
              <CiSearch />
            </button>

          </div>

          {/* Navigation */}
          <div className="hidden justify-center pb-2 lg:flex">
            <div
              className="relative"
              onMouseLeave={closeMenu}
            >
              <nav>
                <ul className="flex items-center gap-11 uppercase text-[12px] font-heading font-medium tracking-widest">
                  {displayNavItems.map((item, index) => (
                    <li
                      key={`${item.title}-${index}`}
                      className="group"
                      onMouseEnter={() =>
                        (item.categories && item.categories.length > 0)
                          ? openMenu(item)
                          : closeMenu()
                      }
                    >
                      <Link
                        href={`/collections/${item.slug}` || "#"}
                        className="relative block"
                      >
                        {item.title}

                        <span
                          className={`
                          absolute left-0 -bottom-1 h-[1px] w-0
                          transition-all duration-300 group-hover:w-full
                          ${darkMode
                              ? "bg-[#1C1B1B]"
                              : "bg-white"
                            }
                        `}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <AnimatePresence>
                {activeMenu && <MegaMenu key={activeMenu.title} item={activeMenu} />}
              </AnimatePresence>
            </div>
          </div>
          {/* MOBILE MENU */}

          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* BACKDROP */}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 z-[9998] bg-black/40 lg:hidden"
                />

                {/* DRAWER */}

                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{
                    duration: 0.35,
                    ease: "easeInOut",
                  }}
                  className="fixed left-0 top-0 z-[9999] h-screen w-[90%] max-w-[380px] overflow-y-auto bg-[#C5B9AB] text-[#393938] shadow-2xl lg:hidden"
                >
                  {/* CLOSE BUTTON */}

                  <div className="flex justify-end p-6">
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-3xl"
                    >
                      <PiXBold />
                    </button>
                  </div>

                  {/* NAVIGATION */}

                  <nav className="px-6 pb-10">
                    {displayNavItems.map((item, index) => (
                      <div
                        key={`${item.title}-${index}`}
                        className="border-b border-[#b3a697]"
                      >
                        {/* MAIN CATEGORY */}

                        <button
                          onClick={() =>
                            setOpenCategory(
                              openCategory === index ? null : index
                            )
                          }
                          className="flex w-full items-center justify-betweet py-5 text-left text-[13px] uppercase tracking-[2px] font-medium"
                        >
                          <span>{item.title}</span>

                          <PiCaretDownThin
                            className={`text-xl transition-transform duration-300 ${openCategory === index
                                ? "rotate-180"
                                : ""
                              }`}
                          />
                        </button>

                        {/* SUBMENU */}

                        <AnimatePresence initial={false}>
                          {openCategory === index && (
                            <motion.div
                              initial={{
                                height: 0,
                                opacity: 0,
                              }}
                              animate={{
                                height: "auto",
                                opacity: 1,
                              }}
                              exit={{
                                height: 0,
                                opacity: 0,
                              }}
                              transition={{
                                duration: 0.25,
                              }}
                              className="overflow-hidden"
                            >
                              <div className="pb-5">
                                {item.categories?.map(
                                  (category, categoryIndex) => (
                                    <div
                                      key={categoryIndex}
                                      className="mb-6"
                                    >
                                      {/* CATEGORY TITLE */}

                                      <h4
                                        className="mb-3 text-[12px] font-semibold uppercase tracking-[2px]"
                                      >
                                        {category.title}
                                      </h4>

                                      {/* LINKS */}

                                      <div className="space-y-2">
                                        {category.links.map(
                                          (link, linkIndex) => {
                                            const linkName = typeof link === "string" ? link : (link.name || link.title);
                                            const linkSlug = typeof link === "string" ? link.toLowerCase().replace(/ /g, "-") : link.slug;
                                            return (
                                              <Link
                                                key={linkIndex}
                                                href={`/collections/${linkSlug}?categoryLevel=3`}
                                                onClick={() =>
                                                  setMobileMenuOpen(false)
                                                }
                                                className="block pl-3 text-[14px] text-[#5e5e5e] transition hover:text-black"
                                              >
                                                {linkName}
                                              </Link>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </Container>

        {/* SEARCH OVERLAY */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full bg-[#F5F3ED] text-[#393938] border-t border-[#cbc9c4] overflow-hidden shadow-lg relative z-[9999]"
            >
              <Container className="py-8">
                {/* Search Bar Input Line */}
                <div className="relative flex items-center justify-between transition-colors duration-300">
                  <div className="flex items-center gap-4 flex-1 lg:h-18 my-auto">
                    <CiSearch className="text-3xl text-[#8A7F73]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type to search products..."
                      className="w-full bg-transparent border-none outline-none text-md md:text-lg font-light tracking-wide placeholder-[#B7AC9E] text-[#1c1714] capitalize"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="text-2xl text-[#8A7F73] hover:text-[#9a4a2e] transition-colors pl-4 cursor-pointer"
                    aria-label="Close search"
                  >
                    <PiXBold />
                  </button>
                </div>

                {/* Live Search Results Scrollable Container */}
                {searchQuery.trim() && (
                  <div className="max-h-[60vh] overflow-y-auto pr-2 mt-8 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 text-left">
                      
                      {/* Products Column */}
                      <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8A7F73]">
                            {loading ? "Searching..." : `${searchResults.length} Products Found`}
                          </span>
                          {searchResults.length > 0 && (
                            <Link
                              href={`/products?search=${encodeURIComponent(searchQuery)}`}
                              className="text-xs uppercase tracking-[0.2em] font-bold text-[#9a4a2e] hover:underline"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              View All
                            </Link>
                          )}
                        </div>

                        {searchResults.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {searchResults.map((product) => {
                              return (
                                <Link
                                  key={product._id}
                                  href={`/products/${product.slug}`}
                                  className="group flex flex-col items-center text-center  p-4"
                                  onClick={() => setIsSearchOpen(false)}
                                >
                                  <ProductCard item={product} setHoveredId={setHoveredId} hoveredId={hoveredId} button={false}/>
                                </Link>
                              );
                            })}
                          </div>
                        ) : (
                          !loading && (
                            <div className="text-sm text-[#8a7f73] py-8">
                              No products found matching "{searchQuery}".
                            </div>
                          )
                        )}
                      </div>

                      {/* Categories Column */}
                      <div className="border-t lg:border-t-0 lg:border-l border-stone-300/80 pt-8 lg:pt-0 lg:pl-8">
                        <span className="block text-xs uppercase tracking-[0.2em] font-semibold text-[#8A7F73] mb-6">
                          Matching Categories
                        </span>
                        {uniqueCategories.length > 0 ? (
                          <ul className="flex flex-wrap gap-2.5 lg:flex-col lg:gap-3">
                            {uniqueCategories.map((cat) => (
                              <li key={cat.slug} className="w-auto lg:w-full">
                                <Link
                                  href={`/collections/${cat.slug}`}
                                  className="text-xs lg:text-sm text-[#1c1714] bg-stone-200/50 hover:bg-[#9a4a2e] hover:text-white transition-all duration-300 block py-1.5 px-4 lg:px-3 lg:py-1 rounded-full lg:rounded-none lg:bg-transparent capitalize font-heading font-medium lg:font-normal"
                                  onClick={() => setIsSearchOpen(false)}
                                >
                                  {cat.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-sm text-[#8a7f73]">
                            No categories match this search.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Container>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEARCH BACKDROP BLUR */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 top-[64px] bg-black/20 lg:top-[106px] z-[9998] pointer-events-auto"
            />
          )}
        </AnimatePresence>
      </header>
    </>
  );
}