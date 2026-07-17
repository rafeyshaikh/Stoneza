"use client";

import { useState, useEffect } from "react";
import ImageWithLoader from "@/components/common/Loader";

export default function ProductGallery({ images, shortDescription }) {
  const [selectedImage, setSelectedImage] = useState(images?.[0] || "");

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/3] bg-stone-100 rounded-lg flex items-center justify-center text-stone-400">
        No Images Available
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-4 w-full">
      {/* Thumbnails */}
      <div className="order-2 lg:order-1 grid grid-cols-4 lg:flex lg:flex-col gap-3 lg:w-24 shrink-0">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`relative aspect-square w-full overflow-hidden rounded border-2 transition cursor-pointer ${
              selectedImage === image
                ? "border-[#9a4a2e]"
                : "border-transparent hover:border-stone-300"
            }`}
          >
            <ImageWithLoader
              src={image}
              alt={`Product gallery thumb ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image and Short Description */}
      <div className="order-1 lg:order-2 lg:flex-1 lg:min-w-0 flex flex-col gap-6">
        <div className="relative w-full aspect-square bg-stone-100/50 rounded-lg overflow-hidden border border-stone-200">
          <ImageWithLoader
            src={selectedImage}
            alt="Product gallery main"
            fill
            className="object-cover transition-transform duration-500 hover:scale-[1.03]"
          />
        </div>
        {shortDescription && (
          <p className="text-[15.5px] text-[#3a322c] leading-relaxed max-w-prose hidden lg:block">
            {shortDescription}
          </p>
        )}
      </div>
    </div>
  );
}