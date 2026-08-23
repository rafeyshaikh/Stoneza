import ImageWithLoader from "./Loader";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MegaMenu({ item, categoryData }) {
  const itemData = item || categoryData;
  if (!itemData) return null;

  const sortedCategories = [...(itemData.categories || [])].sort((a, b) => {
    const countA = a.links?.length || 0;
    const countB = b.links?.length || 0;
    return countA - countB;
  });

  const categoriesCount = sortedCategories.length;
  const maxImages = categoriesCount >= 3 ? 1 : 2;
  const visibleImages = itemData.images?.slice(0, maxImages) || [];

  let secondImageClass = "";
  if (categoriesCount === 3) {
    secondImageClass = "hidden 2xl:block";
  } else if (categoriesCount < 3) {
    secondImageClass = "hidden xl:block";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed left-0 right-0 top-full w-full bg-transparent z-[999] pointer-events-auto"
    >
      <div className="w-full bg-[#C5B9AB] text-[#393938] shadow-lg">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-7 lg:py-8">
          <div className="flex items-start justify-between gap-8 lg:gap-12">
            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-7 xl:gap-10 flex-1 items-start">
              {sortedCategories.map((section) => {
                return (
                  <div key={section.title} className="w-full min-w-0">
                    <span
                      className="text-[13px] uppercase tracking-[0.22em] text-[#393938] font-heading font-semibold block truncate select-none cursor-default"
                      title={section.title}
                    >
                      {section.title}
                    </span>

                    <ul className="space-y-2 mt-3">
                      {section.links?.map((link) => {
                        const linkName =
                          typeof link === "string" ? link : link.name || link.title;
                        const linkHref = typeof link === "object" && link.href ? link.href : `/product-category/${link.slug}`;
                        return (
                          <li key={link.slug || linkName}>
                            <Link
                              href={linkHref}
                              className="text-[14px] text-[#393938]/90 font-body transition-colors hover:text-[#111] hover:font-medium block truncate"
                              title={linkName}
                            >
                              {linkName}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Images */}
            {visibleImages.length > 0 && (
              <div className="flex items-start gap-7 shrink-0 pl-7 lg:pl-9">
                {visibleImages.map((img, index) => (
                  <Link
                    key={img.image || index}
                    href={img.href || "#"}
                    className={`group text-center ${index === 1 ? secondImageClass : ""}`}
                  >
                    <div className="relative w-[240px] lg:w-[280px] h-[160px] lg:h-[185px] overflow-hidden bg-[#d4c9b8] rounded-xs shadow-xs">
                      <ImageWithLoader
                        src={img.image}
                        fill
                        alt={img.title || "Banner"}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {img.title && (
                      <p className="mt-3 text-[13px] uppercase tracking-[0.22em] text-[#5c5248] font-heading font-medium">
                        {img.title}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}