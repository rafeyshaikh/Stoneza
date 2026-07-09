import { connectDB } from "@/lib/databaseConnection";
import { getDescendantCategoryIds } from "@/lib/getDescendantCategoryIds";
import Category from "@/models/Category.model";
import Product from "@/models/Product.model";

/**
 * Server-side helper to fetch category details, sub-categories,
 * and associated products directly from the database.
 */
export async function getCategoryDetails(slug) {
  try {
    await connectDB();

    const category = await Category.findOne({
       slug,
       isActive: true,
     }).lean();

    if (!category) {
      return null;
    }

    const subCategories = (
      await Category.find({
        parentCategory: category._id,
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
      _id: item._id.toString(),
      name: item.name,
      slug: item.slug,
      squareBanner: item.bannerImage?.square || null,
    }));

    const categoryIds = await getDescendantCategoryIds(category._id);

    const filter = {
      status: "published",
      category: {
        $in: categoryIds,
      },
    };

    const products = await Product.find(filter)
      .select(`
        name
        slug
        images
        hoverImage
        isFeatured
        isBestSeller
        isNewArrival
        category
        price
      `)
      .populate("category", "_id name slug categoryLevel")
      .sort({ createdAt: -1 })
      .lean();

    const items = products.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      thumbnail: product.images?.length ? product.images[0] : null,
      hoverImage: product.hoverImage || null,
      category: {
        _id: product.category?._id?.toString(),
        name: product.category?.name,
        slug: product.category?.slug,
        categoryLevel: product.category?.categoryLevel,
      },
      price: product.price || null,
      badges: [
        ...(product.isFeatured ? ["Featured"] : []),
        ...(product.isBestSeller ? ["Best Seller"] : []),
        ...(product.isNewArrival ? ["New Arrival"] : []),
      ],
    }));

    return {
      category: {
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description,
        bannerImage: category.bannerImage,
        categoryLevel: category.categoryLevel,
        seo: category.seo,
      },
      subCategories,
      products: items,
    };
  } catch (error) {
    console.error("getCategoryDetails error:", error);
    return null;
  }
}
