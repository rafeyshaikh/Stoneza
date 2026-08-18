"use client";

import React from "react";

export default function StatsBanner() {
  const stats = [
    { value: "1992", label: "Trading Since" },
    { value: "3", label: "Own Mines" },
    { value: "60+", label: "Quarry Partners" },
    { value: "273", label: "Products" },
    { value: "Pan-India", label: "& Export" },
  ];

  return (
    <section className="bg-[#1C1714] text-[#EAE8E2]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center py-7 px-4 text-center"
            >
              <span className="font-serif text-xl sm:text-2xl md:text-2xl lg:text-[28px] font-light leading-none text-[#C9BDB2] tracking-tight">
                {stat.value}
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.24em] text-[#A3978B] mt-2.5 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
