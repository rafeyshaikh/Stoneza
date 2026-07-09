import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import Category from "@/models/Category.model";
import { connectDB } from "@/lib/databaseConnection";

export const dynamic = "force-dynamic";


export default async function NewCategoryPage() {
  await connectDB();
  const parentCategories = (
    await Category.find({
      categoryLevel: {
        $lt: 3,
      },
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
