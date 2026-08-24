"use client";

import Link from "next/link";
import {
  HiOutlineSparkles,
  HiOutlineCubeTransparent,
  HiOutlineGlobeAlt,
  HiOutlineScale,
} from "react-icons/hi2";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import ImageWithLoader from "@/components/common/Loader";
import CategoryCTA from "@/components/common/CategoryCTA";
import { getPlaceholderImage } from "@/lib/placeholderImage";

// Roman numerals for master families
const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export default function CollectionsOverviewClient({ data }) {
  const { cmsOverview, masterFamilies = [], stats = {} } = data || {};

  const headerTitle = cmsOverview?.title || "Collections";
  const headerDesc =
    cmsOverview?.description ||
    "Eighteen named stone series across four master families. Each one is a way of working with stone, not a group of colours.";
  const wideBanner =
    cmsOverview?.bannerImage?.wide?.[0]?.url ||
    cmsOverview?.bannerImage?.square?.url ||
    getPlaceholderImage("Stoneza Collections", 0);

  const featuredCard = cmsOverview?.megamenu?.featuredCard;

  const totalNamedSeries = masterFamilies.reduce((acc, f) => acc + (f.children?.length || 0), 0) || stats.totalCollections || 18;

  return (
    <div className="w-full min-h-screen bg-[#EAE8E2] text-[#1C1714] selection:bg-[#9A4A2E] selection:text-white pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-[#1C1714] text-white">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <ImageWithLoader
            src={wideBanner}
            alt={headerTitle}
            fill
            className="object-cover opacity-45 scale-[1.02] transform transition-transform duration-1000"
            priority
            placeholderTitle="The Stoneza Collections"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1714] via-[#1C1714]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1714]/80 via-transparent to-[#1C1714]/80" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-32 sm:pt-40 pb-20 sm:pb-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[2.5px] font-heading text-[#C8A980] mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white">Collections</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A980]/30 bg-[#C8A980]/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[2.5px] text-[#C8A980] backdrop-blur-md mb-6">
              <Sparkles className="size-3.5" />
              <span>Architectural Stone Series</span>
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-white mb-6">
              The Stoneza <span className="italic text-[#C8A980]">Collections</span>
            </h1>

            <p className="font-sans text-[16px] sm:text-[18px] leading-relaxed text-[#EAE8E2]/85 max-w-2xl font-light">
              {headerDesc}
            </p>
          </div>

          {/* Key Metric Ribbon */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/15 pt-8">
            <div className="flex flex-col">
              <span className="font-display text-2xl sm:text-3xl text-[#C8A980] font-normal">
                {masterFamilies.length || stats.totalFamilies || 4}
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[2px] text-white/70 mt-1">
                Master Families
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl sm:text-3xl text-[#C8A980] font-normal">
                {totalNamedSeries}
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[2px] text-white/70 mt-1">
                Named Series
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl sm:text-3xl text-[#C8A980] font-normal">
                60+
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[2px] text-white/70 mt-1">
                Quarry Partners
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl sm:text-3xl text-[#C8A980] font-normal">
                100%
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[2px] text-white/70 mt-1">
                Natural &amp; Sawn
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OPTIONAL CMS FEATURED SPOTLIGHT CARD */}
      {featuredCard && featuredCard.title && (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-10">
          <div className="relative overflow-hidden rounded-2xl border border-[#CBC9C4] bg-[#F2EDE4] p-6 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#9A4A2E]/10 px-3.5 py-1 text-[10.5px] font-heading font-semibold uppercase tracking-[2px] text-[#9A4A2E]">
                  <HiOutlineSparkles className="size-3.5" />
                  <span>{featuredCard.eyebrow || "Featured Collection Spotlight"}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl text-[#1C1714] font-normal leading-tight">
                  {featuredCard.title}
                </h2>
                <p className="font-sans text-[14.5px] leading-relaxed text-[#57504A] max-w-xl">
                  {featuredCard.description}
                </p>
                {featuredCard.href && (
                  <div className="pt-2">
                    <Link
                      href={featuredCard.href}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#1C1714] px-6 py-3 font-heading text-[11px] font-bold uppercase tracking-[2px] text-white transition-all hover:bg-[#9A4A2E]"
                    >
                      <span>Explore Spotlight Series</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                )}
              </div>
              <div className="lg:col-span-5 aspect-[16/10] relative rounded-xl overflow-hidden border border-[#CBC9C4]/70 bg-stone-200">
                <ImageWithLoader
                  src={featuredCard.image?.url || wideBanner}
                  alt={featuredCard.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  placeholderTitle={featuredCard.title}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. MAIN MASTER FAMILIES & SUB-COLLECTIONS SHOWCASE */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-12">
        <div className="space-y-16 sm:space-y-24">
          {masterFamilies.map((family, idx) => {
            const romanIndex = ROMAN_NUMERALS[idx] || `${idx + 1}`;
            const familyWideBanner =
              family.bannerImage?.wide?.[0]?.url ||
              family.bannerImage?.square?.url ||
              getPlaceholderImage(family.name, idx);

            return (
              <section
                key={family._id}
                id={`family-${family.slug}`}
                className="space-y-8 scroll-mt-36"
              >
                {/* Master Family Header Banner Box */}
                <div className="relative overflow-hidden rounded-2xl border border-[#CBC9C4] bg-[#FAF8F5] p-6 sm:p-10 transition-all hover:shadow-md">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-[2.5px] text-[#9A4A2E] bg-[#9A4A2E]/10 px-2.5 py-1 rounded-md">
                          Family {romanIndex}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-[2px] text-[#78716C]">
                          {family.children?.length || 0} Named Series
                        </span>
                      </div>

                      <h2 className="font-display text-3xl sm:text-4xl text-[#1C1714] font-normal leading-tight">
                        {family.name}
                      </h2>

                      <p className="font-sans text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#57504A] max-w-2xl">
                        {family.description ||
                          "Architectural natural stone tailored for enduring structural elegance and seamless installation."}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-4">
                        <Link
                          href={`/collections/${family.slug}`}
                          className="inline-flex items-center gap-2 font-heading text-[11.5px] font-bold uppercase tracking-[2px] text-[#1C1714] hover:text-[#9A4A2E] transition-colors group"
                        >
                          <span>View All {family.name} Products</span>
                          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>

                    {/* Family Square Thumbnail / Preview */}
                    <div className="lg:col-span-4 aspect-[4/3] sm:aspect-[16/10] relative rounded-xl overflow-hidden border border-[#CBC9C4]/70 bg-stone-200">
                      <ImageWithLoader
                        src={familyWideBanner}
                        alt={family.name}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        placeholderTitle={family.name}
                        seedIndex={idx}
                      />
                    </div>
                  </div>
                </div>

                {/* Nested Sub-Collections Grid */}
                {family.children && family.children.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h3 className="font-heading text-[12px] uppercase tracking-[2.5px] text-[#78716C] font-semibold">
                        {family.name} Series
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {family.children.map((sub, sIdx) => {
                        const subImage =
                          sub.bannerImage?.square?.url ||
                          sub.bannerImage?.wide?.[0]?.url ||
                          getPlaceholderImage(sub.name, sIdx + idx * 10);

                        return (
                          <Link
                            key={sub._id}
                            href={`/collections/${sub.slug}`}
                            className="group flex flex-col rounded-xl border border-[#CBC9C4] bg-[#FAF8F5] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#9A4A2E]/50 hover:-translate-y-1"
                          >
                            {/* Square Card Image */}
                            <div className="aspect-square relative w-full overflow-hidden bg-stone-100 border-b border-[#CBC9C4]/60">
                              <ImageWithLoader
                                src={subImage}
                                alt={sub.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-108"
                                placeholderTitle={sub.name}
                                seedIndex={sIdx + idx * 10}
                              />
                              {/* Badge count overlay */}
                              <div className="absolute top-3 right-3 z-20">
                                <span className="rounded-full bg-[#1C1714]/80 backdrop-blur-md px-2.5 py-1 text-[9.5px] font-mono font-medium uppercase tracking-[1px] text-white shadow-xs">
                                  {sub.productCount || 0} {sub.productCount === 1 ? "Product" : "Products"}
                                </span>
                              </div>
                            </div>

                            {/* Content Details */}
                            <div className="p-5 flex flex-col flex-1">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-display text-lg font-normal text-[#1C1714] group-hover:text-[#9A4A2E] transition-colors leading-snug">
                                  {sub.name}
                                </h4>
                                <ArrowUpRight className="size-4 text-[#78716C] group-hover:text-[#9A4A2E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                              </div>

                              <p className="font-sans text-[13px] leading-relaxed text-[#57504A] line-clamp-2 mb-4 flex-1">
                                {sub.description ||
                                  `Discover hand-selected stones in our ${sub.name} collection.`}
                              </p>

                              <div className="pt-3 border-t border-[#CBC9C4]/40 flex items-center justify-between font-heading text-[10.5px] uppercase tracking-[1.5px] text-[#9A4A2E] font-bold">
                                <span>Explore Series</span>
                                <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>

      {/* 4. ARCHITECTURAL CRAFTSMANSHIP GUARANTEE */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-20">
        <div className="rounded-2xl border border-[#CBC9C4] bg-white p-8 sm:p-12 lg:p-14 shadow-xs">
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#8A8078] mb-3 font-semibold">
              THE STONEZA SPECIFICATION
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1C1714] font-normal leading-tight">
              Crafted for permanent architectural presence
            </h2>
            <p className="font-sans text-[15px] leading-relaxed text-[#57504A] mt-3">
              Every collection in our catalog is engineered to withstand outdoor weathering, heavy foot traffic, and extreme climate fluctuations while maintaining its tactile character.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="size-11 rounded-xl bg-[#F2EDE4] border border-[#CBC9C4]/70 flex items-center justify-center text-[#9A4A2E]">
                <HiOutlineGlobeAlt className="size-6" />
              </div>
              <h3 className="font-display text-lg text-[#1C1714]">
                Quarry-Direct Sourcing
              </h3>
              <p className="font-sans text-[13.5px] leading-relaxed text-[#57504A]">
                We partner directly with 60+ select mines across Rajasthan, South India, and international quarries to eliminate intermediaries.
              </p>
            </div>

            <div className="space-y-3">
              <div className="size-11 rounded-xl bg-[#F2EDE4] border border-[#CBC9C4]/70 flex items-center justify-center text-[#9A4A2E]">
                <HiOutlineCubeTransparent className="size-6" />
              </div>
              <h3 className="font-display text-lg text-[#1C1714]">
                Custom Sizing &amp; Finishes
              </h3>
              <p className="font-sans text-[13.5px] leading-relaxed text-[#57504A]">
                From calibrated paving slabs and jumbo facade panels to CNC fluting and hand-chiseled rockfaces.
              </p>
            </div>

            <div className="space-y-3">
              <div className="size-11 rounded-xl bg-[#F2EDE4] border border-[#CBC9C4]/70 flex items-center justify-center text-[#9A4A2E]">
                <HiOutlineScale className="size-6" />
              </div>
              <h3 className="font-display text-lg text-[#1C1714]">
                Rigorous Batch Matching
              </h3>
              <p className="font-sans text-[13.5px] leading-relaxed text-[#57504A]">
                Consistent color grading and grain harmony curated across project phases, years apart.
              </p>
            </div>

            <div className="space-y-3">
              <div className="size-11 rounded-xl bg-[#F2EDE4] border border-[#CBC9C4]/70 flex items-center justify-center text-[#9A4A2E]">
                <HiOutlineSparkles className="size-6" />
              </div>
              <h3 className="font-display text-lg text-[#1C1714]">
                Architectural Samples
              </h3>
              <p className="font-sans text-[13.5px] leading-relaxed text-[#57504A]">
                Physical hand sample boxes dispatched promptly to your studio or project site for mood-board approvals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-16">
        <CategoryCTA
          title="Require Custom Stone Sizes or Quarry Samples?"
          description="Share your project drawings or material specifications. Our stone specialists provide quarry-direct quotations and sample kits dispatched within 24 hours."
          buttonText="REQUEST SAMPLES &amp; QUOTE"
          buttonLink="/#enquire"
        />
      </section>
    </div>
  );
}
