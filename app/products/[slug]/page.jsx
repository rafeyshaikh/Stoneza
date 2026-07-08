"use client";

import { use, useState, useEffect } from "react";
import { X } from "lucide-react";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import StickyEnquiryNow from "@/components/product/StickyEnquiryNow";
import EnquiryForm from "@/components/common/EnquiryForm";

export default function ProductDetailPage({ params }) {
  const { slug } = use(params);

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/public/products/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProductData(data.data);
        }
      } catch (error) {
        console.error("Failed to load product from API:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  // Default Mock Product for fallbacks / previews
  const mockProduct = {
    name: "Travertine Stone Fountain",
    slug: "travertine-stone-fountain",
    price: 34999,
    sku: "STN-FNT-001",
    shortDescription:
      "A refined expression of elegance, this set features delicately illustrated floral motifs set against soft blue and blush pink tones, accented with intricate detailing. The graceful silhouettes and coordinated saucers create a harmonious visual appeal. Perfect for tea or coffee service, it adds a touch of timeless sophistication to elevated dining and intimate gatherings.",
    description: `
Crafted from premium natural travertine stone, this fountain brings
sophistication and tranquility to outdoor living spaces.

Every piece is handcrafted by skilled artisans, ensuring uniqueness
and timeless appeal.
  `,
    specifications: [
      { label: "Material", value: "Natural Travertine Stone" },
      { label: "Dimensions", value: "120 × 80 × 60 cm" },
      { label: "Weight", value: "85 kg" },
      { label: "Finish", value: "Polished" },
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

  const activeProduct = productData
    ? {
        name: productData.name,
        slug: productData.slug,
        price: productData.price || 0,
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
          : ["/assets/small_banners3/Small_Banner_1.webp"],
      }
    : mockProduct;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: activeProduct.name },
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#EAE8E2]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
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
    </>
  );
}
