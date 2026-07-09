"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import CollectionCTA from "@/components/common/CollectionCTA";
import BigBanner from "@/components/home/BigBanner";
import Carousel from "@/components/home/Carousel";
import ProductCard from "@/components/product/ProductCard";

import { PiCaretDown } from "react-icons/pi";
import { BiSolidGrid, BiSolidGridAlt } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";

export default function CollectionPageClient({ initialData, slug }) {
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
  const rawProducts = initialData.products || [];
  
  const mappedProducts = rawProducts.map((prod) => ({
    id: prod._id,
    name: prod.name,
    price: prod.price || null,
    image: prod.thumbnail?.url || "/assets/placeholder.jpg",
    imageHover: prod.hoverImage?.url || prod.thumbnail?.url || "/assets/placeholder.jpg",
    soldOut: false,
    slug: prod.slug,
    stoneDetails: prod.stoneDetails || {},
    isFeatured: prod.isFeatured || false,
    isBestSeller: prod.isBestSeller || false,
    isNewArrival: prod.isNewArrival || false,
  }));

  const carouselSubCategories = (initialData.subCategories || []).map((sub) => ({
    id: sub.slug,
    title: sub.name,
    image: sub.squareBanner?.url || "/assets/placeholder.jpg",
    href: `/collections/${sub.slug}`,
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

  const topBannerUrl = category?.bannerImage?.wide?.[0]?.url || "/assets/hero/collection-banner.webp";
  const wideBannerUrl = category?.bannerImage?.wide?.[1]?.url || category?.bannerImage?.wide?.[0]?.url || "/assets/hero/Big_Banner_Ethereal_Forms.jpg";
  const categoryName = category?.name || slug;

  return (
    <div className="w-full">
      <BigBanner
        src={topBannerUrl}
        title={categoryName}
        alt={categoryName}
        button={null}
        height={575}
      />

      {/* Grid Settings & Filter Bar */}
      <div className="sticky top-[63px] lg:top-[106px] h-14 w-full border border-[#cbc9c4] bg-[#eae8e2] z-40 flex justify-between relative">
        
        {/* Grid Sizer buttons */}
        <div className="border-r h-full w-35 border-[#cbc9c4] flex items-center justify-center gap-2">
          <BiSolidGridAlt
            className={` ${gridSizeLarge ? "opacity-50 text-[25px]" : "opacity-100 text-[26px]"} cursor-pointer`}
            onClick={() => setGridSizeLarge(false)}
          />
          <BiSolidGrid
            className={` ${gridSizeLarge ? "opacity-100 text-[26px]" : "opacity-50 text-[25px]"} cursor-pointer`}
            onClick={() => setGridSizeLarge(true)}
          />
        </div>

        {/* Sort & Filter Panel Actions */}
        <div className="h-full flex relative">
          <button
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsFilterOpen(false);
            }}
            className="h-full relative w-40 border-l border-[#cbc9c4] uppercase font-heading tracking-[2px] text-[12px] font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-black/5"
          >
            {currentSortLabel}
            <PiCaretDown className={`text-sm transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
          </button>
          
          <button
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
              setIsSortOpen(false);
            }}
            className={`h-full relative w-35 border-l border-[#cbc9c4] uppercase font-heading tracking-[2px] text-[12px] font-medium cursor-pointer transition-colors ${
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
                className="absolute right-36 top-[57px] w-52 bg-[#eae8e2] border border-[#cbc9c4] shadow-lg flex flex-col z-50 rounded-b-lg overflow-hidden"
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setIsSortOpen(false);
                    }}
                    className={`px-5 py-3.5 text-left text-[11px] uppercase tracking-[2px] font-heading font-medium border-b border-[#cbc9c4]/30 last:border-b-0 cursor-pointer transition-colors ${
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
            <div className="max-w-[1400px] mx-auto p-8 grid grid-cols-2 md:grid-cols-5 gap-8">
              
              {/* Colors Filter */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[2px] text-[#8A7F73] mb-4">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {genericColors.map((color) => {
                    const isActive = activeFilters.colors.includes(color);
                    return (
                      <button
                        key={color}
                        onClick={() => toggleFilter("colors", color)}
                        className={`px-3 py-1.5 border border-[#cbc9c4] rounded-full text-[10px] font-heading font-medium uppercase tracking-[1px] cursor-pointer transition-all ${
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
                <h4 className="text-[11px] font-bold uppercase tracking-[2px] text-[#8A7F73] mb-4">Stone Type</h4>
                <div className="flex flex-wrap gap-2">
                  {genericStoneTypes.map((type) => {
                    const isActive = activeFilters.stoneTypes.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => toggleFilter("stoneTypes", type)}
                        className={`px-3 py-1.5 border border-[#cbc9c4] rounded-full text-[10px] font-heading font-medium uppercase tracking-[1px] cursor-pointer transition-all ${
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
                <h4 className="text-[11px] font-bold uppercase tracking-[2px] text-[#8A7F73] mb-4">Finish / Texture</h4>
                <div className="flex flex-wrap gap-2">
                  {genericFinishes.map((finish) => {
                    const isActive = activeFilters.finishes.includes(finish);
                    return (
                      <button
                        key={finish}
                        onClick={() => toggleFilter("finishes", finish)}
                        className={`px-3 py-1.5 border border-[#cbc9c4] rounded-full text-[10px] font-heading font-medium uppercase tracking-[1px] cursor-pointer transition-all ${
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
                <h4 className="text-[11px] font-bold uppercase tracking-[2px] text-[#8A7F73] mb-4">Applications</h4>
                <div className="flex flex-wrap gap-2">
                  {genericApplications.map((app) => {
                    const isActive = activeFilters.applications.includes(app);
                    return (
                      <button
                        key={app}
                        onClick={() => toggleFilter("applications", app)}
                        className={`px-3 py-1.5 border border-[#cbc9c4] rounded-full text-[10px] font-heading font-medium uppercase tracking-[1px] cursor-pointer transition-all ${
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
      
      {(!showAllProducts && (categoryLevel === 1 || categoryLevel === 2) && sortedProducts.length > sliceLength) && (
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

      {(!showAllProducts && (categoryLevel === 1 || categoryLevel === 2)) && (
        <div>
          {carouselSubCategories.length > 0 && (
            <div className="col-span-full">
              <Carousel title="Sub Categories" data={carouselSubCategories} />
            </div>
          )}
          <BigBanner
            src={wideBannerUrl}
            title={categoryName}
            alt={categoryName}
            button={null}
            height={800}
          />
          <CollectionCTA
            title="Ready to Elevate Your Living Space?"
            description="Discover premium stone surfaces, handcrafted décor, and timeless designs curated to bring elegance into every home."
            buttonText="EXPLORE COLLECTION"
            buttonLink="/collections"
          />
        </div>
      )}
    </div>
  );
}
