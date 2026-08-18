'use client';

import React from 'react';

export default function ProductBrowseTrack({
  title,
  countLabel,
  trackRef,
  prevDisabled,
  nextDisabled,
  scrollTrack,
  items,
}) {
  return (
    <section className="py-9 sm:py-12 lg:py-14 border-t border-[#CBC9C4] bg-[#EAE8E2]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex items-baseline gap-4 mb-5">
          <h2 className="font-serif font-normal text-xl sm:text-2xl lg:text-3xl text-[#1C1714] m-0">
            {title}
          </h2>
          <span className="font-heading text-[10px] tracking-[0.14em] font-semibold text-[#78716C] uppercase">
            {countLabel}
          </span>
          <div className="ml-auto flex gap-2">
            <button
              className="w-[38px] h-[38px] border border-[#CBC9C4] bg-white cursor-pointer flex items-center justify-center p-0 rounded-[3px] transition-colors hover:border-[#1C1714] hover:bg-[#F2EDE4] disabled:opacity-30 disabled:cursor-default"
              onClick={() => scrollTrack(trackRef, 'prev')}
              disabled={prevDisabled}
              aria-label="Previous"
            >
              <i className="w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-[#1C1714] block -rotate-[135deg] ml-[3px]"></i>
            </button>
            <button
              className="w-[38px] h-[38px] border border-[#CBC9C4] bg-white cursor-pointer flex items-center justify-center p-0 rounded-[3px] transition-colors hover:border-[#1C1714] hover:bg-[#F2EDE4] disabled:opacity-30 disabled:cursor-default"
              onClick={() => scrollTrack(trackRef, 'next')}
              disabled={nextDisabled}
              aria-label="Next"
            >
              <i className="w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-[#1C1714] block rotate-45 mr-[3px]"></i>
            </button>
          </div>
        </div>
        <div
          className="flex gap-3.5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={trackRef}
        >
          {items && items.map((item, idx) => (
            <a
              key={idx}
              className="flex-none w-[160px] sm:w-[180px] lg:w-[214px] snap-start text-inherit no-underline group"
              href={item.href || '#'}
            >
              <div
                className={`aspect-square border border-[#CBC9C4] rounded-[2px] overflow-hidden relative ${
                  item.isCurrent ? 'outline outline-2 outline-[#1C1714] -outline-offset-2' : ''
                }`}
                style={{ background: item.bg || '#FAF8F5' }}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <h3 className="font-serif text-base font-normal text-[#1C1714] mt-2.5 mb-1 group-hover:underline underline-offset-4">
                {item.title}
              </h3>
              <span className="font-heading text-[9px] tracking-[0.12em] font-semibold text-[#78716C] uppercase block truncate">
                {item.subtitle}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
