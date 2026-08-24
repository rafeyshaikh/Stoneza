import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import Category from "@/models/Category.model";
import Product from "@/models/Product.model";
import { unstable_cache } from "next/cache";

const getCachedPublicCategories = unstable_cache(
  async () => {
    await connectDB();

    const categories = await Category.find({ isActive: true })
      .sort({
        categoryLevel: 1,
        sortOrder: 1,
        createdAt: 1,
      })
      .lean();

    let productCountMap = {};
    try {
      const counts = await Product.aggregate([
        { $match: { status: "published" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]);
      counts.forEach((item) => {
        if (item._id) {
          productCountMap[item._id.toString()] = item.count;
        }
      });
    } catch (err) {
      console.error("Error aggregating product counts in public API:", err);
    }

    const map = {};

    categories.forEach((category) => {
      map[category._id.toString()] = {
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        categoryLevel: category.categoryLevel,
        sortOrder: category.sortOrder,
        createdAt: category.createdAt,
        productCount: productCountMap[category._id.toString()] || 0,
        squareBanner: category.bannerImage?.square || {
          url: "",
          publicId: "",
        },
        wideBanner: category.bannerImage?.wide?.url
          ? category.bannerImage.wide
          : Array.isArray(category.bannerImage?.wide) && category.bannerImage.wide[0]
          ? category.bannerImage.wide[0]
          : { url: "", publicId: "" },
        parentCategory: category.parentCategory?.toString() || null,
        children: [],
      };
    });

    const tree = [];

    categories.forEach((category) => {
      const current = map[category._id.toString()];
      if (current.parentCategory) {
        const parent = map[current.parentCategory];
        if (parent) {
          parent.children.push(current);
        }
      } else {
        tree.push(current);
      }
    });

    return tree;
  },
  ["public-categories-cache"],
  {
    revalidate: 86400, // 24 hours fallback
    tags: ["public-categories"],
  }
);

export async function GET() {
  try {
    const tree = await getCachedPublicCategories();
    return response(true, 200, "Categories fetched successfully", tree);
  } catch (error) {
    console.error("Public categories error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
