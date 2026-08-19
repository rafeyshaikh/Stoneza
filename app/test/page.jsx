import React from "react";
import Link from "next/link";
import MainCategoriesGrid from "@/components/home/MainCategoriesGrid";
import SignatureStones from "@/components/home/SignatureStones";
import OnSiteProjects from "@/components/home/OnSiteProjects";
import JournalSection from "@/components/home/JournalSection";
import { getMainCategoriesData } from "@/lib/getMainCategoriesData";
import { getFeaturedProductsData } from "@/lib/getFeaturedProductsData";
import { getOnSiteProjectsData } from "@/lib/getOnSiteProjectsData";
import { getJournalArticlesData } from "@/lib/getJournalArticlesData";

export const dynamic = "force-dynamic";

export default async function TestPage() {
  const [categoriesData, featuredStones, onSiteProjects, journalArticles] =
    await Promise.all([
      getMainCategoriesData(),
      getFeaturedProductsData(),
      getOnSiteProjectsData(),
      getJournalArticlesData(),
    ]);

  return (
    <div className="bg-white text-[#26221E] font-sans antialiased">
      {/* 1. THE JOURNAL / KNOWING YOUR STONE SECTION */}
      <JournalSection articles={journalArticles} />

      {/* 2. ON SITE / SPECIFIED, SUPPLIED, STANDING SECTION */}
      <OnSiteProjects projects={onSiteProjects} />

      {/* 3. SIGNATURE STONES CAROUSEL ("What we are known for") */}
      <SignatureStones stones={featuredStones} />

      {/* 4. MAIN CATEGORIES CAROUSEL SECTION */}
      <MainCategoriesGrid categories={categoriesData} />

      {/* BREADCRUMB BAR */}
      <nav className="border-b border-[#26221E]/13 bg-white">
        <div className="max-w-[1320px] mx-auto px-4.5 sm:px-8 lg:px-16 py-3.5 font-mono text-[10px] tracking-[0.1em] uppercase text-[#8A8078] flex items-center gap-2">
          <Link href="/" className="text-[#8A8078] hover:text-[#26221E] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#26221E]">Test Page</span>
        </div>
      </nav>
    </div>
  );
}