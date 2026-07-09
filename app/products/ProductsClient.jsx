"use client";

import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import BigBanner from "@/components/home/BigBanner";
import { PiCaretDown } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";


export default function ProductsClient({ products }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#EAE8E2]">
      <BigBanner
        src={'/assets/hero/collection-banner.webp'}
        title={"All Products"}
        alt={"All Products"}
        button={null}
        height={575}
      />
      <div className="sticky top-[63px] lg:top-[106px] h-14 w-full border border-[#cbc9c4] bg-[#eae8e2] z-100 flex justify-between">
        <div className=" border-l border-r h-full basis-6/10 border-[#cbc9c4] flex items-center justify-center gap-2">
          <div className="flex items-center justify-center border-r border-[#cbc9c4] h-full w-15">
            <CiSearch size={25} className="text-[#1A1613]"/>
          </div>
          <input type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="w-full h-full bg-transparent border-none outline-none focus:border-none text-[#1A1613] placeholder-[#B7AC9E] font-medium text-[12px] tracking-[2px] placeholder:uppercase placeholder:text-[12px] placeholder:tracking-[2px] pl-8"
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
      
        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="max-w-[1400px] mx-auto p-10 justify-items-center">
            <div className="text-center py-20 text-stone-500">
              No products found matching "{searchQuery}".
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-6 p-10 justify-items-center">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                item={product}
                setHoveredId={setHoveredId}
                hoveredId={hoveredId}
              />
            ))}
          </div>
        )}
    </div>
  );
}
