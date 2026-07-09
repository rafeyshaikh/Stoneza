import { connectDB } from "@/lib/databaseConnection";
import Product from "@/models/Product.model";
import ProductsClient from "./ProductsClient";

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

  return <ProductsClient products={safeProducts} />;
}
