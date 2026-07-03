"use client";

import { useState } from "react";
import Image from "next/image";
import ImageWithLoader from "@/components/common/Loader";

export default function ProductGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`relative h-24 w-24 overflow-hidden border transition ${
              selectedImage === image
                ? "border-[#665b54]"
                : "border-gray-200"
            }`}
          >
            <ImageWithLoader
              src={image}
              alt=""
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 aspect-square bg-[#f8f6f3] overflow-hidden">
        <ImageWithLoader
          src={selectedImage}
          alt=""
          fill
          className="object-cover hover:scale-105 transition duration-500"
        />
      </div>
    </div>
  );
}