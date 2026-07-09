import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import Category from "@/models/Category.model";
import { unstable_cache } from "next/cache";

const getCachedPublicCategories = unstable_cache(
  async () => {
    await connectDB();

    const categories = await Category.find({
      isActive: true,
    })
      .sort({
        categoryLevel: 1,
        sortOrder: 1,
        createdAt: 1,
      })
      .lean();

    const map = {};

    categories.forEach((category) => {
      map[category._id.toString()] = {
        _id: category._id.toString(),

        name: category.name,

        slug: category.slug,

        description: category.description,

        categoryLevel: category.categoryLevel,

        sortOrder: category.sortOrder,

        ...(category.categoryLevel === 1 && {
          squareBanner: category.bannerImage?.square || {
            url: "",
            publicId: "",
          },
          wideBanners: category.bannerImage?.wide || [],
        }),

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

    return response(
        true,
        200, 
        "Categories fetched successfully", 
        tree
    );
  } catch (error) {
    console.error("Public categories error:", error);

    return response(false, 500, "Internal Server Error");
  }
}
