import { connectDB } from "@/lib/databaseConnection";
import Category from "@/models/Category.model";
import { unstable_cache } from "next/cache";

/**
 * Server-side helper to fetch and normalize categories directly from database.
 * Wrapped in unstable_cache for optimal performance and instant header page loads.
 */
export const getCategoriesForLayout = unstable_cache(
  async () => {
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
          squareBanner: category.bannerImage?.square || {
            url: "",
            publicId: "",
          },
          wideBanners: category.bannerImage?.wide || [],
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

      // Normalize for the header and layout consumption
      const normalized = tree.map((cat) => ({
        title: cat.name,
        slug: cat.slug,
        squareImage: cat.squareBanner?.url || "",
        categories: cat.children?.map((sub) => ({
          title: sub.name,
          slug: sub.slug,
          squareImage: sub.squareBanner?.url || "",
          links: sub.children?.map((third) => ({
            name: third.name,
            slug: third.slug
          })) || []
        })) || [],
        images: (cat.wideBanners && cat.wideBanners.length > 0)
          ? cat.wideBanners.slice(0, 2).map((img) => ({
            title: "",
            image: img.url
          }))
          : (cat.squareBanner?.url ? [
            {
              title: "",
              image: cat.squareBanner.url
            }
          ] : [])
      }));

      return normalized;
    } catch (error) {
      console.error("getCategoriesForLayout error:", error);
      return [];
    }
  },
  ["layout-categories-cache"],
  {
    revalidate: 86400, // Cache for 24 hours fallback
    tags: ["layout-categories"],
  }
);
