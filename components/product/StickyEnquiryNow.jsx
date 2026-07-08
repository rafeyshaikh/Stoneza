"use client";

export default function StickyAddToCart({ product, onEnquireClick }) {
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
          onClick={onEnquireClick}
          className="flex-1 h-[50px] bg-[#665b54] hover:bg-[#544a43] text-white text-xs tracking-[3px] uppercase font-semibold transition-colors duration-300 cursor-pointer"
        >
          Enquire Now
        </button>
      </div>
    </div>
  );
}