"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";
import { PiXBold } from "react-icons/pi";

import Container from "./Container";
import ProductCard from "../product/ProductCard";

export default function HeaderSearchOverlay({
  isOpen,
  onClose,
  categories = [],
}) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  // Debounced live search API fetch
  useEffect(() => {
    let active = true;

    if (!searchQuery.trim()) {
      const timer = setTimeout(() => {
        if (active) {
          setSearchResults([]);
          setLoading(false);
        }
      }, 0);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }

    const delayDebounce = setTimeout(async () => {
      try {
        if (active) setLoading(true);
        const res = await fetch(
          `/api/public/products?search=${encodeURIComponent(searchQuery)}&limit=4`
        );
        const data = await res.json();
        if (active && data.success && data.data && data.data.items) {
          setSearchResults(data.data.items);
        }
      } catch (err) {
        console.error("Header search error:", err);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(delayDebounce);
    };
  }, [searchQuery]);

  // Auto-close search overlay on navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) {
        onClose();
        setSearchQuery("");
        setSearchResults([]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Filter matching categories based on query
  const matchedCategories = [];
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    categories.forEach((cat) => {
      if (cat.title?.toLowerCase().includes(q) || cat.name?.toLowerCase().includes(q)) {
        matchedCategories.push({ name: cat.title || cat.name, slug: cat.slug });
      }
      cat.categories?.forEach((sub) => {
        if (sub.title?.toLowerCase().includes(q) || sub.name?.toLowerCase().includes(q)) {
          matchedCategories.push({ name: sub.title || sub.name, slug: sub.slug });
        }
        sub.links?.forEach((third) => {
          if (third.name?.toLowerCase().includes(q)) {
            matchedCategories.push({ name: third.name, slug: third.slug });
          }
        });
      });
    });
  }

  const uniqueCategories = [];
  const seenSlugs = new Set();
  matchedCategories.forEach((cat) => {
    if (cat.slug && !seenSlugs.has(cat.slug)) {
      seenSlugs.add(cat.slug);
      uniqueCategories.push(cat);
    }
  });

  const handleClose = () => {
    onClose();
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <>
      {/* SEARCH OVERLAY PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 w-full bg-[#F5F3ED] text-[#393938] border-t border-[#cbc9c4] overflow-hidden shadow-lg z-[9999]"
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
                  type="button"
                  onClick={handleClose}
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
                          {loading
                            ? "Searching..."
                            : `${searchResults.length} Products Found`}
                        </span>
                        {searchResults.length > 0 && (
                          <Link
                            href={`/products?search=${encodeURIComponent(searchQuery)}`}
                            className="text-xs uppercase tracking-[0.2em] font-bold text-[#9a4a2e] hover:underline"
                            onClick={handleClose}
                          >
                            View All
                          </Link>
                        )}
                      </div>

                      {searchResults.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {searchResults.map((product) => (
                            <Link
                              key={product._id}
                              href={`/products/${product.slug}`}
                              className="group flex flex-col items-center text-center p-4"
                              onClick={handleClose}
                            >
                              <ProductCard
                                item={product}
                                setHoveredId={setHoveredId}
                                hoveredId={hoveredId}
                                button={false}
                              />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        !loading && (
                          <div className="text-sm text-[#8a7f73] py-8">
                            No products found matching &quot;{searchQuery}&quot;.
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
                                href={`/categories/${cat.slug}`}
                                className="text-xs lg:text-sm text-[#1c1714] bg-stone-200/50 hover:bg-[#9a4a2e] hover:text-white transition-all duration-300 block py-1.5 px-4 lg:px-3 lg:py-1 rounded-full lg:rounded-none lg:bg-transparent capitalize font-heading font-medium lg:font-normal"
                                onClick={handleClose}
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
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="absolute top-full left-0 right-0 h-screen bg-black/30 z-[9998] pointer-events-auto"
          />
        )}
      </AnimatePresence>
    </>
  );
}
