import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import Category from "@/models/Category.model";
import { connectDB } from "@/lib/databaseConnection";

export default async function NewCategoryPage() {
  await connectDB();
  const parentCategories = (
    await Category.find({ deletedAt: null })
      .select("name sortOrder parentCategory")
      .populate("parentCategory", "name")
      .sort({ sortOrder: 1 })
      .lean()
  ).map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
    sortOrder: cat.sortOrder,
    parentCategory: cat.parentCategory
      ? { ...cat.parentCategory, _id: cat.parentCategory._id.toString() }
      : null,
  }));

  return (
    <>
      <Breadcrumbs />
      <PageHeader
        title="Add Category"
        description="Create category hierarchy, image, and SEO settings."
      />
      <CategoryForm parentCategories={parentCategories} />
    </>
  );
}
