import Image from "next/image";
import { useState } from "react";
import ImageWithLoader from "./Loader";

export default function MegaMenu({ item }) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 w-screen mt-2 bg-[#C5B9AB] text-[#393938] shadow-md z-[999]"
    >
      <div className="max-w-[1280px] mx-auto px-8 py-10">
        <div className="flex items-start justify-between gap-12">
          {/* Categories */}
          <div className="flex gap-14 shrink-0">
            {item.categories?.map((section) => (
              <div
                key={section.title}
                className="min-w-[190px]"
              >
                <p className="mb-4 text-[13px] uppercase tracking-[0.24em] text-[#393938] font-heading font-medium">
                  {section.title}
                </p>

                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[14px] text-[#393938] font-body transition-colors hover:text-[#231c15]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Images */}
          {item.images?.length > 0 && (
            <div className="flex items-start gap-8 shrink-0">
              {item.images.map((img) => (
                <a
                  key={img.title}
                  href="#"
                  className="group text-center"
                >
                  <div className="relative w-[320px] h-[240px] overflow-hidden bg-[#d4c9b8]">
                    <ImageWithLoader
                      src={img.image}
                      fill
                      alt={img.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <p className="mt-4 text-[13px] uppercase tracking-[0.22em] text-[#5c5248]">
                    {img.title}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}