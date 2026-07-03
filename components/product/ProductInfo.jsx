"use client";

import { useState } from "react";

import QuantitySelector from "./QuantitySelector";

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="max-w-[550px]">
      <p className="text-sm text-[#6f6f6f] mb-3">
        SKU: {product.sku}
      </p>

      <h1 className="font-display text-5xl text-[#2c2c2c] leading-tight mb-6">
        {product.name}
      </h1>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl font-medium">
          ₹{product.discountPrice.toLocaleString()}
        </span>

        <span className="text-[#999] line-through">
          ₹{product.price.toLocaleString()}
        </span>
      </div>

      <p className="text-[#6f6f6f] leading-8 mb-8">
        {product.shortDescription}
      </p>

      <div className="mb-8">
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>

      <div className="space-y-4">
        <button className="w-full h-14 bg-[#665b54] text-white tracking-[3px] text-sm">
          ADD TO CART
        </button>

        <button className="w-full h-14 border border-[#665b54] text-[#665b54] tracking-[3px] text-sm">
          BUY NOW
        </button>
      </div>
    </div>
  );
}