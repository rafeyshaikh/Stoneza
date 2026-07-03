import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import ProductTable from "@/components/admin/products/ProductTable";

import Product from "@/models/Product.model";
import { connectDB } from "@/lib/databaseConnection";

export default async function AdminProductsPage() {
  await connectDB();
  const products = await Product.find({ deletedAt: null }).populate("category", "name").sort({ createdAt: -1 }).lean();

  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Products" description="Manage products, stock, variants, and SEO metadata." actionLabel="Add Product" onAction="/admin/products/new"/>
      <ProductTable products={JSON.parse(JSON.stringify(products))} />
    </>
  );
}
