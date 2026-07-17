"use client";

import { redirectToWhatsApp } from "@/lib/whatsapp";
import { FaWhatsapp } from "react-icons/fa6";

export default function StickyEnquiryNow({ product, selectedVariants = {} }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e5e0da] p-4 lg:hidden shadow-lg">
      <div className="flex items-center justify-between gap-4">
        {/* Product Info */}
        <div>
          <p className="text-xs text-[#8c857d] uppercase tracking-wider mb-0.5">
            Product Price
          </p>

          <p className="text-lg font-semibold text-[#2c2c2c]">
            {product.price ? (
              `₹${product.price.toLocaleString()}`
            ) : (
              <span className="text-sm font-medium text-stone-500 italic">Price on Request</span>
            )}
          </p>
        </div>

        {/* Button */}
        <button
          onClick={() => redirectToWhatsApp(product, selectedVariants)}
          className="flex-1 h-[50px] bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs tracking-[3px] uppercase transition-all duration-300 rounded shadow-sm cursor-pointer flex items-center justify-center gap-2 font-body"
        >
          <FaWhatsapp size={25} />
          Enquire Now
        </button>
      </div>
    </div>
  );
}