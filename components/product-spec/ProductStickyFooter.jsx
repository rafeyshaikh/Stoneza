'use client';

import React from 'react';

export default function ProductStickyFooter({
  showSticky,
  productName = 'Cosmic Black',
  priceLabel = 'Price on request • ex-factory',
  whatsappUrl,
}) {
  return (
    <div
      className={`fixed left-0 right-0 bottom-0 z-[800] bg-[#1C1714] text-[#FAF8F5] items-center justify-between gap-3.5 px-4 sm:px-8 lg:px-16 py-3 border-t border-white/15 shadow-[0_-10px_26px_-18px_rgba(0,0,0,0.5)] transition-all duration-300 ${
        showSticky ? 'flex' : 'hidden'
      }`}
    >
      <div>
        <b className="block font-serif text-base font-normal text-[#FAF8F5]">{productName}</b>
        <span className="font-heading text-[9px] tracking-[0.14em] uppercase text-[#C8A980] font-semibold block">
          {priceLabel}
        </span>
      </div>
      <a
        className="font-heading text-[10px] font-bold tracking-[0.14em] uppercase bg-[#C8A980] text-[#1C1714] no-underline px-5.5 py-3 rounded-[3px] whitespace-nowrap transition-colors hover:bg-white"
        href={
          whatsappUrl ||
          `https://wa.me/917877108154?text=${encodeURIComponent(`Hi Stoneza, I'd like a quote for ${productName}`)}`
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        Enquire
      </a>
    </div>
  );
}
