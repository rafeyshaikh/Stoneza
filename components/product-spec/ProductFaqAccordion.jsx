'use client';

import React from 'react';

function cleanFaqText(text = '') {
  if (!text) return '';
  return text
    .replace(/85110\s*kg\s*per\s*sq\s*ft/gi, '85–110 kg/m²')
    .replace(/85110\s*kg\/sqft/gi, '85–110 kg/m²')
    .replace(/85110/g, '85–110')
    .replace(/at approximately — kg per sq ft\.?/gi, 'per project requirement.')
    .replace(/at approximately N\/A kg per sq ft\.?/gi, 'per project requirement.')
    .replace(/approximately —/gi, 'standard packaging');
}

export default function ProductFaqAccordion({ faqs = [] }) {
  const validFaqs = (faqs || [])
    .filter((f) => f && f.question && f.answer)
    .map((f) => ({
      question: cleanFaqText(f.question),
      answer: cleanFaqText(f.answer),
    }));

  if (validFaqs.length === 0) return null;

  return (
    <details className="group border-b border-[#CBC9C4]">
      <summary className="list-none cursor-pointer py-5 sm:py-6 flex items-center gap-4 select-none [&::-webkit-details-marker]:hidden">
        <h3 className="font-serif font-normal text-xl sm:text-2xl text-[#1C1714] flex-1 group-open:font-semibold">
          Questions
        </h3>
        <span className="font-heading text-[10px] tracking-[0.12em] font-semibold text-[#78716C] uppercase flex-none select-none">
          {validFaqs.length} answers
        </span>
        <i className="flex-none w-2.5 h-2.5 border-r-[1.5px] border-b-[1.5px] border-[#1C1714] rotate-45 -mt-1 transition-transform duration-200 group-open:rotate-[225deg] group-open:mt-1 pointer-events-none"></i>
      </summary>
      <div className="pb-8 w-full">
        <div className="divide-y divide-[#CBC9C4]">
          {validFaqs.map((faq, idx) => (
            <details key={idx} className="group/faq border-b border-[#CBC9C4] last:border-b-0">
              <summary className="cursor-pointer py-4 flex items-baseline justify-between gap-3.5 font-sans text-base font-semibold text-[#1C1714] list-none select-none [&::-webkit-details-marker]:hidden after:content-['+'] group-open/faq:after:content-['–'] after:font-heading after:text-[#78716C] after:font-semibold after:ml-auto">
                {faq.question}
              </summary>
              <div className="pb-4.5 max-w-[66ch]">
                {faq.answer.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="font-sans text-[14.5px] leading-relaxed text-[#3A322C] mb-2.5 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </details>
  );
}
