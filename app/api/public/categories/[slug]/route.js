import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import { getDescendantCategoryIds } from "@/lib/getDescendantCategoryIds";

import Category from "@/models/Category.model";
import Product from "@/models/Product.model";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const { searchParams } = new URL(request.url);

    const page = Math.max(
      1,
      Number(searchParams.get("page")) || 1
    );

    const limit = Math.min(
      48,
      Math.max(1, Number(searchParams.get("limit")) || 12)
    );

    const search = searchParams.get("search")?.trim() || "";

    const sort = searchParams.get("sort") || "newest";

    const category = await Category.findOne({
      slug,
      deletedAt: null,
      isActive: true,
    }).lean();

    if (!category) {
      return response(false, 404, "Category not found");
    }

    const subCategories = (
      await Category.find({
        parentCategory: category._id,
        deletedAt: null,
        isActive: true,
      })
        .select(`
          name
          slug
          bannerImage
          sortOrder
        `)
        .sort({
          sortOrder: 1,
          createdAt: 1,
        })
        .lean()
    ).map((item) => ({
      _id: item._id,

      name: item.name,

      slug: item.slug,

      squareBanner: item.bannerImage?.square || null,
    }));

    const categoryIds = await getDescendantCategoryIds(category._id);

    const filter = {
      deletedAt: null,
      status: "published",

      category: {
        $in: categoryIds,
      },
    };

    if (search) {
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

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select(`
          name
          slug
          images
          hoverImage

          isFeatured
          isBestSeller
          isNewArrival

          category
        `)
        .populate(
          "category",
          "_id name slug"
        )
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

      thumbnail: product.images?.length
        ? product.images[0]
        : null,

      hoverImage: product.hoverImage || null,

      category: product.category,

      badges: [
        ...(product.isFeatured ? ["Featured"] : []),
        ...(product.isBestSeller ? ["Best Seller"] : []),
        ...(product.isNewArrival ? ["New Arrival"] : []),
      ],
    }));

    const totalPages = Math.ceil(total / limit);

    return response(
      true,
      200,
      "Category fetched successfully",
      {
        category: {
          _id: category._id,

          name: category.name,

          slug: category.slug,

          description: category.description,

          bannerImage: category.bannerImage,

          seo: category.seo,
        },

        subCategories,

        products: items,

        pagination: {
          page,

          limit,

          total,

          totalPages,

          hasNextPage: page < totalPages,

          hasPreviousPage: page > 1,

          nextPage:
            page < totalPages
              ? page + 1
              : null,

          previousPage:
            page > 1
              ? page - 1
              : null,
        },

        filters: {
          search,

          sort,
        },
      }
    );
  } catch (error) {
    console.error("Public category error:", error);

    return response(
      false,
      500,
      "Internal Server Error"
    );
  }
}