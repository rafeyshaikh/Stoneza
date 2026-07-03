"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center flex-wrap gap-2 text-sm text-[#8c857d]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.label}
            className="flex items-center gap-2"
          >
            {isLast ? (
              <span className="text-[#2c2c2c]">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-[#665b54] transition-colors"
              >
                {item.label}
              </Link>
            )}

            {!isLast && (
              <ChevronRight
                size={14}
                className="text-[#b5aea6]"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}