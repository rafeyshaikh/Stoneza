"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { isValidImageUrl } from "@/lib/utils";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import ProductWatermark from "@/components/common/ProductWatermark";

export default function ImageWithLoader({
  src,
  alt = "Stoneza",
  className = "",
  placeholderTitle,
  seedIndex = 0,
  watermark = false,
  watermarkTone = "charcoal",
  ...props
}) {
  const [loading, setLoading] = useState(true);

  const titleText = placeholderTitle || alt || "STONEZA";
  const fallbackSrc = getPlaceholderImage(titleText, seedIndex);

  const initialSrc = isValidImageUrl(src) ? src : fallbackSrc;
  const [imgSrc, setImgSrc] = useState(initialSrc);

  useEffect(() => {
    const valid = isValidImageUrl(src);
    setImgSrc(valid ? src : fallbackSrc);
    if (!valid) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [src, fallbackSrc]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#EAE8E2]/50">
          <div className="h-[2px] w-32 overflow-hidden">
            <motion.div
              className="h-full bg-[#393938]"
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      )}

      <Image
        src={imgSrc}
        alt={alt}
        onLoadingComplete={() => setLoading(false)}
        onLoad={() => setLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc);
          setLoading(false);
        }}
        className={`transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        } ${className}`}
        {...props}
      />

      {watermark && !loading && (
        <ProductWatermark tone={watermarkTone} />
      )}
    </div>
  );
}