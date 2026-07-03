"use client";

export default function StickyAddToCart({
  product,
  quantity,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e5e0da] p-4 lg:hidden">
      <div className="flex items-center justify-between gap-4">
        {/* Product Info */}
        <div>
          <p className="text-xs text-[#8c857d]">
            {quantity} item{quantity > 1 ? "s" : ""}
          </p>

          <p className="text-lg font-medium text-[#2c2c2c]">
            ₹{product.discountPrice.toLocaleString()}
          </p>
        </div>

        {/* Button */}
        <button
          onClick={() => console.log("Added to cart")}
          className="flex-1 h-[50px] bg-[#665b54] text-white text-xs tracking-[3px] uppercase"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}