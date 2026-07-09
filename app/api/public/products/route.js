import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import { getDescendantCategoryIds } from "@/lib/getDescendantCategoryIds";

import Product from "@/models/Product.model";
import Category from "@/models/Category.model";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    const limit = Math.min(
      48,
      Math.max(1, Number(searchParams.get("limit")) || 12),
    );

    const search = searchParams.get("search") || "";
    const categorySlug = searchParams.get("category")?.trim() || "";
    const sort = searchParams.get("sort") || "newest";

    const featured = searchParams.get("featured") === "true";
    const bestSeller = searchParams.get("bestSeller") === "true";
    const newArrival = searchParams.get("newArrival") === "true";

    const filter = {
      status: "published",
    };

    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
        {
          shortDescription: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (featured) {
      filter.isFeatured = true;
    }

    if (bestSeller) {
      filter.isBestSeller = true;
    }

    if (newArrival) {
      filter.isNewArrival = true;
    }

    // Category Filter (Supports Parent Categories)
    if (categorySlug) {
      const category = await Category.findOne({
        slug: categorySlug,
        isActive: true,
      });

      if (!category) {
        return response(false, 404, "Category not found");
      }

      const categoryIds = await getDescendantCategoryIds(category._id);

      filter.category = {
        $in: categoryIds,
      };
    }

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "name-a-z":
        sortOption = {
          name: 1,
        };
        break;

      case "name-z-a":
        sortOption = {
          name: -1,
        };
        break;
        
      case "featured":
        sortOption = {
          isFeatured: -1,
          isBestSeller: -1,
          createdAt: -1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select(
          `
          name
          slug
          images
          hoverImage
          isFeatured
          isBestSeller
          isNewArrival
          category
          price
        `,
        )
        .populate("category", "_id name slug categoryLevel")
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Product.countDocuments(filter),
    ]);

    const items = products.map((product) => ({
      _id: product._id,

      name: product.name,

      slug: product.slug,

      thumbnail: product.images?.length ? product.images[0] : null,

      hoverImage: product.hoverImage || null,

      category: product.category,

      price: product.price || null,

      badges: [
        ...(product.isFeatured ? ["Featured"] : []),
        ...(product.isBestSeller ? ["Best Seller"] : []),
        ...(product.isNewArrival ? ["New Arrival"] : []),
      ],
    }));

    const totalPages = Math.ceil(total / limit);

    return response(true, 200, "Products fetched successfully", {
      items,

      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      },
      filters: {
        search,
        category: categorySlug,
        sort,
        featured,
        bestSeller,
        newArrival,
      },
    });
  } catch (error) {
    console.error("Public products error:", error);

    return response(false, 500, "Internal Server Error");
  }
}
