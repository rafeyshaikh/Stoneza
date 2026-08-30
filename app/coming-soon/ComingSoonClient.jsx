"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Package, 
  Layers, 
  Ruler, 
  Building2,
  Mail,
  ArrowLeft
} from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export default function ComingSoonClient() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Architect / Designer");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Simulate swift confirmation
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const previewPillars = [
    {
      icon: Layers,
      title: "Jumbo Slabs & Formats",
      desc: "Calibrated continuous floor-to-ceiling elevation modules.",
    },
    {
      icon: Ruler,
      title: "Custom CNC Textures",
      desc: "Precision ribbed, fluted, and hand-tooled monolithic profiles.",
    },
    {
      icon: Package,
      title: "Priority 48h Sample Kit",
      desc: "Direct delivery of physical swatch boxes to your studio.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#FAF8F5] relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      {/* Background ambient lighting and subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(200,169,128,0.18),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3A322C_1px,transparent_1px),linear-gradient(to_bottom,#3A322C_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-8 pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
        {/* Navigation Breadcrumb back to Home */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[2px] text-[#57504A] hover:text-[#26221E] transition-colors no-underline"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C8A980]/40 bg-[#C8A980]/10 px-4 py-1.5 text-xs font-heading font-semibold uppercase tracking-[2.5px] text-[#C8A980] mb-8 backdrop-blur-sm">
          <Sparkles className="size-3.5" />
          <span>In the Workshop · New Series</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1C1714] leading-[1.12] tracking-tight mb-6 max-w-3xl mx-auto">
          Curating New <span className="italic text-[#C8A980]">Architectural</span> Stone Horizons
        </h1>

        {/* Description */}
        <p className="font-sans text-[16px] sm:text-[18px] leading-relaxed text-[#1C1714] max-w-2xl mx-auto font-light mb-12">
          Our stone masons in Bhilwara are hand-selecting and calibrating our upcoming natural stone surface release — featuring new monolithic textures, split-face veneers, and custom elevation panels.
        </p>

        {/* Early Access Registration Card */}
        <div className="max-w-xl mx-auto bg-[#26221E] border border-[#3A322C] rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl mb-16 text-left">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-display text-xl font-normal text-white">
                Be the first to receive sample swatches
              </h2>
              <p className="font-sans text-xs text-[#A8A29E] leading-relaxed">
                Enter your details to receive early specification schedules and priority sample boxes as soon as the collection is unsealed.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-heading uppercase tracking-[1.5px] text-[#C8A980] mb-1.5 font-medium">
                    Your Profession
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded bg-[#1C1714] border border-[#4A413A] px-3.5 py-2.5 text-xs text-[#FAF8F5] focus:border-[#C8A980] focus:outline-none transition-colors"
                  >
                    <option value="Architect / Designer">Architect / Designer</option>
                    <option value="PMC / Project Manager">PMC / Project Manager</option>
                    <option value="Developer / Builder">Developer / Builder</option>
                    <option value="Homeowner">Homeowner / Private Client</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-heading uppercase tracking-[1.5px] text-[#C8A980] mb-1.5 font-medium">
                    Studio / Work Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="architect@studio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded bg-[#1C1714] border border-[#4A413A] pl-9 pr-3.5 py-2.5 text-xs text-[#FAF8F5] placeholder-[#78716C] focus:border-[#C8A980] focus:outline-none transition-colors"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#78716C]" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded bg-[#C8A980] px-6 py-3.5 text-xs font-heading font-bold uppercase tracking-[0.16em] text-[#1C1714] transition-all hover:bg-[#D9BE9B] disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? "Registering..." : "Notify Me & Request Swatches"}</span>
                <ArrowRight className="size-3.5" />
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="size-12 rounded-full bg-[#C8A980]/20 text-[#C8A980] flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="font-display text-xl text-white">
                You’re on the priority specifier list
              </h3>
              <p className="font-sans text-xs text-[#CBC9C4] max-w-md mx-auto">
                We’ve recorded <span className="text-[#C8A980] font-medium">{email}</span>. You will be notified the instant the new architectural series is released.
              </p>
            </div>
          )}
        </div>

        {/* Key Preview Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left border-t border-[#3A322C] pt-12 mb-16">
          {previewPillars.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-[#3A322C] bg-[#26221E] p-5 space-y-2">
              <item.icon className="size-5 text-[#C8A980]" />
              <h3 className="font-display text-base font-medium text-white">
                {item.title}
              </h3>
              <p className="font-sans text-xs text-[#A8A29E] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Existing Catalogue Explore CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 rounded bg-[#26221E] hover:bg-[#3A322C] border border-[#26221E]/70 px-6 py-3 text-xs font-heading font-semibold uppercase tracking-[0.14em] text-[#C8A980] transition-all no-underline"
          >
            <span>Explore Current 273 Products</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded px-5 py-3 text-xs font-heading font-semibold uppercase tracking-[0.14em] bg-[#C8A980] text-[#26221E] transition-colors cursor-pointer no-underline border border-[#26221E]/70"
          >
            <span>Contact Quarry Team</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
