import { connectDB } from "@/lib/databaseConnection";
import Product from "@/models/Product.model";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";
import Seo from "@/models/Seo.model";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    await connectDB();
    const seo = await Seo.findOne().lean();
    const baseDomain = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://stoneza.in";
    return {
      title: `All Products | ${seo?.metaTitle || "Stoneza"}`,
      description: seo?.metaDescription || "Explore our premium collection of natural stones, cladding, tiles, and outdoor features.",
      alternates: {
        canonical: `${baseDomain}/product`,
      },
      openGraph: {
        title: `All Products | ${seo?.metaTitle || "Stoneza"}`,
        description: seo?.metaDescription || "Explore our premium collection of natural stones, cladding, tiles, and outdoor features.",
        images: seo?.ogImage ? [{ url: seo.ogImage }] : [],
      },
    };
  } catch {
    return {
      title: "All Products | Stoneza",
      description: "Explore our premium collection of natural stones, cladding, tiles, and outdoor features.",
    };
  }
}

export default async function ProductsPage() {
  let safeProducts = [];
  try {
    await connectDB();
    const products = await Product.find({ status: "published" }).lean();
    safeProducts = JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("ProductsPage error:", error.message);
  }

  return <ProductsClient products={safeProducts} />;
}
