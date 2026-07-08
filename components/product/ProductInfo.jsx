"use client";

import { redirectToWhatsApp } from "@/lib/whatsapp";
import { FaWhatsapp } from "react-icons/fa6";

export default function ProductInfo({ product, onEnquireClick }) {
  return (
    <div className="max-w-[550px]">
      {/* Badge */}
      <span className="inline-block bg-[#9a4a2e] text-white text-[11px] tracking-[0.1em] uppercase font-bold px-3 py-1 rounded-full mb-4">
        {product.badges?.join(", ") || "New Arrival"}
      </span>

      {/* Product Title */}
      <h1 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl text-[#1c1714] leading-[1.02] tracking-tight mb-2">
        {product.name}
      </h1>

      {/* Subtitle */}
      <div className="font-serif italic text-lg md:text-xl text-[#3a322c] mb-6">
        {product.stoneDetails?.stoneType || "Premium Natural Stone"}
      </div>

      {/* Price if available */}
      {product.price ? (
        <div className="mb-6">
          <span className="text-3xl font-medium text-[#1c1714]">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-xs text-[#3a322c] ml-2 italic">Guide Price</span>
        </div>
      ) : (
        <div className="mb-6">
          <span className="text-xl font-medium text-stone-500 italic">
            Price on Request
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-[15.5px] text-[#3a322c] leading-relaxed mb-6 max-w-prose">
        {product.shortDescription}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap mb-6">
        <button
          onClick={() => redirectToWhatsApp(product)}
          className="flex-1 min-w-[200px] h-[54px] bg-[#1c1714] hover:bg-[#25D366] text-[#f4efe7] hover:text-white text-sm tracking-[3px] uppercase transition-all duration-300 rounded shadow-sm cursor-pointer flex items-center justify-center gap-2 font-body"
        >
          <FaWhatsapp size={25} />
          Enquiry Now
        </button>
      </div>

      {/* Quick Specs Grid */}
      <div className="grid grid-cols-2 gap-px bg-stone-300/40 border border-stone-300/40 rounded-lg overflow-hidden mb-6">
        <div className="bg-stone-50 p-4">
          <span className="text-[10px] uppercase tracking-wider text-[#9a4a2e] font-bold block">Format</span>
          <span className="font-serif text-base text-[#1c1714] mt-1 block">
            {product.stoneDetails?.productForm || "Crated panels"}
          </span>
        </div>
        <div className="bg-stone-50 p-4">
          <span className="text-[10px] uppercase tracking-wider text-[#9a4a2e] font-bold block">Calibrated thickness</span>
          <span className="font-serif text-base text-[#1c1714] mt-1 block">
            {product.stoneDetails?.calibratedThickness || "N/A"}
          </span>
        </div>
        <div className="bg-stone-50 p-4">
          <span className="text-[10px] uppercase tracking-wider text-[#9a4a2e] font-bold block">Best for</span>
          <span className="font-serif text-base text-[#1c1714] mt-1 block">
            {product.stoneDetails?.application || "Façades & feature walls"}
          </span>
        </div>
        <div className="bg-stone-50 p-4">
          <span className="text-[10px] uppercase tracking-wider text-[#9a4a2e] font-bold block">Corners</span>
          <span className="font-serif text-base text-[#1c1714] mt-1 block">
            {product.stoneDetails?.cornerPieces || "N/A"}
          </span>
        </div>
      </div>

      

      {/* Micro Benefits */}
      <div className="flex gap-x-6 gap-y-2 flex-wrap text-xs text-[#3a322c] mb-6">
        <span><b>Quarry-direct</b> · no middlemen</span>
        <span><b>Pan-India</b> insured delivery</span>
        <span><b>Custom</b> sizes & finishes</span>
      </div>
    </div>
  );
}