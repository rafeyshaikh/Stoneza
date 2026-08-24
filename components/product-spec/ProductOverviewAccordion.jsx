'use client';

import React from 'react';

export default function ProductOverviewAccordion({ overview }) {
  if (!overview) return null;

  const { description = '', specifyFor = '', steerElsewhereFor = '', howItReads = {} } = overview;

  const renderDescription = () => {
    if (!description) return null;

    // If description is HTML (contains tags like <p>, <div>, <br>, <strong>, etc.)
    if (typeof description === 'string' && /<[a-z][\s\S]*>/i.test(description)) {
      return (
        <div
          className="font-sans text-[15px] leading-[1.75] text-[#3A322C] space-y-3 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      );
    }

    // If description is an array
    if (Array.isArray(description)) {
      return (
        <div className="space-y-3">
          {description.map((p, idx) => (
            <p key={idx} className="font-sans text-[15px] leading-[1.75] text-[#3A322C]">
              {p}
            </p>
          ))}
        </div>
      );
    }

    // If description is a plain string with newlines
    if (typeof description === 'string') {
      const paragraphs = description.split(/\n\n+/).filter(Boolean);
      return (
        <div className="space-y-3">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="font-sans text-[15px] leading-[1.75] text-[#3A322C]">
              {p}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <details className="group border-b border-[#CBC9C4]" open>
      <summary className="list-none cursor-pointer py-5 sm:py-6 flex items-center gap-4 select-none [&::-webkit-details-marker]:hidden">
        <h3 className="font-serif font-normal text-xl sm:text-2xl text-[#1C1714] flex-1 group-open:font-semibold">
          Product overview
        </h3>
        <span className="font-heading text-[10px] tracking-[0.12em] font-semibold text-[#78716C] uppercase flex-none select-none">
          Read
        </span>
        <i className="flex-none w-2.5 h-2.5 border-r-[1.5px] border-b-[1.5px] border-[#1C1714] rotate-45 -mt-1 transition-transform duration-200 group-open:rotate-[225deg] group-open:mt-1 pointer-events-none"></i>
      </summary>
      <div className="pb-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-12 items-start">
          <div className="space-y-3">
            {renderDescription()}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 border-t border-[#1C1714] lg:border-t-0 lg:border-l lg:border-[#CBC9C4] lg:pl-10 pt-4 lg:pt-0">
            {specifyFor && (
              <div className="pb-4 border-b border-black/10 sm:border-b-0">
                <h4 className="font-heading text-[9.5px] font-bold tracking-[0.16em] uppercase text-[#9A4A2E] mb-2">
                  Specify it for
                </h4>
                <p className="font-sans text-sm leading-[1.68] text-[#3A322C]">{specifyFor}</p>
              </div>
            )}
            {steerElsewhereFor && (
              <div>
                <h4 className="font-heading text-[9.5px] font-bold tracking-[0.16em] uppercase text-[#9A4A2E] mb-2">
                  We would steer you elsewhere for
                </h4>
                <p className="font-sans text-sm leading-[1.68] text-[#3A322C]">{steerElsewhereFor}</p>
              </div>
            )}
          </div>
        </div>

        <h4 className="font-heading text-xs font-bold tracking-[0.12em] uppercase text-[#9A4A2E] mt-6 mb-2.5">
          How it reads
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-[#1C1714] mt-1.5">
          <div className="py-3.5 sm:pr-4 border-b sm:border-b-0 border-[#CBC9C4]">
            <h5 className="font-heading text-[9px] font-bold tracking-[0.16em] uppercase text-[#9A4A2E] mb-1.5">
              At a distance
            </h5>
            <p className="font-sans text-[13.5px] leading-relaxed text-[#3A322C]">
              {howItReads.atDistance}
            </p>
          </div>
          <div className="py-3.5 sm:px-4 border-b sm:border-b-0 border-[#CBC9C4] sm:border-l sm:border-[#CBC9C4]">
            <h5 className="font-heading text-[9px] font-bold tracking-[0.16em] uppercase text-[#9A4A2E] mb-1.5">
              Close up
            </h5>
            <p className="font-sans text-[13.5px] leading-relaxed text-[#3A322C]">
              {howItReads.closeUp}
            </p>
          </div>
          <div className="py-3.5 sm:pr-4 lg:px-4 border-b lg:border-b-0 border-[#CBC9C4] lg:border-l lg:border-[#CBC9C4]">
            <h5 className="font-heading text-[9px] font-bold tracking-[0.16em] uppercase text-[#9A4A2E] mb-1.5">
              Through the day
            </h5>
            <p className="font-sans text-[13.5px] leading-relaxed text-[#3A322C]">
              {howItReads.throughDay}
            </p>
          </div>
          <div className="py-3.5 sm:pl-4 border-[#CBC9C4] sm:border-l sm:border-[#CBC9C4]">
            <h5 className="font-heading text-[9px] font-bold tracking-[0.16em] uppercase text-[#9A4A2E] mb-1.5">
              When wet
            </h5>
            <p className="font-sans text-[13.5px] leading-relaxed text-[#3A322C]">
              {howItReads.whenWet}
            </p>
          </div>
        </div>
      </div>
    </details>
  );
}
