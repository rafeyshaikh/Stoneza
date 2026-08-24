'use client';

import React from 'react';
import SpecSelect from './SpecSelect';
import { COMPANY_INFO } from '@/lib/constants';

export default function ProductHeroInfo({ product, specOptions, specs, handleSpecChange }) {
  if (!product) return null;

  const {
    name = '',
    sku = '',
    shortDescription = '',
    collectionName = '',
    categoryName = '',
    collectionSlug = '',
    categorySlug = '',
    stoneDetails = {},
  } = product;

  // Accurate collection derivation (D-05)
  const skuUpper = (sku || '').toUpperCase();
  const derivedCollection =
    collectionName && collectionName !== 'Stonefield'
      ? collectionName
      : skuUpper.startsWith('STZ-NM-')
      ? 'Nature Mosaic'
      : skuUpper.startsWith('STZ-CO-')
      ? 'CobbleCraft'
      : skuUpper.startsWith('STZ-FO-') || skuUpper.startsWith('STZ-FD-')
      ? 'Foundations'
      : skuUpper.startsWith('STZ-FA-')
      ? 'Facets & Finishes'
      : skuUpper.startsWith('STZ-SW-')
      ? 'StoneWeave'
      : skuUpper.startsWith('STZ-FL-')
      ? 'Flagstone'
      : skuUpper.startsWith('STZ-STP-')
      ? 'Steps & Coping'
      : skuUpper.startsWith('STZ-ST-')
      ? 'Stonefield'
      : collectionName || '';

  const eyebrowElements = [];
  if (derivedCollection) eyebrowElements.push({ label: `${derivedCollection} Collection`, href: collectionSlug ? `/collections/${collectionSlug}` : '/collections' });
  if (categoryName) eyebrowElements.push({ label: categoryName, href: categorySlug ? `/product-category/${categorySlug}` : '/collections' });
  if (sku) eyebrowElements.push({ label: `SKU: ${sku}` });

  return (
    <div className="product-hero-info">
      {eyebrowElements.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#78716C]">
          {eyebrowElements.map((el, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-[#CBC9C4]">·</span>}
              {el.href ? (
                <a href={el.href} className="hover:text-[#9A4A2E] transition-colors">{el.label}</a>
              ) : (
                <span>{el.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1714] font-normal leading-tight tracking-tight mb-2">
        {name}
      </h1>

      <p className="font-heading text-xs uppercase tracking-[0.14em] text-[#78716C] mb-4">
        {[stoneDetails.stoneType, stoneDetails.tradeName, stoneDetails.faceTexture]
          .filter(Boolean)
          .join(' · ')}
      </p>

      <p className="font-serif italic text-lg leading-relaxed mb-6 pl-3.5 border-l-2 border-[#9A4A2E] text-[#3A322C]">
        {shortDescription}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 mb-6 border-t border-[#1C1714]">
        {specOptions.map((item) => (
          <SpecSelect
            key={item.key || item.name}
            label={item.label || item.name}
            value={specs[item.key || item.name.toLowerCase()]}
            options={item.options}
            onChange={(val) => handleSpecChange(item.key || item.name.toLowerCase(), val)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2.5 mb-5">
        <a
          className="font-heading text-[11px] font-bold tracking-[0.15em] uppercase text-white bg-[#1C1714] hover:bg-[#25D366] px-6 py-3.5 rounded flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 transition-all duration-200 shadow-sm no-underline"
          href={`${COMPANY_INFO.whatsappUrl}?text=${encodeURIComponent(`Hi Stoneza, I'd like a quote for ${name}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire on WhatsApp
        </a>
        <a
          className="font-heading text-[11px] font-bold tracking-[0.15em] uppercase text-[#1C1714] bg-white border border-[#CBC9C4] hover:border-[#1C1714] hover:bg-[#F2EDE4] px-6 py-3.5 rounded flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 transition-all duration-200 no-underline"
          href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(`${name} — sample request`)}`}
        >
          Request a sample
        </a>
      </div>

      <div className="grid grid-cols-3 border-y border-[#CBC9C4] divide-x divide-[#CBC9C4] text-center">
        <div className="px-2 py-3">
          <b className="block font-serif text-[13.5px] font-semibold text-[#1C1714] mb-0.5">Quarry-direct</b>
          <span className="font-heading text-[8.5px] tracking-[0.14em] uppercase text-[#78716C] font-semibold">No middlemen</span>
        </div>
        <div className="px-2 py-3">
          <b className="block font-serif text-[13.5px] font-semibold text-[#1C1714] mb-0.5">Pan-India</b>
          <span className="font-heading text-[8.5px] tracking-[0.14em] uppercase text-[#78716C] font-semibold">Insured delivery</span>
        </div>
        <div className="px-2 py-3">
          <b className="block font-serif text-[13.5px] font-semibold text-[#1C1714] mb-0.5">Custom</b>
          <span className="font-heading text-[8.5px] tracking-[0.14em] uppercase text-[#78716C] font-semibold">Sizes &amp; finishes</span>
        </div>
      </div>
    </div>
  );
}
