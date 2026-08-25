"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import CategoryCTA from "@/components/common/CategoryCTA";
import BigBanner from "@/components/home/BigBanner";
import Carousel from "@/components/home/Carousel";
import ProductCard from "@/components/product/ProductCard";
import { getPlaceholderImage } from "@/lib/placeholderImage";

import { PiCaretDown } from "react-icons/pi";
import { BiSolidGrid, BiSolidGridAlt } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import SiblingCategoriesCarousel from "@/components/category/SiblingCategoriesCarousel";

export default function CategoryPageClient({ initialData, slug }) {
  const router = useRouter();

  const [showAllProducts, setShowAllProducts] = useState(
    initialData.category?.categoryLevel === 3
  );
  const [hoveredId, setHoveredId] = useState(null);
  const [gridSizeLarge, setGridSizeLarge] = useState(true);

  // Sort states (Price sorting removed)
  const [sortBy, setSortBy] = useState("default");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    stoneTypes: [],
    finishes: [],
    applications: [],
    colors: [],
    badges: [],
  });

  const category = initialData.category;
  const categoryLevel = category?.categoryLevel || 1;
  const parentCategory = initialData.parentCategory || category?.parentCategory;
  const siblingCategories = initialData.siblingCategories || [];
  const parentCategoryName = parentCategory?.name || "Category";
  const rawProducts = initialData.products || [];

  const mappedProducts = rawProducts.map((prod, idx) => ({
    id: prod._id,
    name: prod.name,
    price: prod.price || null,
    image: prod.thumbnail?.url || getPlaceholderImage(prod.name, idx),
    imageHover: prod.hoverImage?.url || prod.thumbnail?.url || getPlaceholderImage(prod.name, idx + 100),
    soldOut: false,
    slug: prod.slug,
    stoneDetails: prod.stoneDetails || {},
    isFeatured: prod.isFeatured || false,
    isBestSeller: prod.isBestSeller || false,
    isNewArrival: prod.isNewArrival || false,
  }));

  const carouselSubCategories = (initialData.subCategories || []).map((sub, idx) => ({
    id: sub.slug,
    title: sub.name,
    image:
      sub.squareBanner?.url ||
      sub.wideBanner?.url ||
      (Array.isArray(sub.wideBanner) ? sub.wideBanner[0]?.url : "") ||
      getPlaceholderImage(sub.name, idx + 200),
    href: `/product-category/${sub.slug}`,
  }));

  // Generic lists of options
  const genericStoneTypes = ["Marble", "Granite", "Quartzite", "Limestone", "Sandstone", "Slate"];
  const genericFinishes = ["Polished", "Honed", "Leathered", "Natural Split", "Tumbled"];
  const genericApplications = ["Indoor", "Outdoor", "Wall Cladding", "Flooring", "Paving", "Poolside", "Pathway"];
  const genericColors = ["White", "Beige", "Grey", "Black", "Gold", "Brown", "Green", "Blue", "Pink", "Red"];

  // Helper toggle filter functions
  const toggleFilter = (key, value) => {
    setActiveFilters((prev) => {
      const current = prev[key];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      stoneTypes: [],
      finishes: [],
      applications: [],
      colors: [],
      badges: [],
    });
  };

  const hasActiveFilters =
    activeFilters.stoneTypes.length > 0 ||
    activeFilters.finishes.length > 0 ||
    activeFilters.applications.length > 0 ||
    activeFilters.colors.length > 0 ||
    activeFilters.badges.length > 0;

  // Sorting Options Configuration (Price sorting removed)
  const sortOptions = [
    { label: "Default", value: "default" },
    { label: "Name: A to Z", value: "name-asc" },
    { label: "Name: Z to A", value: "name-desc" },
  ];

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || "Sort";

  // Robust tag-matching helper checks product schema attributes, product tags, and names
  const productMatchesFilter = (product, filterKey, activeOptions) => {
    if (activeOptions.length === 0) return true;

    return activeOptions.some((opt) => {
      const optionLower = opt.toLowerCase();

      const name = (product.name || "").toLowerCase();
      const tags = (product.tags || []).map((t) => t.toLowerCase());
      const stoneType = (product.stoneDetails?.stoneType || "").toLowerCase();
      const faceTexture = (product.stoneDetails?.faceTexture || "").toLowerCase();
      const applications = (product.stoneDetails?.application || []).map((a) => a.toLowerCase());
      const categoryName = (product.category?.name || "").toLowerCase();

      if (filterKey === "stoneTypes") {
        return (
          stoneType.includes(optionLower) ||
          name.includes(optionLower) ||
          tags.includes(optionLower) ||
          categoryName.includes(optionLower)
        );
      }

      if (filterKey === "finishes") {
        return (
          faceTexture.includes(optionLower) ||
          name.includes(optionLower) ||
          tags.includes(optionLower)
        );
      }

      if (filterKey === "applications") {
        return (
          applications.some((app) => app.includes(optionLower)) ||
          tags.includes(optionLower) ||
          name.includes(optionLower)
        );
      }

      if (filterKey === "colors") {
        return (
          name.includes(optionLower) ||
          tags.includes(optionLower) ||
          stoneType.includes(optionLower)
        );
      }

      return false;
    });
  };

  // Filter application
  const filteredProducts = mappedProducts.filter((product) => {
    // 1. Stone Type Filter (Matched via custom helper)
    if (!productMatchesFilter(product, "stoneTypes", activeFilters.stoneTypes)) {
      return false;
    }

    // 2. Finish / Texture Filter (Matched via custom helper)
    if (!productMatchesFilter(product, "finishes", activeFilters.finishes)) {
      return false;
    }

    // 3. Applications Filter (Matched via custom helper)
    if (!productMatchesFilter(product, "applications", activeFilters.applications)) {
      return false;
    }

    // 4. Colors Filter (Matched via custom helper)
    if (!productMatchesFilter(product, "colors", activeFilters.colors)) {
      return false;
    }

    // 5. Badges Filter (Featured, Best Seller, New Arrival)
    if (activeFilters.badges.length > 0) {
      const matchFeatured = activeFilters.badges.includes("Featured") && product.isFeatured;
      const matchBestSeller = activeFilters.badges.includes("Best Seller") && product.isBestSeller;
      const matchNewArrival = activeFilters.badges.includes("New Arrival") && product.isNewArrival;

      if (!matchFeatured && !matchBestSeller && !matchNewArrival) {
        return false;
      }
    }

    return true;
  });

  // Sorting application
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name-asc") {
      return (a.name || "").localeCompare(b.name || "");
    }
    if (sortBy === "name-desc") {
      return (b.name || "").localeCompare(a.name || "");
    }
    return 0;
  });

  const sliceLength = (!showAllProducts && (categoryLevel === 1 || categoryLevel === 2)) ? 8 : sortedProducts.length;

  const topBannerUrl =
    category?.bannerImage?.wide?.url ||
    (Array.isArray(category?.bannerImage?.wide) ? category?.bannerImage?.wide?.[0]?.url : "") ||
    category?.bannerImage?.square?.url ||
    "/assets/hero/collection-banner.webp";
  const wideBannerUrl =
    category?.bannerImage?.wide?.url ||
    (Array.isArray(category?.bannerImage?.wide) ? (category?.bannerImage?.wide?.[1]?.url || category?.bannerImage?.wide?.[0]?.url) : "") ||
    category?.bannerImage?.square?.url ||
    "/assets/hero/Big_Banner_Ethereal_Forms.jpg";
  const categoryName = category?.name || slug;

  return (
    <div className="w-full">
      {categoryLevel === 1 || categoryLevel === 2 ? (
        <div className="relative">
          <BigBanner
            src={topBannerUrl}
            alt={categoryName}
            button={null}
            height={575}
          />
          <div className="absolute top-0 w-full inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent z-10 h-full flex flex-col justify-center gap-2 sm:gap-4 md:gap-6 items-start px-5 sm:px-8 md:px-12 lg:px-16">
            {/* Breadcrumb Navigation (F-11) */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11px] font-heading font-semibold uppercase tracking-[0.16em] text-[#C8A980]">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="text-white/40">/</span>
              {parentCategory && (
                <>
                  <Link href={`/product-category/${parentCategory.slug}`} className="hover:text-white transition-colors">
                    {parentCategory.name}
                  </Link>
                  <span className="text-white/40">/</span>
                </>
              )}
              <span className="text-white">{categoryName}</span>
            </nav>

            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-wide">
              {categoryName}
            </h1>
            {category?.description && (
              <p className="text-white/90 font-body w-full sm:w-[80%] md:w-[65%] lg:w-[45%] text-xs sm:text-sm md:text-base lg:text-lg line-clamp-3 sm:line-clamp-4 md:line-clamp-none">
                {category.description}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <BigBanner
            src={topBannerUrl}
            alt={categoryName}
            button={null}
            height={575}
          />
          <div className="absolute top-0 inset-0 z-10 flex items-center px-4 sm:px-8 md:px-12 lg:px-24">
            <div className="bg-linear-to-br from-white/40 via-white/95 to-white/50 backdrop-blur-sm w-full sm:w-[85%] md:w-[70%] lg:w-[45%] max-w-[540px] p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col gap-2 sm:gap-4 lg:gap-6 shadow-md">
              {/* Breadcrumb Navigation (F-11) */}
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-heading font-semibold uppercase tracking-[0.14em] text-[#9A4A2E]">
                <Link href="/" className="hover:underline">Home</Link>
                <span className="text-[#78716C]">/</span>
                {parentCategory && (
                  <>
                    <Link href={`/product-category/${parentCategory.slug}`} className="hover:underline">
                      {parentCategory.name}
                    </Link>
                    <span className="text-[#78716C]">/</span>
                  </>
                )}
                <span className="text-[#1A1613] font-bold">{categoryName}</span>
              </nav>

              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading capitalize font-semibold tracking-wide text-[#1A1613]">
                {categoryName}
              </h1>
              {category?.description && (
                <p className="text-xs sm:text-sm lg:text-base text-[#4A453F] line-clamp-3 sm:line-clamp-4 md:line-clamp-6 lg:line-clamp-none">
                  {category.description}
                </p>
              )}
              <div className="flex items-center gap-2 sm:gap-3 pt-1">
                <Link
                  href="#products-grid"
                  className="flex-1 h-9 sm:h-11 lg:h-12 bg-black text-white flex justify-center items-center cursor-pointer hover:bg-stone-800 transition-all text-[10px] sm:text-xs lg:text-sm font-medium tracking-wider uppercase text-center px-2"
                >
                  Browse All {initialData.products?.length || 0} Varieties
                </Link>
                <Link
                  href="/pages/contact"
                  className="flex-1 h-9 sm:h-11 lg:h-12 bg-white text-black border border-black flex justify-center items-center cursor-pointer hover:bg-black/5 transition-all text-[10px] sm:text-xs lg:text-sm font-medium tracking-wider uppercase text-center px-2"
                >
                  Talk to Expert
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Settings & Filter Bar */}
      <div className="sticky top-[62px] lg:top-[127px] h-12 sm:h-14 w-full border-y border-[#cbc9c4] bg-[#eae8e2] z-30 flex justify-between relative">
        {/* Grid Sizer buttons */}
        <div className="border-r h-full w-20 sm:w-28 md:w-36 border-[#cbc9c4] flex items-center justify-center gap-2">
          <BiSolidGridAlt
            className={`${gridSizeLarge ? "opacity-50 text-[20px] sm:text-[24px]" : "opacity-100 text-[22px] sm:text-[26px]"} cursor-pointer hover:opacity-100 transition-opacity`}
            onClick={() => setGridSizeLarge(false)}
            aria-label="Two column grid"
          />
          <BiSolidGrid
            className={`${gridSizeLarge ? "opacity-100 text-[22px] sm:text-[26px]" : "opacity-50 text-[20px] sm:text-[24px]"} cursor-pointer hover:opacity-100 transition-opacity`}
            onClick={() => setGridSizeLarge(true)}
            aria-label="Four column grid"
          />
        </div>

        {/* Sort & Filter Panel Actions */}
        <div className="h-full flex relative">
          <button
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsFilterOpen(false);
            }}
            className="h-full relative px-3 sm:px-5 md:px-7 border-l border-[#cbc9c4] uppercase font-heading tracking-[1px] sm:tracking-[2px] text-[10px] sm:text-[11px] md:text-[12px] font-medium flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer hover:bg-black/5 transition-colors"
          >
            <span className="truncate max-w-[90px] sm:max-w-none">{currentSortLabel}</span>
            <PiCaretDown className={`text-xs sm:text-sm shrink-0 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
          </button>

          <button
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
              setIsSortOpen(false);
            }}
            className={`h-full relative px-3 sm:px-5 md:px-7 border-l border-[#cbc9c4] uppercase font-heading tracking-[1px] sm:tracking-[2px] text-[10px] sm:text-[11px] md:text-[12px] font-medium cursor-pointer transition-colors ${
              isFilterOpen || hasActiveFilters
                ? "bg-[#9a4a2e] text-white hover:bg-[#853e25]"
                : "hover:bg-black/5 text-[#1A1613]"
            }`}
          >
            Filter {hasActiveFilters ? `(${activeFilters.stoneTypes.length + activeFilters.finishes.length + activeFilters.applications.length + activeFilters.colors.length + activeFilters.badges.length})` : ""}
          </button>

          {/* Sort Dropdown Panel */}
          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 sm:right-28 md:right-36 top-[48px] sm:top-[56px] w-48 sm:w-52 bg-[#eae8e2] border border-[#cbc9c4] shadow-lg flex flex-col z-50 rounded-b-lg overflow-hidden"
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setIsSortOpen(false);
                    }}
                    className={`px-4 sm:px-5 py-3 sm:py-3.5 text-left text-[10px] sm:text-[11px] uppercase tracking-[1px] sm:tracking-[2px] font-heading font-medium border-b border-[#cbc9c4]/30 last:border-b-0 cursor-pointer transition-colors ${
                      sortBy === opt.value
                        ? "bg-[#C5B9AB] text-[#1A1613] font-bold"
                        : "hover:bg-[#C5B9AB]/30 text-[#1a1613]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Filter Side / Sliding Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full border-b border-[#cbc9c4] bg-[#eae8e2] overflow-hidden z-30"
          >
            <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {/* Colors Filter */}
              <div>
                <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[1.5px] sm:tracking-[2px] text-[#8A7F73] mb-3 sm:mb-4">
                  Color
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {genericColors.map((color) => {
                    const isActive = activeFilters.colors.includes(color);
                    return (
                      <button
                        key={color}
                        onClick={() => toggleFilter("colors", color)}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border border-[#cbc9c4] rounded-full text-[9px] sm:text-[10px] font-heading font-medium uppercase tracking-[1px] cursor-pointer transition-all ${
                          isActive
                            ? "bg-[#9a4a2e] text-white border-[#9a4a2e]"
                            : "bg-white/50 text-[#1a1613] hover:border-black"
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stone Types Filter */}
              <div>
                <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[1.5px] sm:tracking-[2px] text-[#8A7F73] mb-3 sm:mb-4">
                  Stone Type
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {genericStoneTypes.map((type) => {
                    const isActive = activeFilters.stoneTypes.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => toggleFilter("stoneTypes", type)}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border border-[#cbc9c4] rounded-full text-[9px] sm:text-[10px] font-heading font-medium uppercase tracking-[1px] cursor-pointer transition-all ${
                          isActive
                            ? "bg-[#9a4a2e] text-white border-[#9a4a2e]"
                            : "bg-white/50 text-[#1a1613] hover:border-black"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Finishes Filter */}
              <div>
                <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[1.5px] sm:tracking-[2px] text-[#8A7F73] mb-3 sm:mb-4">
                  Finish / Texture
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {genericFinishes.map((finish) => {
                    const isActive = activeFilters.finishes.includes(finish);
                    return (
                      <button
                        key={finish}
                        onClick={() => toggleFilter("finishes", finish)}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border border-[#cbc9c4] rounded-full text-[9px] sm:text-[10px] font-heading font-medium uppercase tracking-[1px] cursor-pointer transition-all ${
                          isActive
                            ? "bg-[#9a4a2e] text-white border-[#9a4a2e]"
                            : "bg-white/50 text-[#1a1613] hover:border-black"
                        }`}
                      >
                        {finish}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Applications Filter */}
              <div>
                <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[1.5px] sm:tracking-[2px] text-[#8A7F73] mb-3 sm:mb-4">
                  Applications
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {genericApplications.map((app) => {
                    const isActive = activeFilters.applications.includes(app);
                    return (
                      <button
                        key={app}
                        onClick={() => toggleFilter("applications", app)}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border border-[#cbc9c4] rounded-full text-[9px] sm:text-[10px] font-heading font-medium uppercase tracking-[1px] cursor-pointer transition-all ${
                          isActive
                            ? "bg-[#9a4a2e] text-white border-[#9a4a2e]"
                            : "bg-white/50 text-[#1a1613] hover:border-black"
                        }`}
                      >
                        {app}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Badges / Collections */}
              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[1.5px] sm:tracking-[2px] text-[#8A7F73] mb-3 sm:mb-4">
                  Categories
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {["Featured", "Best Seller", "New Arrival"].map((badge) => {
                    const isActive = activeFilters.badges.includes(badge);
                    return (
                      <button
                        key={badge}
                        onClick={() => toggleFilter("badges", badge)}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border border-[#cbc9c4] rounded-full text-[9px] sm:text-[10px] font-heading font-medium uppercase tracking-[1px] cursor-pointer transition-all ${
                          isActive
                            ? "bg-[#9a4a2e] text-white border-[#9a4a2e]"
                            : "bg-white/50 text-[#1a1613] hover:border-black"
                        }`}
                      >
                        {badge}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Clear All Filters Button Bar */}
            {hasActiveFilters && (
              <div className="border-t border-[#cbc9c4] py-3 sm:py-4 px-4 sm:px-8 max-w-[1400px] mx-auto flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] sm:text-[11px] uppercase tracking-[1.5px] sm:tracking-[2px] font-heading font-bold text-[#9a4a2e] hover:underline cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid rendering */}
      {sortedProducts.length === 0 ? (
        <div className="max-w-[1400px] mx-auto p-6 sm:p-10 justify-items-center">
          <div className="text-center py-12 sm:py-20 text-stone-500 text-sm sm:text-base">
            No products match the selected filters or sorting options in this category.
          </div>
        </div>
      ) : (
        <div
          id="products-grid"
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
            gridSizeLarge ? "lg:grid-cols-4" : "lg:grid-cols-2"
          } gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 lg:p-10 justify-items-center`}
        >
          {sortedProducts.slice(0, sliceLength).map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              setHoveredId={setHoveredId}
              hoveredId={hoveredId}
              slug={slug}
            />
          ))}
        </div>
      )}

      {!showAllProducts &&
        (categoryLevel === 1 || categoryLevel === 2) &&
        sortedProducts.length > sliceLength && (
          <div className="flex justify-center items-center py-6 sm:py-10">
            <button
              className="rounded-lg border border-[#cbc9c4] bg-[#eae8e2] px-6 py-3 uppercase font-heading tracking-[2px] text-[11px] sm:text-[12px] font-medium cursor-pointer text-center flex justify-center items-center gap-2 hover:scale-[1.02] hover:border-black transition-all"
              onClick={() => setShowAllProducts(true)}
            >
              View All
              <PiCaretDown className="text-base" />
            </button>
          </div>
        )}

      {!showAllProducts && (categoryLevel === 1 || categoryLevel === 2) && (
        <div>
          {carouselSubCategories.length > 0 && (
            <div className="col-span-full py-4 sm:py-6">
              <Carousel title="Sub Categories" data={carouselSubCategories} />
            </div>
          )}
        </div>
      )}

      {categoryLevel === 3 && siblingCategories.length > 0 && (
        <SiblingCategoriesCarousel
          parentCategoryName={parentCategoryName}
          siblingCategories={siblingCategories}
        />
      )}

      <CategoryCTA
        title={`Specifying ${category?.name || "Natural Stone"} for Your Project?`}
        description="Share your elevation drawings, BOQ, or paving schedules. Our stone specification team calculates quarry-direct pricing, custom edge profiles, and sample delivery."
        buttonText="REQUEST SPECIFICATION & QUOTE"
        buttonLink="/#enquire"
      />
    </div>
  );
}
