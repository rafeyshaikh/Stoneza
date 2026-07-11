import { connectDB } from "@/lib/databaseConnection";
import Product from "@/models/Product.model";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";

export const metadata = {
  title: "All Products | Stoneza",
  description: "Explore our premium collection of natural stones, cladding, tiles, and outdoor features.",
  alternates: {
    canonical: "https://stoneza.in/products",
  },
};

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
