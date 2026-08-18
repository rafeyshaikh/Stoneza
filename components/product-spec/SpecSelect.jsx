'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function SpecSelect({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex flex-col gap-0.5 py-2.5 border-b border-[#CBC9C4] even:pl-0 sm:even:pl-4 lg:even:pl-8 even:border-l-0 sm:even:border-l sm:even:border-[#CBC9C4]" ref={dropdownRef}>
      <span className="font-heading text-[9px] tracking-[0.16em] uppercase text-[#9A4A2E] font-bold">
        {label}
      </span>
      <div className="relative w-full">
        <button
          type="button"
          className={`w-full flex items-center justify-between bg-transparent border-0 border-b border-transparent py-[2px] font-sans text-sm font-semibold text-[#1C1714] cursor-pointer text-left transition-colors hover:text-[#9A4A2E] hover:border-[#9A4A2E] ${
            isOpen ? 'text-[#9A4A2E] border-b-[#9A4A2E]' : ''
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span>{value}</span>
          <span
            className={`w-[6px] select-none h-[6px] border-r-[1.5px] border-b-[1.5px] border-[#9A4A2E] transition-transform duration-200 ml-2 shrink-0 opacity-70 ${
              isOpen ? '-rotate-[135deg] opacity-100' : 'rotate-45'
            }`}
          ></span>
        </button>

        {isOpen && (
          <div className="absolute top-[calc(100%+4px)] left-0 min-w-full w-max max-w-[320px] bg-white border border-[#CBC9C4] shadow-[0_14px_32px_-8px_rgba(28,23,20,0.18)] z-50 py-1.5 rounded animate-in fade-in slide-in-from-top-1 duration-150">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 bg-transparent border-none font-sans text-[13.5px] text-[#3A322C] cursor-pointer text-left transition-colors hover:bg-[#F2EDE4] hover:text-[#1C1714] ${
                  opt === value ? 'bg-[#F2EDE4] text-[#1C1714] font-semibold' : ''
                }`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                <span>{opt}</span>
                {opt === value && <span className="text-[#9A4A2E] text-xs font-bold">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
