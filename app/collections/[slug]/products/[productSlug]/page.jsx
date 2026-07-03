"use client";
import { use } from "react";

import Breadcrumbs from "@/components/product/Breadcrumbs";

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import StickyAddToCart from "@/components/product/StickyAddToCart";

export default function ProductPage({ params }) {
  const { productSlug } = use(params);
  const product = {
    name: productSlug,
    slug: "travertine-stone-fountain",

    price: 34999,
    discountPrice: 29999,

    sku: "STN-FNT-001",

    shortDescription:
      "Handcrafted natural travertine fountain designed to elevate luxury outdoor spaces with timeless elegance.",

    description: `
Crafted from premium natural travertine stone, this fountain brings
sophistication and tranquility to outdoor living spaces.

Every piece is handcrafted by skilled artisans, ensuring uniqueness
and timeless appeal.
  `,

    specifications: [
      {
        label: "Material",
        value: "Natural Travertine Stone",
      },
      {
        label: "Dimensions",
        value: "120 × 80 × 60 cm",
      },
      {
        label: "Weight",
        value: "85 kg",
      },
      {
        label: "Finish",
        value: "Polished",
      },
    ],

    shippingInfo:
      "Delivery within 7–10 business days across India. Installation support available in selected cities.",

    careInstructions:
      "Clean with a soft cloth and avoid harsh chemicals. Seal periodically for long-lasting beauty.",

    images: [
      "/assets/small_banners3/Small_Banner_1.webp",
      "/assets/small_banners3/Small_Banner_2.webp",
      "/assets/small_banners3/Small_Banner_3.webp",
      "/assets/small_banners3/Small_Banner_4.webp",
    ],
  };

  const breadcrumbs = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Collections",
      href: "/collections",
    },
    {
      label: "Fountains",
      href: "/collections/fountains",
    },
    {
      label: product.name,
    },
  ];

  const reviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      rating: 5,
      date: "15 Jun 2026",
      review:
        "Excellent craftsmanship and premium quality. The fountain looks stunning in our garden.",
    },
    {
      id: 2,
      name: "Priya Verma",
      rating: 4,
      date: "10 Jun 2026",
      review:
        "Beautiful natural stone finish. Delivery was smooth and packaging was excellent.",
    },
  ];

  const relatedProducts = [
    {
      id: 1,
      name: "Natural Stone Bench",
      slug: "natural-stone-bench",
      price: 18999,
      image: "/assets/products/product1.jpg",
    },
    {
      id: 2,
      name: "Outdoor Marble Fountain",
      slug: "outdoor-marble-fountain",
      price: 25999,
      image: "/assets/products/product2.jpg",
    },
    {
      id: 3,
      name: "Garden Stone Sculpture",
      slug: "garden-stone-sculpture",
      price: 14999,
      image: "/assets/products/product3.jpg",
    },
    {
      id: 4,
      name: "Poolside Travertine Tile",
      slug: "poolside-travertine-tile",
      price: 9999,
      image: "/assets/products/product4.jpg",
    },
  ];

  const recentlyViewed = [
    {
      id: 1,
      name: "Marble Garden Fountain",
      slug: "marble-garden-fountain",
      price: 24999,
      image: "/assets/products/product1.jpg",
    },
    {
      id: 2,
      name: "Natural Stone Bench",
      slug: "natural-stone-bench",
      price: 18999,
      image: "/assets/products/product2.jpg",
    },
    {
      id: 3,
      name: "Poolside Travertine Tiles",
      slug: "poolside-travertine-tiles",
      price: 9999,
      image: "/assets/products/product3.jpg",
    },
    {
      id: 4,
      name: "Handcrafted Stone Sculpture",
      slug: "stone-sculpture",
      price: 15999,
      image: "/assets/products/product4.jpg",
    },
  ];
  return (
    <>
      {/* Hero Section */}
      <section className="py-10">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <ProductGallery images={product.images} />

            <ProductInfo product={product} />
          </div>
        </div>
      </section>

      {/* Product Details */}
      <ProductTabs product={product} />

      {/* Reviews */}
      <ProductReviews reviews={reviews} />

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />

      {/* Recently Viewed */}
      <RecentlyViewed products={recentlyViewed} />

      {/* Mobile Sticky Add To Cart */}
      <StickyAddToCart product={product} quantity={1} />
    </>
  );
}
