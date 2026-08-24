'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProductHeroGallery from '@/components/product-spec/ProductHeroGallery';
import ProductHeroInfo from '@/components/product-spec/ProductHeroInfo';
import ProductOverviewAccordion from '@/components/product-spec/ProductOverviewAccordion';
import ProductTechnicalAccordion from '@/components/product-spec/ProductTechnicalAccordion';
import ProductFaqAccordion from '@/components/product-spec/ProductFaqAccordion';
import ProductBrowseTrack from '@/components/product-spec/ProductBrowseTrack';
import ProductStickyFooter from '@/components/product-spec/ProductStickyFooter';
import { getPlaceholderImage } from '@/lib/placeholderImage';

export default function ProductDetailClient({ productData }) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const heroRef = useRef(null);
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);
  const [t1PrevDisabled, setT1PrevDisabled] = useState(true);
  const [t1NextDisabled, setT1NextDisabled] = useState(false);
  const [t2PrevDisabled, setT2PrevDisabled] = useState(true);
  const [t2NextDisabled, setT2NextDisabled] = useState(false);

  // De-duplicate images array (D-10)
  const rawImages = productData.images && productData.images.length > 0 ? productData.images : [];
  const seenUrls = new Set();
  const deduplicatedImages = [];
  rawImages.forEach((img, idx) => {
    const url = typeof img === 'string' ? img : img?.url || '';
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      deduplicatedImages.push(
        typeof img === 'string'
          ? { url: img, bg: '#FAF8F5' }
          : { url: img.url || getPlaceholderImage(productData.name, idx), bg: img.bg || '#FAF8F5', caption: img.caption || '' }
      );
    }
  });

  const normalizedImages =
    deduplicatedImages.length > 0
      ? deduplicatedImages
      : [{ url: getPlaceholderImage(productData.name || "Stoneza Product"), bg: '#FAF8F5' }];

  // Clean description fallback (D-06)
  const rawDescription =
    productData.shortDescription ||
    productData.overview?.description ||
    productData.description ||
    `${productData.name} — premium ${productData.stoneDetails?.stoneType || 'natural stone'} calibrated for demanding architectural applications.`;

  // Clean "Specify it for" (D-11)
  let specifyFor = productData.overview?.specifyFor || '';
  const finishText = productData.stoneDetails?.installationMethod || '';
  if (
    specifyFor.startsWith('Grip when wet') ||
    specifyFor.startsWith('Hand-laid character with the laying speed') ||
    (finishText && specifyFor === finishText)
  ) {
    specifyFor =
      productData.stoneDetails?.application && productData.stoneDetails.application.length > 0
        ? productData.stoneDetails.application.join(', ')
        : 'Interior and exterior architectural applications.';
  }

  // Derive variants dynamically to guarantee 100% sync with TDS (D-01, D-02)
  let activeVariants = [];
  if (productData.variants && productData.variants.length > 0) {
    activeVariants = productData.variants.map((v) => ({
      name: v.name,
      label: v.name,
      key: v.key || v.name.toLowerCase().replace(/\s+/g, '-'),
      options: v.options && v.options.length > 0 ? v.options : ['Standard'],
      defaultOption: v.options && v.options.length > 0 ? v.options[0] : 'Standard',
    }));
  } else {
    // Dynamic fallback matching stoneDetails exactly
    const sd = productData.stoneDetails || {};
    if (sd.calibratedThickness) {
      activeVariants.push({
        name: 'Thickness',
        label: 'Thickness',
        key: 'thickness',
        options: sd.calibratedThickness.split('|').map((s) => s.trim()).filter(Boolean),
      });
    }
    if (sd.pieceSize) {
      activeVariants.push({
        name: 'Size',
        label: 'Size',
        key: 'size',
        options: sd.pieceSize.split('|').map((s) => s.trim()).filter(Boolean),
      });
    }
    if (sd.faceTexture || sd.productForm) {
      activeVariants.push({
        name: 'Finish',
        label: 'Finish',
        key: 'finish',
        options: (sd.faceTexture || sd.productForm).split('|').map((s) => s.trim()).filter(Boolean),
      });
    }
    if (sd.edges) {
      activeVariants.push({
        name: 'Edges',
        label: 'Edges',
        key: 'edges',
        options: sd.edges.split('|').map((s) => s.trim()).filter(Boolean),
      });
    }
  }

  // Normalize full product data with safe fallbacks matching Product schema
  const product = {
    ...productData,
    images: normalizedImages,
    variants: activeVariants,
    overview: {
      description: rawDescription,
      specifyFor,
      steerElsewhereFor:
        productData.overview?.steerElsewhereFor ||
        'Applications requiring non-standard structural tolerances without quarry consultation.',
      howItReads: productData.overview?.howItReads || {
        atDistance: 'Monolithic texture with soft tonal variation across elevation.',
        closeUp: 'Rich organic surface relief and tactile natural stone grain.',
        throughDay: 'Shifting micro-shadows under changing natural directional light.',
        whenWet: 'Deeper color contrast highlighting subtle natural undertones.',
      },
    },
    faqs:
      productData.faqs && productData.faqs.length > 0
        ? productData.faqs
        : [
            {
              question: `What is the lead time for ${productData.name}?`,
              answer: `Standard stock items ship within 3–7 business days. Custom piece sizes or quarry production runs require 2–4 weeks.`,
            },
            {
              question: `Is sealing required for ${productData.name}?`,
              answer: `We recommend applying a breathable penetrating sealer after installation to preserve color integrity.`,
            },
          ],
  };

  // Initialize specs state dynamically from activeVariants
  const [specs, setSpecs] = useState(() => {
    const initial = {};
    if (activeVariants.length > 0) {
      activeVariants.forEach((v) => {
        initial[v.key || v.name.toLowerCase()] = v.defaultOption || v.options[0];
      });
    }
    return initial;
  });

  const handleSpecChange = (key, value) => {
    setSpecs((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setShowSticky(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateTrackState = (track, setPrev, setNext) => {
    if (!track) return;
    setPrev(track.scrollLeft < 6);
    setNext(track.scrollLeft + track.clientWidth >= track.scrollWidth - 6);
  };

  useEffect(() => {
    const t1 = track1Ref.current;
    const t2 = track2Ref.current;

    const onScroll1 = () => updateTrackState(t1, setT1PrevDisabled, setT1NextDisabled);
    const onScroll2 = () => updateTrackState(t2, setT2PrevDisabled, setT2NextDisabled);

    if (t1) {
      t1.addEventListener('scroll', onScroll1, { passive: true });
      updateTrackState(t1, setT1PrevDisabled, setT1NextDisabled);
    }
    if (t2) {
      t2.addEventListener('scroll', onScroll2, { passive: true });
      updateTrackState(t2, setT2PrevDisabled, setT2NextDisabled);
    }

    const onResize = () => {
      updateTrackState(t1, setT1PrevDisabled, setT1NextDisabled);
      updateTrackState(t2, setT2PrevDisabled, setT2NextDisabled);
    };

    window.addEventListener('resize', onResize);

    return () => {
      if (t1) t1.removeEventListener('scroll', onScroll1);
      if (t2) t2.removeEventListener('scroll', onScroll2);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const scrollTrack = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.75;
      ref.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Structured SEO JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productData.seo?.metaTitle || product.name,
    image: productData.seo?.ogImage ? [productData.seo.ogImage] : product.images.map((i) => i.url),
    description:
      productData.seo?.metaDescription ||
      product.shortDescription ||
      'Premium natural stone product from Stoneza.',
    sku: product.sku || product.skuCode || 'N/A',
    brand: {
      '@type': 'Brand',
      name: 'Stoneza',
    },
  };

  return (
    <div className="bg-[#EAE8E2] text-[#1C1714] font-sans antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="border-b border-[#CBC9C4] bg-[#EAE8E2]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-16 py-4 font-heading text-[11px] tracking-[0.12em] uppercase text-[#78716C] font-medium flex flex-wrap items-center gap-1.5">
          <a href="/" className="text-[#78716C] no-underline transition-colors hover:text-[#1C1714]">
            Home
          </a>
          <span>/</span>
          <a href="/product" className="text-[#78716C] no-underline transition-colors hover:text-[#1C1714]">
            Products
          </a>
          {product.categoryName && (
            <>
              <span>/</span>
              <a
                href={product.categorySlug ? `/product-category/${product.categorySlug}` : "/product"}
                className="text-[#78716C] no-underline transition-colors hover:text-[#1C1714]"
              >
                {product.categoryName}
              </a>
            </>
          )}
          {product.collectionName && (
            <>
              <span>/</span>
              <a
                href={product.collectionSlug ? `/collections/${product.collectionSlug}` : "/collections"}
                className="text-[#78716C] no-underline transition-colors hover:text-[#1C1714]"
              >
                {product.collectionName}
              </a>
            </>
          )}
          <span>/</span>
          <span className="text-[#1C1714] font-semibold">{product.name}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-6 sm:py-9 lg:py-12 bg-[#EAE8E2]" ref={heroRef}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,1.12fr)_minmax(320px,1fr)] gap-7 lg:gap-18 items-start">
            <ProductHeroGallery
              slides={product.images}
              activeThumb={activeThumb}
              setActiveThumb={setActiveThumb}
            />
            <ProductHeroInfo
              product={product}
              specOptions={product.variants || []}
              specs={specs}
              handleSpecChange={handleSpecChange}
            />
          </div>
        </div>
      </section>

      {/* Accordions Section */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="border-t-2 border-[#1C1714] bg-[#EAE8E2]">
          <ProductOverviewAccordion overview={product.overview} />
          <ProductTechnicalAccordion product={product} />
          <ProductFaqAccordion faqs={product.faqs} />
        </div>
      </div>

      {/* Browse Track 1: Products of the same collection / category */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <ProductBrowseTrack
          title={`Browse more in ${product.collectionName || product.categoryName || 'Collection'}`}
          countLabel={`${product.relatedProducts.length} items`}
          trackRef={track1Ref}
          prevDisabled={t1PrevDisabled}
          nextDisabled={t1NextDisabled}
          scrollTrack={scrollTrack}
          items={product.relatedProducts}
        />
      )}

      {/* Browse Track 2: Related Categories */}
      {product.relatedCategories && product.relatedCategories.length > 0 && (
        <ProductBrowseTrack
          title={product.parentCategoryName ? `More in ${product.parentCategoryName}` : 'Related Categories'}
          countLabel={`${product.relatedCategories.length} categories`}
          trackRef={track2Ref}
          prevDisabled={t2PrevDisabled}
          nextDisabled={t2NextDisabled}
          scrollTrack={scrollTrack}
          items={product.relatedCategories}
        />
      )}

      {/* CTA Section */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-8 py-8 divide-y divide-stone-300/40">
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
            <a
              className="h-12 px-8 bg-[#c8a980] hover:bg-white text-[#1c1714] text-xs tracking-[3px] font-bold uppercase transition-all duration-300 rounded shadow-md inline-flex items-center justify-center no-underline"
              href={`https://wa.me/917877108154?text=${encodeURIComponent(`Hi Stoneza, I'd like a quote for ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Request a Quote
            </a>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Bar */}
      <ProductStickyFooter
        showSticky={showSticky}
        productName={product.name}
        priceLabel={product.priceLabel || 'Price on request • ex-factory'}
      />
    </div>
  );
}
