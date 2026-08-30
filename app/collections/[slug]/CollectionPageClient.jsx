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

export default function CollectionPageClient({ initialData, slug }) {
  const router = useRouter();

  const [showAllProducts, setShowAllProducts] = useState(
    initialData.collection?.collectionLevel === 2
  );
  const [hoveredId, setHoveredId] = useState(null);
  const [gridSizeLarge, setGridSizeLarge] = useState(true);

  // Sort states
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

  const collection = initialData.collection;
  const collectionLevel = collection?.collectionLevel || 1;
  const rawProducts = initialData.products || [];
  
  const mappedProducts = rawProducts.map((prod, idx) => ({
    id: prod._id,
    _id: prod._id,
    name: prod.name,
    price: prod.price || null,
    images: prod.images || (prod.thumbnail ? [prod.thumbnail] : []),
    image: prod.thumbnail?.url || (prod.images?.length ? prod.images[0].url : "") || getPlaceholderImage(prod.name, idx),
    imageHover: prod.hoverImage?.url || (prod.images?.length > 1 ? prod.images[1].url : "") || prod.thumbnail?.url || (prod.images?.length ? prod.images[0].url : "") || getPlaceholderImage(prod.name, idx + 100),
    soldOut: false,
    slug: prod.slug,
    stoneDetails: prod.stoneDetails || {},
    isFeatured: prod.isFeatured || false,
    isBestSeller: prod.isBestSeller || false,
    isNewArrival: prod.isNewArrival || false,
  }));

  const carouselSubCollections = (initialData.subCollections || []).map((sub, idx) => ({
    id: sub.slug,
    title: sub.name,
    image: sub.squareBanner?.url || getPlaceholderImage(sub.name, idx + 200),
    href: `/collections/${sub.slug}`,
  }));

  const genericStoneTypes = ["Marble", "Granite", "Quartzite", "Limestone", "Sandstone", "Slate"];
  const genericFinishes = ["Polished", "Honed", "Leathered", "Natural Split", "Tumbled"];
  const genericApplications = ["Indoor", "Outdoor", "Wall Cladding", "Flooring", "Paving", "Poolside", "Pathway"];
  const genericColors = ["White", "Beige", "Grey", "Black", "Gold", "Brown", "Green", "Blue", "Pink", "Red"];

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

  const sortOptions = [
    { label: "Default", value: "default" },
    { label: "Name: A to Z", value: "name-asc" },
    { label: "Name: Z to A", value: "name-desc" },
  ];

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || "Sort";

  const productMatchesFilter = (product, filterKey, activeOptions) => {
    if (activeOptions.length === 0) return true;
    
    return activeOptions.some((opt) => {
      const optionLower = opt.toLowerCase();
      const name = (product.name || "").toLowerCase();
      const stoneType = (product.stoneDetails?.stoneType || "").toLowerCase();
      const faceTexture = (product.stoneDetails?.faceTexture || "").toLowerCase();
      const applications = (product.stoneDetails?.application || []).map((a) => a.toLowerCase());

      if (filterKey === "stoneTypes") {
        return stoneType.includes(optionLower) || name.includes(optionLower);
      }
      if (filterKey === "finishes") {
        return faceTexture.includes(optionLower) || name.includes(optionLower);
      }
      if (filterKey === "applications") {
        return applications.some((app) => app.includes(optionLower)) || name.includes(optionLower);
      }
      if (filterKey === "colors") {
        return name.includes(optionLower);
      }
      if (filterKey === "badges") {
        if (optionLower === "featured") return product.isFeatured;
        if (optionLower === "best seller") return product.isBestSeller;
        if (optionLower === "new arrival") return product.isNewArrival;
      }
      return false;
    });
  };

  const filteredProducts = mappedProducts.filter((product) => {
    const matchesStones = productMatchesFilter(product, "stoneTypes", activeFilters.stoneTypes);
    const matchesFinishes = productMatchesFilter(product, "finishes", activeFilters.finishes);
    const matchesApps = productMatchesFilter(product, "applications", activeFilters.applications);
    const matchesColors = productMatchesFilter(product, "colors", activeFilters.colors);
    const matchesBadges = productMatchesFilter(product, "badges", activeFilters.badges);

    return matchesStones && matchesFinishes && matchesApps && matchesColors && matchesBadges;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  const sliceLength = showAllProducts ? sortedProducts.length : Math.min(12, sortedProducts.length);
  const wideBannerUrl = collection?.bannerImage?.wide?.[0]?.url || "/assets/hero/All-Products-Banner.png";
  const collectionName = collection?.name || "Collection";

  return (
    <div className="min-h-screen bg-[#eae8e2]">
      {/* Top Banner */}
      <BigBanner
        src={wideBannerUrl}
        title={collectionName}
        alt={collectionName}
        button={null}
        height={800}
      />

      {/* Action Header */}
      <div className="border-y border-[#cbc9c4] px-10 py-5 bg-[#eae8e2] sticky top-0 z-30 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Controls */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2.5 font-heading text-[12px] uppercase tracking-[2px] font-medium transition-colors cursor-pointer ${
                isFilterOpen ? "text-[#9a4a2e]" : "text-[#1c1714] hover:text-[#9a4a2e]"
              }`}
            >
              Filters
              {hasActiveFilters && (
                <span className="flex h-2 w-2 rounded-full bg-[#9a4a2e]" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 font-heading text-[12px] uppercase tracking-[2px] font-medium text-[#1c1714] hover:text-[#9a4a2e] transition-colors cursor-pointer"
              >
                Sort: {currentSortLabel}
                <PiCaretDown className={`transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 top-full mt-3 w-48 rounded-xl border border-[#cbc9c4] bg-[#eae8e2] p-2 shadow-xl z-50"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 font-heading text-[11px] uppercase tracking-[1.5px] rounded-lg transition-colors cursor-pointer ${
                          sortBy === option.value
                            ? "bg-[#9a4a2e] text-white"
                            : "text-[#1c1714] hover:bg-stone-200/50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-6">
            <span className="font-heading text-[11px] uppercase tracking-[2px] text-[#8a7f73]">
              {sortedProducts.length} {sortedProducts.length === 1 ? "Product" : "Products"}
            </span>

            <div className="hidden sm:flex items-center gap-1 border-l border-[#cbc9c4] pl-6">
              <button
                onClick={() => setGridSizeLarge(true)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  gridSizeLarge ? "text-[#9a4a2e]" : "text-[#8a7f73] hover:text-[#1c1714]"
                }`}
                title="4 Column Grid"
              >
                <BiSolidGrid className="text-xl" />
              </button>
              <button
                onClick={() => setGridSizeLarge(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  !gridSizeLarge ? "text-[#9a4a2e]" : "text-[#8a7f73] hover:text-[#1c1714]"
                }`}
                title="2 Column Grid"
              >
                <BiSolidGridAlt className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-[#cbc9c4] bg-[#f4f2ed]"
          >
            <div className="max-w-[1400px] mx-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Stone Types */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[2px] text-[#8A7F73] mb-4">Stone Type</h4>
                <div className="flex flex-wrap gap-2">
                  {genericStoneTypes.map((stone) => {
                    const isActive = activeFilters.stoneTypes.includes(stone);
                    return (
                      <button
                        key={stone}
                        onClick={() => toggleFilter("stoneTypes", stone)}
                        className={`px-3 py-1.5 border border-[#cbc9c4] rounded-full text-[10px] font-heading font-medium uppercase tracking-[1px] cursor-pointer transition-all ${
                          isActive ? "bg-[#9a4a2e] text-white border-[#9a4a2e]" : "bg-white/50 text-[#1a1613] hover:border-black"
                        }`}
                      >
                        {stone}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Finishes */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[2px] text-[#8A7F73] mb-4">Surface Finish</h4>
                <div className="flex flex-wrap gap-2">
                  {genericFinishes.map((finish) => {
                    const isActive = activeFilters.finishes.includes(finish);
                    return (
                      <button
                        key={finish}
                        onClick={() => toggleFilter("finishes", finish)}
                        className={`px-3 py-1.5 border border-[#cbc9c4] rounded-full text-[10px] font-heading font-medium uppercase tracking-[1px] cursor-pointer transition-all ${
                          isActive ? "bg-[#9a4a2e] text-white border-[#9a4a2e]" : "bg-white/50 text-[#1a1613] hover:border-black"
                        }`}
                      >
                        {finish}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Applications */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[2px] text-[#8A7F73] mb-4">Application</h4>
                <div className="flex flex-wrap gap-2">
                  {genericApplications.map((app) => {
                    const isActive = activeFilters.applications.includes(app);
                    return (
                      <button
                        key={app}
                        onClick={() => toggleFilter("applications", app)}
                        className={`px-3 py-1.5 border border-[#cbc9c4] rounded-full text-[10px] font-heading font-medium uppercase tracking-[1px] cursor-pointer transition-all ${
                          isActive ? "bg-[#9a4a2e] text-white border-[#9a4a2e]" : "bg-white/50 text-[#1a1613] hover:border-black"
                        }`}
                      >
                        {app}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Badges */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[2px] text-[#8A7F73] mb-4">Collections</h4>
                <div className="flex flex-wrap gap-2">
                  {["Featured", "Best Seller", "New Arrival"].map((badge) => {
                    const isActive = activeFilters.badges.includes(badge);
                    return (
                      <button
                        key={badge}
                        onClick={() => toggleFilter("badges", badge)}
                        className={`px-3 py-1.5 border border-[#cbc9c4] rounded-full text-[10px] font-heading font-medium uppercase tracking-[1px] cursor-pointer transition-all ${
                          isActive ? "bg-[#9a4a2e] text-white border-[#9a4a2e]" : "bg-white/50 text-[#1a1613] hover:border-black"
                        }`}
                      >
                        {badge}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="border-t border-[#cbc9c4] py-4 px-8 max-w-[1400px] mx-auto flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] uppercase tracking-[2px] font-heading font-bold text-[#9a4a2e] hover:underline cursor-pointer"
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
        <div className="max-w-[1400px] mx-auto p-10 justify-items-center">
          <div className="text-center py-20 text-stone-500">
            No products match the selected filters or sorting options in this collection.
          </div>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridSizeLarge ? "lg:grid-cols-4" : "lg:grid-cols-2"} gap-6 p-10 justify-items-center`}
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
      
      {(!showAllProducts && collectionLevel === 1 && sortedProducts.length > sliceLength) && (
        <div className="flex justify-center items-center">
          <button 
            className="mb-10 rounded-lg border border-[#cbc9c4] bg-[#eae8e2] px-6 py-3 uppercase font-heading tracking-[2px] text-[12px] font-medium cursor-pointer text-center flex justify-center items-center gap-2 hover:scale-[1.02] hover:border-black transition-all" 
            onClick={() => setShowAllProducts(true)}
          >
            View All
            <PiCaretDown className="text-2md" />
          </button>
        </div>
      )}

      {(!showAllProducts && collectionLevel === 1) && (
        <div>
          {carouselSubCollections.length > 0 && (
            <div className="col-span-full">
              <Carousel title="Sub Collections" data={carouselSubCollections} />
            </div>
          )}
          <CategoryCTA
            title={`Specifying the ${collection?.name || "Stoneza"} Series for Your Project?`}
            description="Consult with our stone specialists for custom piece sizing, calibrated thickness runs, and physical sample boxes delivered directly to your design studio."
            buttonText="REQUEST SPECIFICATION & QUOTE"
            buttonLink="/#enquire"
          />
        </div>
      )}
    </div>
  );
}
