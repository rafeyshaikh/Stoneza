"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ImageWithLoader({
  src,
  alt,
  className = "",
  ...props
}) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="h-[2px] w-32 overflow-hidden">
            <motion.div
              className="h-full bg-black"
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        onLoadingComplete={() => setLoading(false)}
        className={`transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        } ${className}`}
        {...props}
      />
    </div>
  );
}