import Image from "next/image";
import { useState } from "react";
import ImageWithLoader from "./Loader";
import { motion } from "framer-motion";

export default function MegaMenu({ item }) {
  const categoriesCount = item.categories?.length || 0;
  const maxImages = categoriesCount >= 3 ? 1 : 2;
  const visibleImages = item.images?.slice(0, maxImages) || [];

  let secondImageClass = "";
  if (categoriesCount === 3) {
    secondImageClass = "hidden 2xl:block";
  } else if (categoriesCount < 3) {
    secondImageClass = "hidden xl:block";
  }

  return (
    <motion.div
      initial={{ opacity: 0}}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0}}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="absolute top-full left-1/2 -translate-x-1/2 w-screen pt-2 bg-transparent z-[999]"
    >
      <div className="w-full bg-[#C5B9AB] text-[#393938] shadow-md">
        <div className="max-w-[1280px] mx-auto px-8 py-10">
          <div className="flex items-start justify-between gap-12">
            {/* Categories */}
            <div className="flex gap-14 shrink-0">
              {item.categories?.map((section) => (
                <div
                  key={section.title}
                  className="min-w-[190px]"
                >
                  <a className=" text-[13px] uppercase tracking-[0.24em] text-[#393938] font-heading font-medium" href={`/collections/${section.slug}?categoryLevel=2` || "#"}>
                    {section.title}
                  </a>

                  <ul className="space-y-2.5 mt-4">
                    {section.links.map((link) => {
                      const linkName = typeof link === "string" ? link : (link.name || link.title);
                      const linkSlug = typeof link === "string" ? link.toLowerCase().replace(/ /g, "-") : link.slug;
                      return (
                        <li key={linkSlug}>
                          <a
                            href={`/collections/${linkSlug}?categoryLevel=3`}
                            className="text-[14px] text-[#393938] font-body transition-colors hover:text-[#231c15]"
                          >
                            {linkName}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Images */}
            {visibleImages.length > 0 && (
              <div className="flex items-start gap-8 shrink-0">
                {visibleImages.map((img, index) => (
                  <a
                    key={img.image}
                    href="#"
                    className={`group text-center ${index === 1 ? secondImageClass : ""}`}
                  >
                    <div className="relative w-[320px] h-[240px] overflow-hidden bg-[#d4c9b8]">
                      <ImageWithLoader
                        src={img.image}
                        fill
                        alt={img.title || "Banner"}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {img.title && (
                      <p className="mt-4 text-[13px] uppercase tracking-[0.22em] text-[#5c5248]">
                        {img.title}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}