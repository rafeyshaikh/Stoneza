'use client';

import React from 'react';

function isValidValue(val) {
  if (val === null || val === undefined) return false;
  const str = String(val).trim();
  if (!str) return false;
  const lower = str.toLowerCase();
  if (
    lower === 'n/a' ||
    lower === '—' ||
    lower === '-' ||
    lower === 'not applicable' ||
    lower === 'none' ||
    lower === 'null' ||
    lower === 'undefined'
  ) {
    return false;
  }
  return true;
}

function deriveCollectionFromSku(sku = '') {
  const upper = sku.toUpperCase();
  if (upper.startsWith('STZ-NM-')) return 'Nature Mosaic';
  if (upper.startsWith('STZ-CO-')) return 'CobbleCraft';
  if (upper.startsWith('STZ-ST-')) return 'Stonefield';
  if (upper.startsWith('STZ-FO-') || upper.startsWith('STZ-FD-')) return 'Foundations';
  if (upper.startsWith('STZ-FA-')) return 'Facets & Finishes';
  if (upper.startsWith('STZ-SW-')) return 'StoneWeave';
  if (upper.startsWith('STZ-FL-')) return 'Flagstone';
  if (upper.startsWith('STZ-STP-')) return 'Steps & Coping';
  return '';
}

export default function ProductTechnicalAccordion({ product }) {
  if (!product) return null;

  const { name, sku = '', collectionName: rawCollectionName, stoneDetails = {} } = product;
  const collectionName =
    rawCollectionName && rawCollectionName !== 'Stonefield'
      ? rawCollectionName
      : deriveCollectionFromSku(sku) || rawCollectionName || '';

  // Density formatting (D-09)
  let densityFormatted = '';
  if (isValidValue(stoneDetails.density)) {
    const dStr = String(stoneDetails.density).trim();
    densityFormatted = dStr.toLowerCase().includes('kg') ? dStr : `${dStr} kg/m³`;
  }

  // Weight formatting (D-03)
  let weightFormatted = '';
  if (isValidValue(stoneDetails.weightPerSqM)) {
    let wStr = String(stoneDetails.weightPerSqM).trim();
    if (wStr.includes('85110')) {
      wStr = '85–110 kg/m²';
    }
    weightFormatted = wStr;
  }

  // Define left and right column fields
  const leftFields = [
    { label: 'Product', value: `${name}${collectionName ? ` — ${collectionName}` : ''}` },
    { label: 'SKU', value: sku ? <strong>{sku}</strong> : null, raw: sku },
    { label: 'Trade name', value: stoneDetails.tradeName, raw: stoneDetails.tradeName },
    { label: 'Stone type', value: stoneDetails.stoneType, raw: stoneDetails.stoneType },
    { label: 'Piece size', value: stoneDetails.pieceSize, raw: stoneDetails.pieceSize },
    { label: 'Calibrated thickness', value: stoneDetails.calibratedThickness, raw: stoneDetails.calibratedThickness },
    { label: 'Face texture', value: stoneDetails.faceTexture, raw: stoneDetails.faceTexture },
    { label: 'Edges', value: stoneDetails.edges, raw: stoneDetails.edges },
    { label: 'Product form', value: stoneDetails.productForm, raw: stoneDetails.productForm },
  ].filter((f) => isValidValue(f.raw !== undefined ? f.raw : f.value));

  const rightFields = [
    { label: 'Weight', value: weightFormatted, raw: weightFormatted },
    { label: 'Water absorption', value: stoneDetails.waterAbsorption, raw: stoneDetails.waterAbsorption },
    { label: 'Density', value: densityFormatted, raw: densityFormatted },
    { label: 'Weather resistance', value: stoneDetails.weatherResistance, raw: stoneDetails.weatherResistance },
    { label: 'Blend', value: stoneDetails.blend, raw: stoneDetails.blend },
    { label: 'Joint', value: stoneDetails.joint, raw: stoneDetails.joint },
    { label: 'Corner pieces', value: stoneDetails.cornerPieces, raw: stoneDetails.cornerPieces },
    { label: 'Sealing', value: stoneDetails.sealerRequirement, raw: stoneDetails.sealerRequirement },
    { label: 'Lead time', value: stoneDetails.leadTime, raw: stoneDetails.leadTime },
  ].filter((f) => isValidValue(f.raw !== undefined ? f.raw : f.value));

  const totalValues = leftFields.length + rightFields.length;

  return (
    <details className="group border-b border-[#CBC9C4]" open={false}>
      <summary className="list-none cursor-pointer py-5 sm:py-6 flex items-center gap-4 select-none [&::-webkit-details-marker]:hidden">
        <h3 className="font-serif font-normal text-xl sm:text-2xl text-[#1C1714] flex-1 group-open:font-semibold">
          Technical data sheet
        </h3>
        <span className="font-heading text-[10px] tracking-[0.12em] font-semibold text-[#78716C] uppercase flex-none select-none">
          {totalValues} values
        </span>
        <i className="flex-none w-2.5 h-2.5 border-r-[1.5px] border-b-[1.5px] border-[#1C1714] rotate-45 -mt-1 transition-transform duration-200 group-open:rotate-[225deg] group-open:mt-1 pointer-events-none"></i>
      </summary>
      <div className="pb-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          {leftFields.length > 0 && (
            <table className="w-full border-collapse">
              <tbody>
                {leftFields.map((field, idx) => (
                  <tr key={idx} className={idx === 0 ? 'border-t border-[#1C1714]' : ''}>
                    <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">
                      {field.label}
                    </td>
                    <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">
                      {field.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {rightFields.length > 0 && (
            <table className="w-full border-collapse">
              <tbody>
                {rightFields.map((field, idx) => (
                  <tr key={idx} className={idx === 0 ? 'border-t border-[#1C1714] md:border-t-0' : ''}>
                    <td className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase text-[#78716C] w-[46%] pr-3 py-2.5 border-b border-[#CBC9C4] align-top">
                      {field.label}
                    </td>
                    <td className="font-sans text-sm text-[#1C1714] text-right py-2.5 border-b border-[#CBC9C4] align-top">
                      {field.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </details>
  );
}
