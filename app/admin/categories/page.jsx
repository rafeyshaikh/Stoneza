import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import CategoryTable from "@/components/admin/categories/CategoryTable";

import Category from "@/models/Category.model";
import { connectDB } from "@/lib/databaseConnection";

export default async function AdminCategoriesPage() {
  await connectDB();
  const categories = await Category.find({ deletedAt: null }).populate("parentCategory", "name").sort({ sortOrder: 1 }).lean();

  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Categories" description="Manage nested categories, featured collections, and category SEO." actionLabel="Add Category" onAction="/admin/categories/new" />
      <CategoryTable categories={JSON.parse(JSON.stringify(categories))} />
    </>
  );
}

function addCategory() {
  window.location.href = "/admin/categories/new";
}