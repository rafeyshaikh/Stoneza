import Link from "next/link";
import { 
  Compass, 
  ArrowRight, 
  Layers, 
  Grid3X3, 
  PhoneCall, 
  Mail, 
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export const metadata = {
  title: "Page Not Found (404) | Stoneza",
  description: "The requested stone specification or page could not be found. Explore our 273 natural stone products across 18 named series.",
};

export default function NotFound() {
  const popularCategories = [
    {
      name: "Wall Cladding",
      desc: "Textured & rockface walling",
      href: "/product-category/wall-cladding",
    },
    {
      name: "Cobblestone Series",
      desc: "Hand-split driveway blocks",
      href: "/product-category/cobblestone",
    },
    {
      name: "Paving & Flooring",
      desc: "Calibrated outdoor flagstones",
      href: "/product-category/paving-flooring",
    },
    {
      name: "Master Collections",
      desc: "18 named architectural series",
      href: "/collections",
    },
  ];

  return (
    <div className="min-h-[85vh] bg-[#FAF8F5] text-[#1C1714] flex flex-col justify-center relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      {/* Subtle architectural background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#CBC9C4_1px,transparent_1px),linear-gradient(to_bottom,#CBC9C4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#CBC9C4] bg-[#F2EDE4] px-4 py-1.5 text-xs font-heading font-semibold uppercase tracking-[2.5px] text-[#9A4A2E] mb-6 shadow-2xs">
          <Compass className="size-3.5" />
          <span>404 · Page Not Found</span>
        </div>

        {/* Large Decorative Numeral */}
        <div className="relative mb-4 select-none">
          <span className="font-display text-8xl sm:text-9xl font-light tracking-tighter text-[#C8A980]/40 sm:text-[140px] block leading-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif italic text-2xl sm:text-3xl text-[#1C1714] font-normal tracking-wide">
              Stone Cut Not Found
            </span>
          </div>
        </div>

        {/* Subtitle & Description */}
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1C1714] max-w-2xl mx-auto leading-snug mb-4">
          The specification or page you requested is no longer at this coordinate.
        </h1>

        <p className="font-sans text-[15px] sm:text-[16.5px] text-[#57504A] max-w-xl mx-auto leading-relaxed mb-10 font-light">
          This URL may have been updated during our catalogue expansion. You can search our live index of 273 natural stone products or browse our architectural families below.
        </p>

        {/* Main CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/product"
            className="inline-flex items-center justify-center gap-2.5 rounded bg-[#1C1714] px-7 py-3.5 text-xs font-heading font-bold uppercase tracking-[0.16em] text-[#FAF8F5] transition-all hover:bg-[#3A322C] shadow-sm no-underline"
          >
            <Grid3X3 className="size-4" />
            <span>Browse All 273 Products</span>
            <ArrowRight className="size-3.5" />
          </Link>

          <Link
            href="/collections"
            className="inline-flex items-center justify-center gap-2.5 rounded border border-[#CBC9C4] bg-white px-7 py-3.5 text-xs font-heading font-bold uppercase tracking-[0.16em] text-[#1C1714] transition-all hover:bg-[#F2EDE4] hover:border-[#1C1714] no-underline"
          >
            <Layers className="size-4" />
            <span>Explore Collections</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded px-5 py-3.5 text-xs font-heading font-semibold uppercase tracking-[0.16em] text-[#78716C] hover:text-[#1C1714] transition-colors no-underline"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Popular Categories Shortcut Cards */}
        <div className="border-t border-[#CBC9C4]/80 pt-12">
          <p className="font-heading text-[11px] font-semibold uppercase tracking-[3px] text-[#8C8275] mb-6">
            Popular Architectural Categories
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {popularCategories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="group relative rounded-xl border border-[#CBC9C4]/70 bg-[#F2EDE4]/60 p-4 transition-all duration-200 hover:border-[#9A4A2E]/50 hover:bg-white hover:shadow-xs no-underline"
              >
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-display text-base font-medium text-[#1C1714] group-hover:text-[#9A4A2E] transition-colors">
                    {cat.name}
                  </h2>
                  <ArrowRight className="size-3.5 text-[#8C8275] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#9A4A2E]" />
                </div>
                <p className="font-sans text-xs text-[#78716C]">
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Immediate Support Footer */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#78716C] font-sans">
          <span>Need help finding a specific stone?</span>
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="inline-flex items-center gap-1.5 font-medium text-[#1C1714] hover:text-[#9A4A2E] transition-colors no-underline"
          >
            <PhoneCall className="size-3.5" />
            <span>{COMPANY_INFO.phone}</span>
          </a>
          <span>•</span>
          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="inline-flex items-center gap-1.5 font-medium text-[#1C1714] hover:text-[#9A4A2E] transition-colors no-underline"
          >
            <Mail className="size-3.5" />
            <span>{COMPANY_INFO.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
