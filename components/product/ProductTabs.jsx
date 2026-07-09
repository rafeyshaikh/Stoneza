"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductTabs({ product, onEnquireClick }) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true); // Open by default
  const details = product.stoneDetails || {};

  // Formulate key-value specs pairs from actual MongoDB stoneDetails structure
  const specsLeft = [
    { label: "Stone type", value: details.stoneType || "Natural quarried stone" },
    { label: "Product form", value: details.productForm || "Loose panels / crated" },
    { label: "Calibrated thickness", value: details.calibratedThickness || "N/A" },
    { label: "Face texture", value: details.faceTexture || "N/A" },
    { label: "Corner pieces", value: details.cornerPieces || "N/A" },
    { label: "Coverage", value: details.coveragePerUnit || "N/A" },
  ];

  const specsRight = [
    { label: "Water absorption", value: details.waterAbsorption || "Low porosity" },
    { label: "Density", value: details.density ? `${details.density} kg/m³` : "N/A" },
    { label: "Weather resistant", value: details.weatherResistance || "Yes — exterior grade" },
    { label: "Application", value: (Array.isArray(details.application) ? details.application.join(", ") : details.application) || "Façades & accent walls" },
    { label: "Installation", value: details.installationMethod || "Adhesive / substrate" },
    { label: "Minimum order (MOQ)", value: details.moq || "Project-based" },
  ];

  return (
    <div className="max-w-[1240px] mx-auto px-6 md:px-8 py-8 divide-y divide-stone-300/40">
      
      {/* 1. Specifications Section (Expanded) */}
      <section className="py-12">
        <h2 className="font-serif font-light text-3xl md:text-4xl text-[#1c1714] mb-2">
          Technical specifications
        </h2>
        <p className="text-sm text-[#3a322c] mb-10 max-w-2xl leading-relaxed">
          The numbers your architect and site engineer need before they spec it. Custom sizing, thickness and finishes are available on custom project orders.
        </p>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {/* Left Table */}
          <table className="w-full text-sm">
            <tbody>
              {specsLeft.map((item) => (
                <tr key={item.label} className="border-b border-stone-300/40">
                  <td className="py-4 text-[#3a322c] font-medium w-[40%]">{item.label}</td>
                  <td className="py-4 text-[#1c1714] font-semibold">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Right Table */}
          <table className="w-full text-sm">
            <tbody>
              {specsRight.map((item) => (
                <tr key={item.label} className="border-b border-stone-300/40">
                  <td className="py-4 text-[#3a322c] font-medium w-[40%]">{item.label}</td>
                  <td className="py-4 text-[#1c1714] font-semibold">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Detailed Description (Accordion UI) */}
      {product.description && (
        <div className="py-6">
          <button
            onClick={() => setIsDescriptionOpen((prev) => !prev)}
            className="flex w-full items-center justify-between py-4 text-left font-serif font-light text-3xl md:text-4xl text-[#1c1714] outline-none group cursor-pointer"
          >
            <span>Product Story & Overview</span>
            <ChevronDown
              className={`size-8 text-stone-500 transition-transform duration-300 ${
                isDescriptionOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          
          <AnimatePresence initial={false}>
            {isDescriptionOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div 
                  className="pt-2 pb-6 text-sm md:text-base text-[#3a322c] leading-relaxed w-full prose dark:prose-invert prose-stone max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 3. Applications Section (Expanded) */}
      {details.application && details.application.length > 0 ?(<section className="py-12">
        <h2 className="font-serif font-light text-3xl md:text-4xl text-[#1c1714] mb-2">
          Where it works best
        </h2>
        <p className="text-sm text-[#3a322c] mb-10 max-w-2xl leading-relaxed">
          Specified across luxury hospitality, modern residential estates, and landscape elevations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {details.application.map((app, index) => (
              <div key={app} className="border border-stone-300/40 rounded-lg p-6 bg-white shadow-sm flex flex-col gap-3">
                <span className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center text-xs font-serif italic font-medium text-[#9a4a2e]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h4 className="font-serif text-lg font-medium text-[#1c1714] capitalize">{app}</h4>
              </div>
            ))}
        </div>
      </section>):('')}

      {/* 4. Final Project CTA Section (Expanded) */}
      <section className="py-12">
        <div className="bg-gradient-to-br from-[#2a231e] to-[#1c1714] text-[#e9e0d2] rounded-lg p-10 md:p-14 text-center shadow-xl">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#c8a980]">
            Start your project
          </span>
          <h2 className="font-serif font-light text-3xl md:text-5xl text-white mt-4 mb-4">
            Get {product.name} priced for <em className="italic text-[#c8a980]">your</em> project.
          </h2>
          <p className="text-sm text-stone-300 max-w-xl mx-auto leading-relaxed mb-8">
            Tell us your expected quantity and delivery site. A Stoneza consultant will calculate quarry-direct pricing, custom lead times, and arrange physical samples.
          </p>
          <button
            onClick={onEnquireClick}
            className="h-12 px-8 bg-[#c8a980] hover:bg-white text-[#1c1714] text-xs tracking-[3px] font-bold uppercase transition-all duration-300 rounded shadow-md cursor-pointer"
          >
            Request a Quote
          </button>
        </div>
      </section>
    </div>
  );
}