import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import ProductForm from "@/components/admin/products/ProductForm";

import { connectDB } from "@/lib/databaseConnection";

import Product from "@/models/Product.model";
import Category from "@/models/Category.model";
import Collection from "@/models/Collection.model";

export const dynamic = "force-dynamic";


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

  let colLevel1 = "";
  let colLevel2 = "";

  if (product.collection) {
    const finalCol = await Collection.findById(product.collection)
      .populate("parentCollection")
      .lean();

    if (finalCol) {
      if (finalCol.collectionLevel === 1) {
        colLevel1 = finalCol._id.toString();
      } else if (finalCol.collectionLevel === 2) {
        colLevel2 = finalCol._id.toString();
        colLevel1 = finalCol.parentCollection?._id?.toString() || "";
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

  const collections = (
    await Collection.find({
      isActive: true,
    })
      .select("name collectionLevel parentCollection")
      .sort({ name: 1 })
      .lean()
  ).map((col) => ({
    _id: col._id.toString(),
    name: col.name,
    collectionLevel: col.collectionLevel,
    parentCollection: col.parentCollection
      ? col.parentCollection.toString()
      : null,
  }));

  const safeProduct = JSON.parse(
    JSON.stringify({
      ...product,
      categoryLevel1: level1,
      categoryLevel2: level2,
      categoryLevel3: level3,
      collectionLevel1: colLevel1,
      collectionLevel2: colLevel2,
    }),
  );

  return (
    <>
      <Breadcrumbs />

      <PageHeader
        title="Edit Product"
        description="Update product details and media."
      />

      <ProductForm categories={categories} collections={collections} initialData={safeProduct} isEdit />
    </>
  );
}