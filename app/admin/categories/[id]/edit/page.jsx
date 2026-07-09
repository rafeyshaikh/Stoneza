import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import CategoryForm from "@/components/admin/categories/CategoryForm";

import { connectDB } from "@/lib/databaseConnection";
import Category from "@/models/Category.model";

export const dynamic = "force-dynamic";


export default async function EditCategoryPage({ params }) {
  await connectDB();

  const { id } = await params;

  const category = await Category.findOne({
    _id: id,
  }).lean();

  if (!category) {
    notFound();
  }

  const parentCategories = (
    await Category.find({
      categoryLevel: { $lt: 3 },
      _id: { $ne: id },
    })
      .select("name sortOrder parentCategory categoryLevel")
      .populate("parentCategory", "name categoryLevel")
      .sort({
        categoryLevel: 1,
        sortOrder: 1,
        createdAt: 1,
      })
      .lean()
  ).map((cat) => ({
    _id: cat._id.toString(),

    name: cat.name,

    categoryLevel: cat.categoryLevel,

    sortOrder: cat.sortOrder,

    parentCategory: cat.parentCategory
      ? {
          ...cat.parentCategory,
          _id: cat.parentCategory._id.toString(),
        }
      : null,
  }));

  const safeCategory = {
    ...category,

    _id: category._id.toString(),

    parentCategory: category.parentCategory
      ? category.parentCategory.toString()
      : "none",
  };

  return (
    <>
      <Breadcrumbs />

      <PageHeader
        title="Edit Category"
        description="Update category information and banners."
      />

      <CategoryForm
        parentCategories={parentCategories}
        initialData={safeCategory}
        isEdit
      />
    </>
  );
}