import React from "react";
import Link from "next/link";
import ImageWithLoader from "@/components/common/Loader";
import { DEFAULT_JOURNAL_ARTICLES } from "@/lib/getJournalArticlesData";

export default function JournalSection({
  eyebrow = "THE JOURNAL",
  title = "Knowing your stone",
  subtitle = "What three decades at the quarry face since 1992 has taught us, written for the people who specify it.",
  articles = DEFAULT_JOURNAL_ARTICLES,
  allArticlesHref = "/blogs",
  className = "",
}) {
  const displayArticles =
    articles && articles.length > 0 ? articles : DEFAULT_JOURNAL_ARTICLES;

  return (
    <section className={`w-full bg-white border-t border-[#26221E]/10 py-16 sm:py-20 md:py-24 ${className}`}>
      <div className="max-w-[1320px] mx-auto px-4.5 sm:px-8 lg:px-16">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 sm:mb-12 md:mb-14 gap-4">
          <div>
            {eyebrow && (
              <p className="font-heading font-medium tracking-[0.25em] text-[10px] sm:text-[11px] text-[#8A7F73] uppercase mb-2 sm:mb-3">
                {eyebrow}
              </p>
            )}

            <h2 className="font-display text-[28px] sm:text-[36px] md:text-[42px] font-normal text-[#1C1714] leading-[1.2] tracking-tight mb-2 sm:mb-3">
              {title}
            </h2>

            {subtitle && (
              <p className="font-body text-[14px] sm:text-[15px] text-[#635B54] max-w-[620px] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {allArticlesHref && (
            <Link
              href={allArticlesHref}
              className="inline-flex items-center gap-1.5 font-heading font-semibold text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] text-[#1C1714] border-b border-[#1C1714] pb-1 hover:text-[#9A4A2E] hover:border-[#9A4A2E] transition-colors shrink-0 self-start md:self-end"
            >
              <span>ALL ARTICLES</span>
              <span className="text-xs">&rarr;</span>
            </Link>
          )}
        </div>

        {/* 3-Column Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {displayArticles.slice(0, 3).map((article, idx) => (
            <Link
              key={article.id || article._id || idx}
              href={article.href || (article.slug ? `/blogs/${article.slug}` : "/blogs")}
              className="group block"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-[#EAE8E2] mb-4 sm:mb-5 border border-black/5">
                <ImageWithLoader
                  src={article.image || article.bannerImage?.url}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  seedIndex={idx + 30}
                />
              </div>

              {/* Tag / Category */}
              <span className="block font-heading font-semibold text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] text-[#8A7F73] mb-1.5">
                {article.tag || (Array.isArray(article.tags) && article.tags[0]) || "ARTICLE"}
              </span>

              {/* Title */}
              <h3 className="font-display text-[18px] sm:text-[20px] text-[#1C1714] font-normal leading-snug mb-2 group-hover:text-[#9A4A2E] transition-colors">
                {article.title}
              </h3>

              {/* Description / Excerpt */}
              <p className="font-body text-[13px] sm:text-[14px] text-[#635B54] leading-[1.6] line-clamp-3">
                {article.excerpt || article.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
