"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import StickyEnquiryNow from "@/components/product/StickyEnquiryNow";
import EnquiryForm from "@/components/common/EnquiryForm";

export default function ProductDetailClient({ productData }) {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  const activeProduct = {
    name: productData.name,
    slug: productData.slug,
    price: productData.price || null,
    sku: productData.sku || "N/A",
    shortDescription: productData.shortDescription || "",
    description: productData.description || "",
    stoneDetails: productData.stoneDetails || {},
    specifications: productData.specifications || [],
    shippingInfo:
      productData.shippingInfo ||
      "Delivery within 7–10 business days. Installation support available.",
    careInstructions:
      productData.careInstructions ||
      "Clean with neutral stone cleansers. Seal periodically.",
    images: productData.images?.length
      ? productData.images.map((img) => img.url)
      : ["/assets/placeholder.jpg"],
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: activeProduct.name },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productData.seo?.metaTitle || activeProduct.name,
    "image": productData.seo?.ogImage ? [productData.seo.ogImage] : activeProduct.images,
    "description": productData.seo?.metaDescription || activeProduct.shortDescription || activeProduct.description?.replace(/<[^>]*>/g, "")?.slice(0, 160) || "Premium natural stone product from Stoneza.",
    "sku": activeProduct.sku,
    "brand": {
      "@type": "Brand",
      "name": "Stoneza",
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": activeProduct.price || "0",
      "availability": "https://schema.org/InStock",
      "url": productData.seo?.canonicalUrl || `https://stoneza.in/products/${activeProduct.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="py-10 bg-[#EAE8E2]">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <ProductGallery images={activeProduct.images} />

            <ProductInfo
              product={activeProduct}
              onEnquireClick={() => setShowEnquiryModal(true)}
            />
          </div>
        </div>
      </section>

      {/* Product Details Specs & Shipping */}
      <ProductTabs
        product={activeProduct}
        onEnquireClick={() => setShowEnquiryModal(true)}
      />

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1613]/80 backdrop-blur-md overflow-y-auto">
          {/* Backdrop Click Closes */}
          <div
            className="absolute inset-0"
            onClick={() => setShowEnquiryModal(false)}
          />

          <div className="relative bg-[#28221D] border border-[#4A413A] rounded-lg max-w-[600px] w-full p-6 md:p-8 z-10 shadow-2xl transition-all duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowEnquiryModal(false)}
              className="absolute top-4 right-4 text-[#8A7F73] hover:text-[#EDE8E1] transition-colors cursor-pointer"
            >
              <X className="size-6" />
            </button>

            <div className="mb-6">
              <h3 className="font-serif text-2xl text-[#F5F1EA]">
                Request Quote & Info
              </h3>
              <p className="text-sm text-[#B7AC9E] mt-2">
                Fill in the details below. A Stoneza consultant will contact you
                with pricing, lead times and material samples.
              </p>
            </div>

            <EnquiryForm
              compact
              initialStoneType={activeProduct.name}
            />
          </div>
        </div>
      )}

      <StickyEnquiryNow product={activeProduct} />
    </>
  );
}
