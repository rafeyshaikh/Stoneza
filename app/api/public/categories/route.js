import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import { PUBLIC_CACHE_HEADERS } from "@/lib/cacheHeaders";

import Category from "@/models/Category.model";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({
      deletedAt: null,
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

    return response(
        true,
        200, 
        "Categories fetched successfully", 
        tree, 
        {
            /** To be used in the future if we want to cache the response for public categories
        {
            headers: PUBLIC_CACHE_HEADERS,
        }
         */
        }
    );
  } catch (error) {
    console.error("Public categories error:", error);

    return response(false, 500, "Internal Server Error");
  }
}
