import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import ProductTable from "@/components/admin/products/ProductTable";

import Product from "@/models/Product.model";
import Category from "@/models/Category.model";

import { connectDB } from "@/lib/databaseConnection";

export default async function AdminProductsPage() {
  await connectDB();
  const products = await Product.find({}).populate("category", "name").sort({ createdAt: -1 }).lean();
  const categories = await Category.find({ categoryLevel: 3 }).sort({ sortOrder: 1, createdAt: -1 }).lean();

  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Products" description="Manage products, stock, variants, and SEO metadata." actionLabel="Add Product" onAction="/admin/products/new"/>
      <ProductTable products={JSON.parse(JSON.stringify(products))} categories={JSON.parse(JSON.stringify(categories))} />
    </>
  );
}
