import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import ProductForm from "@/components/admin/products/ProductForm";

import { connectDB } from "@/lib/databaseConnection";

import Product from "@/models/Product.model";
import Category from "@/models/Category.model";

export default async function EditProductPage({ params }) {
  await connectDB();

  const { id } = await params;

  const product = await Product.findOne({
    _id: id,
  }).lean();

  if (!product) {
    notFound();
  }

  const finalCategory = await Category.findById(product.category)
    .populate("parentCategory")
    .lean();

  let level1 = "";
  let level2 = "";
  let level3 = "";

  if (finalCategory) {
    if (finalCategory.categoryLevel === 1) {
      level1 = finalCategory._id.toString();
    }

    if (finalCategory.categoryLevel === 2) {
      level2 = finalCategory._id.toString();
      level1 = finalCategory.parentCategory?._id?.toString() || "";
    }

    if (finalCategory.categoryLevel === 3) {
      level3 = finalCategory._id.toString();

      level2 = finalCategory.parentCategory?._id?.toString() || "";

      if (finalCategory.parentCategory?.parentCategory) {
        const level2Category = await Category.findById(
          finalCategory.parentCategory._id,
        )
          .populate({
            path: "parentCategory",
            populate: {
              path: "parentCategory",
            },
          })
          .lean();

        level1 = level2Category?.parentCategory?._id?.toString() || "";
      }
    }
  }

  const categories = (
    await Category.find({
      isActive: true,
    })
      .select("name categoryLevel parentCategory")
      .sort({ name: 1 })
      .lean()
  ).map((category) => ({
    _id: category._id.toString(),
    name: category.name,
    parentCategory: category.parentCategory
    ? category.parentCategory.toString()
    : null,
  }));

  const safeProduct = JSON.parse(
    JSON.stringify({
      ...product,
      categoryLevel1: level1,
      categoryLevel2: level2,
      categoryLevel3: level3,
    }),
  );

  return (
    <>
      <Breadcrumbs />

      <PageHeader
        title="Edit Product"
        description="Update product details and media."
      />

      <ProductForm categories={categories} initialData={safeProduct} isEdit />
    </>
  );
}