import { connectDB } from "@/lib/databaseConnection";
import Product from "@/models/Product.model";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";

import Seo from "@/models/Seo.model";

export async function generateMetadata() {
  await connectDB();
  const seo = await Seo.findOne().lean();
  const baseDomain = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://stoneza.in";
  return {
    title: `All Products | ${seo?.metaTitle || "Stoneza"}`,
    description: seo?.metaDescription || "Explore our premium collection of natural stones, cladding, tiles, and outdoor features.",
    alternates: {
      canonical: `${baseDomain}/products`,
    },
    openGraph: {
      title: `All Products | ${seo?.metaTitle || "Stoneza"}`,
      description: seo?.metaDescription || "Explore our premium collection of natural stones, cladding, tiles, and outdoor features.",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : [],
    },
  };
}

export default async function ProductsPage() {
  await connectDB();
  const products = await Product.find({ status: "published" }).lean();

  const safeProducts = JSON.parse(JSON.stringify(products));

  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[#EAE8E2] flex items-center justify-center font-heading text-[#6a6a6a] uppercase tracking-[3px] text-[12px]">Loading Products...</div>}>
      <ProductsClient products={safeProducts} />
    </Suspense>
  );
}
