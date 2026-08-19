import React from "react";
import ImageWithLoader from "@/components/common/Loader";
import Link from "next/link";

export default function HomeAboutSection({
  storyData,
  imageleft = true,
  eyebrow = "SINCE 1992",
  title = "We go where the stone is",
  lead = "India’s best stones are not in one place. So we built a company with the reach to get all of them.",
}) {
  const defaultParagraphs = [
    "Kota limestone under Rajasthan. Basalt in the Deccan. Limestone beneath Jaisalmer, granite in the south, slate in the east. Different districts, different leases, different families.",
    "We started in 1992 quarrying Bijolia sandstone and we still mine at Bijolia, Kota and Asind. Alongside that we spent thirty years earning direct access to the best quarries in every other stone belt in the country — buying at a scale that puts us first in line for the good lots and gives us the standing to turn down the rest.",
    "Every lot, mined by us or sourced, then comes through our own works at Bhilwara for grading, calibration and finishing against one standard. You deal with one company, hold one company to the specification, and have one company to come back to.",
  ];

  const displayEyebrow = storyData?.homepageEyebrow || eyebrow;
  const displayTitle = storyData?.homepageTitle || title;
  const displayLead = storyData?.homepageLead || lead;
  const paragraphs = storyData?.homepageParagraphs || defaultParagraphs;

  const imageUrl =
    storyData?.homepageImage?.url ||
    "https://stoneza.in/wp-content/uploads/2026/04/Home-Page.webp";

  return (
    <section className="w-full bg-[#FAF8F5] border-t border-[#26221E]/10 py-16 sm:py-20 md:py-24">
      <div className="max-w-[1320px] mx-auto px-4.5 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* IMAGE COLUMN */}
          <div className={`relative ${imageleft ? "order-1" : "order-2"}`}>
            <div className="relative aspect-[4/3] border border-[#D9C4B0] w-full overflow-hidden bg-[#EAE8E2] shadow-xs">
              <ImageWithLoader
                src={imageUrl}
                alt="Stoneza Bijolia Quarry"
                fill
                className="object-cover transition-transform duration-700 hover:scale-103"
                placeholderTitle="STONEZA QUARRY"
              />
            </div>
          </div>

          {/* TEXT COLUMN */}
          <div className={`space-y-5 sm:space-y-6 ${imageleft ? "order-2" : "order-1"}`}>
            <div>
              {displayEyebrow && (
                <p className="font-heading font-medium tracking-[0.25em] text-[10px] sm:text-[11px] text-[#8A7F73] uppercase mb-2 sm:mb-3">
                  {displayEyebrow}
                </p>
              )}

              <h2 className="font-display text-[28px] sm:text-[30px] md:text-[30px] lg:text-[32px] font-normal text-[#1C1714] leading-[1.12] tracking-tight">
                {displayTitle}
              </h2>
            </div>

            {displayLead && (
              <div className="border-l-2 border-[#1C1714] pl-4 sm:pl-5 py-0.5 my-4 sm:my-5">
                <p className="font-body text-[15px] sm:text-[16.5px] text-[#2A2421] font-normal leading-[1.5]">
                  {displayLead}
                </p>
              </div>
            )}

            <div className="space-y-3.5 sm:space-y-4 text-[12.5px] sm:text-[13.5px] text-[#5C5248] leading-[1.65] font-body">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="pt-2 sm:pt-4">
              <Link
                href="/pages/about-us"
                className="inline-block bg-[#1C1714] text-[#FAF8F5] hover:bg-[#9A4A2E] hover:text-white font-heading text-[10.5px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-4 transition-colors cursor-pointer"
              >
                Read our story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
