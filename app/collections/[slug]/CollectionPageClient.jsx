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

export default function CollectionPageClient({ initialData, slug }) {
  const router = useRouter();

  const [showAllProducts, setShowAllProducts] = useState(
    initialData.category?.categoryLevel === 3
  );
  const [hoveredId, setHoveredId] = useState(null);
  const [gridSizeLarge, setGridSizeLarge] = useState(true);

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
  }));

  const carouselSubCategories = (initialData.subCategories || []).map((sub) => ({
    id: sub.slug,
    title: sub.name,
    image: sub.squareBanner?.url || "/assets/placeholder.jpg",
    href: `/collections/${sub.slug}`,
  }));

  const sliceLength = (!showAllProducts && (categoryLevel === 1 || categoryLevel === 2)) ? 8 : mappedProducts.length;

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
      <div className="sticky top-[63px] lg:top-[106px] h-14 w-full border border-[#cbc9c4] bg-[#eae8e2] z-100 flex justify-between">
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
        <div className="h-full flex">
          <button className="h-full relative w-35 border-l border-[#cbc9c4] uppercase font-heading tracking-[2px] text-[12px] font-medium flex items-center justify-center gap-2">
            Sort
            <PiCaretDown className="text-2md" />
          </button>
          <button className="h-full relative w-35 border-l border-[#cbc9c4] uppercase font-heading tracking-[2px] text-[12px] font-medium">
            Filter
          </button>
        </div>
      </div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridSizeLarge ? "lg:grid-cols-4" : "lg:grid-cols-2"} gap-6 p-10 justify-items-center`}
      >
        {mappedProducts.slice(0, sliceLength).map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            setHoveredId={setHoveredId}
            hoveredId={hoveredId}
            slug={slug}
          />
        ))}
      </div>
      
      {(!showAllProducts && (categoryLevel === 1 || categoryLevel === 2)) && (
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

      {(categoryLevel === 1 || categoryLevel === 2) && (
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


