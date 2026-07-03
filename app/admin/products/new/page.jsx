// app/admin/products/new/page.jsx

import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import ProductForm from "@/components/admin/products/ProductForm";

import Category from "@/models/Category.model";
import { connectDB } from "@/lib/databaseConnection";

export default async function NewProductPage() {
  await connectDB();

  const categories = await Category.find({
    deletedAt: null,
  })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  const safeCategories = JSON.parse(JSON.stringify(categories));

  return (
    <>
      <Breadcrumbs />

      <PageHeader
        title="Add Product"
        description="Create a new product with images and SEO details."
      />

      <ProductForm categories={safeCategories} />
    </>
  );
}