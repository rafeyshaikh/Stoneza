"use client";

import { redirectToWhatsApp } from "@/lib/whatsapp";
import { FaWhatsapp } from "react-icons/fa6";
import { ChevronDown } from "lucide-react";

export default function ProductInfo({
  product,
  selectedVariants = {},
  setSelectedVariants,
  onEnquireClick,
}) {
  return (
    <div className="max-w-[550px]">
      {/* Badge */}
      {product.badges?.length > 0 && (
        <span className="inline-block bg-[#9a4a2e] text-white text-[11px] tracking-[0.1em] uppercase font-bold px-3 py-1 rounded-full mb-4">
          {product.badges?.join(", ")}
        </span>
      )}
      {/* Product Title */}
      <h1 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl text-[#1c1714] leading-[1.02] tracking-tight mb-2 capitalize">
        {product.name}
      </h1>

      {/* Subtitle */}
      <div className="font-serif italic text-lg md:text-xl text-[#3a322c] mb-6">
        {product.stoneDetails?.stoneType || "Premium Natural Stone"}
      </div>

      {/* Price if available */}
      {product.price ? (
        <div className="mb-4">
          <span className="text-3xl font-medium text-[#1c1714]">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-xs text-[#3a322c] ml-2 italic">Guide Price</span>
        </div>
      ) : (
        ''
      )}

      {/* Quote / GST disclaimer */}
      <div className="mb-6">
        <div className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-[#9a4a2e] mb-1">
          ENQUIRE NOW TO REQUEST A QUOTE
        </div>
        <div className="text-[11.5px] text-[#3a322c]/80 italic">
          *Ex-Factory Price, Transportation & GST will be charged extra, as applicable.
        </div>
      </div>


      {/* Customizations / Variants Dropdowns */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-4 mb-6">
          {product.variants.map((variant) => (
            <div key={variant._id || variant.name} className="flex flex-col gap-1.5">
              <span className="font-sans text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#9a4a2e]">
                {variant.name}
              </span>
              <div className="relative">
                <select
                  value={selectedVariants[variant.name] || ""}
                  onChange={(e) =>
                    setSelectedVariants((prev) => ({
                      ...prev,
                      [variant.name]: e.target.value,
                    }))
                  }
                  className="w-full h-12 pl-4 pr-10 bg-white border border-stone-300 rounded text-sm text-[#1c1714] outline-none transition-colors focus:border-[#c8a980] appearance-none cursor-pointer font-sans"
                >
                  {variant.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-500">
                  <ChevronDown className="size-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap mb-6">
        <button
          onClick={() => redirectToWhatsApp(product, selectedVariants)}
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
            {(Array.isArray(product.stoneDetails?.application) ? product.stoneDetails.application.join(", ") : product.stoneDetails?.application) || "Façades & feature walls"}
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