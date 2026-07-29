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
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed left-0 right-0 top-full w-full bg-transparent z-[999] pointer-events-auto"
    >
      <div className="w-full bg-[#C5B9AB] text-[#393938] shadow-lg border-t border-[#b3a696]/40">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-10">
          <div className="flex items-start justify-between gap-8 lg:gap-12">
            {/* Categories */}
            <div className="flex flex-wrap gap-10 xl:gap-14 shrink-0 flex-1">
              {item.categories?.map((section) => (
                <div key={section.title} className="min-w-[170px] lg:min-w-[190px]">
                  <a
                    className="text-[13px] uppercase tracking-[0.24em] text-[#393938] font-heading font-semibold hover:text-[#1c1b1b] transition-colors"
                    href={`/collections/${section.slug}`}
                  >
                    {section.title}
                  </a>

                  <ul className="space-y-2.5 mt-4">
                    {section.links?.map((link) => {
                      const linkName =
                        typeof link === "string" ? link : link.name || link.title;
                      return (
                        <li key={link.slug || linkName}>
                          <a
                            href={`/collections/${link.slug}`}
                            className="text-[14px] text-[#393938]/90 font-body transition-colors hover:text-[#111] hover:font-medium"
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
                    key={img.image || index}
                    href="#"
                    className={`group text-center ${index === 1 ? secondImageClass : ""}`}
                  >
                    <div className="relative w-[280px] lg:w-[320px] h-[210px] lg:h-[240px] overflow-hidden bg-[#d4c9b8] rounded-xs shadow-xs">
                      <ImageWithLoader
                        src={img.image}
                        fill
                        alt={img.title || "Banner"}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {img.title && (
                      <p className="mt-4 text-[13px] uppercase tracking-[0.22em] text-[#5c5248] font-heading">
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