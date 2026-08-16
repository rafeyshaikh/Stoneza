import { connectDB } from "@/lib/databaseConnection";
import Category from "@/models/Category.model";
import Product from "@/models/Product.model";
import { unstable_cache } from "next/cache";

/**
 * Internal cached helper to fetch and normalize categories and product counts from database.
 */
const fetchCategoriesCached = unstable_cache(
  async () => {
    await connectDB();

    // 1. Fetch all active categories
    const categories = await Category.find({ isActive: true })
      .sort({
        categoryLevel: 1,
        sortOrder: 1,
        createdAt: 1,
      })
      .lean();

    // 2. Aggregate product counts per category
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
      console.error("Error aggregating product counts:", err);
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

    // Helper to calculate badge ("NEW" if created recently)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const normalized = tree.map((cat) => ({
      title: cat.name,
      slug: cat.slug,
      description: cat.description,
      squareImage: cat.squareBanner?.url || "",
      categories:
        cat.children?.map((sub) => ({
          title: sub.name,
          slug: sub.slug,
          subtitle: sub.description || "",
          links:
            sub.children?.map((third) => {
              const cnt = productCountMap[third._id];
              const isRecent = new Date(third.createdAt) > thirtyDaysAgo;
              return {
                name: third.name,
                slug: third.slug,
                count: cnt !== undefined ? String(cnt) : "–",
                badge: isRecent ? "NEW" : "",
                href: `/categories/${third.slug}`,
              };
            }) || [],
        })) || [],
      images:
        cat.wideBanners && cat.wideBanners.length > 0
          ? cat.wideBanners.slice(0, 2).map((img) => ({
              title: cat.name,
              image: img.url,
              href: `/categories/${cat.slug}`,
              description: cat.description || "Quarry-direct natural stone.",
            }))
          : cat.squareBanner?.url
          ? [
              {
                title: cat.name,
                image: cat.squareBanner.url,
                href: `/categories/${cat.slug}`,
                description: cat.description || "Quarry-direct natural stone.",
              },
            ]
          : [],
    }));

    return normalized;
  },
  ["layout-categories-cache"],
  {
    revalidate: 86400, // Cache for 24 hours fallback
    tags: ["layout-categories"],
  }
);

export const getCategoriesForLayout = async () => {
  try {
    return await fetchCategoriesCached();
  } catch (error) {
    console.error("getCategoriesForLayout error:", error);
    return [];
  }
};
