import Category from "@/models/Category.model";

export async function getDescendantCategoryIds(categoryId) {
  const ids = [categoryId];

  const children = await Category.find({
    parentCategory: categoryId,
    isActive: true,
  }).select("_id");

  for (const child of children) {
    ids.push(
      ...(await getDescendantCategoryIds(child._id))
    );
  }

  return ids;
}