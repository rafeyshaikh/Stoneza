'use client';

import React from 'react';

export default function ProductTechnicalAccordion({ product }) {
  if (!product) return null;

  const { name, sku, collectionName, stoneDetails = {} } = product;

  return (
    <details className="group border-b border-[#CBC9C4]">
      <summary className="list-none cursor-pointer py-5 sm:py-6 flex items-center gap-4 select-none [&::-webkit-details-marker]:hidden">
        <h3 className="font-serif font-normal text-xl sm:text-2xl text-[#1C1714] flex-1 group-open:font-semibold">
          Technical data sheet
        </h3>
        <span className="font-heading text-[10px] tracking-[0.12em] font-semibold text-[#78716C] uppercase flex-none select-none">
          18 values
        </span>
        <i className="flex-none w-2.5 h-2.5 border-r-[1.5px] border-b-[1.5px] border-[#1C1714] rotate-45 -mt-1 transition-transform duration-200 group-open:rotate-[225deg] group-open:mt-1 pointer-events-none"></i>
      </summary>
      <div className="pb-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-t border-[#1C1714]">
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Product</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{name} — {collectionName || 'Stonefield'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Spec code</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top"><strong>{sku}</strong></td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Trade name</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.tradeName || 'N/A'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Stone type</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.stoneType || 'Natural stone'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Piece size</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.pieceSize || 'Random'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Calibrated thickness</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.calibratedThickness || 'N/A'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Face texture</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.faceTexture || 'N/A'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Edges</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.edges || 'N/A'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Product form</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.productForm || 'N/A'}</td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-t border-[#1C1714] md:border-t-0">
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Weight</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.weightPerSqM || 'N/A'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Water absorption</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.waterAbsorption || 'N/A'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Density</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.density || 'N/A'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Weather resistance</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.weatherResistance || 'N/A'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Blend</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.blend || 'Pre-blended, fixed ratio'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Joint</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.joint || 'N/A'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Corner pieces</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.cornerPieces || 'On request'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Sealing</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.sealerRequirement || 'N/A'}</td>
              </tr>
              <tr>
                <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">Lead time</td>
                <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">{stoneDetails.leadTime || 'In stock / 2–6 weeks'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </details>
  );
}
