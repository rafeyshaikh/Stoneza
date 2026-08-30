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
      wideBanner: item.bannerImage?.wide || null,
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
        stoneDetails
      `)
      .populate("category", "_id name slug categoryLevel")
      .sort({ createdAt: -1 })
      .lean();

    const items = products.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      images: product.images || [],
      thumbnail: product.images?.length ? product.images[0] : null,
      hoverImage: product.hoverImage || (product.images?.length > 1 ? product.images[1] : null),
      category: {
        _id: product.category?._id?.toString(),
        name: product.category?.name,
        slug: product.category?.slug,
        categoryLevel: product.category?.categoryLevel,
      },
      price: product.price || null,
      stoneDetails: product.stoneDetails || {},
      badges: [
        ...(product.isFeatured ? ["Featured"] : []),
        ...(product.isBestSeller ? ["Best Seller"] : []),
        ...(product.isNewArrival ? ["New Arrival"] : []),
      ],
    }));

    let parentCategory = null;
    let siblingCategories = [];

    if (category.categoryLevel === 3 && category.parentCategory) {
      parentCategory = await Category.findById(category.parentCategory)
        .select("name slug description bannerImage")
        .lean();

      const siblingDocs = await Category.find({
        parentCategory: category.parentCategory,
        _id: { $ne: category._id },
        isActive: true,
      })
        .select("name slug description bannerImage sortOrder createdAt")
        .sort({ sortOrder: 1, createdAt: 1 })
        .lean();

      if (siblingDocs.length > 0) {
        const siblingIds = siblingDocs.map((s) => s._id);

        const siblingProductCounts = await Product.aggregate([
          { $match: { category: { $in: siblingIds }, status: "published" } },
          { $group: { _id: "$category", count: { $sum: 1 } } },
        ]);

        const countMap = {};
        siblingProductCounts.forEach((c) => {
          if (c._id) countMap[c._id.toString()] = c.count;
        });

        // Also fetch first product image as fallback thumbnail
        const siblingProducts = await Product.find({
          category: { $in: siblingIds },
          status: "published",
          "images.0.url": { $exists: true },
        })
          .select("category images")
          .lean();

        const firstProdImageMap = {};
        siblingProducts.forEach((p) => {
          if (p.category && !firstProdImageMap[p.category.toString()]) {
            firstProdImageMap[p.category.toString()] = p.images[0]?.url;
          }
        });

        siblingCategories = siblingDocs.map((s) => ({
          _id: s._id.toString(),
          name: s.name,
          slug: s.slug,
          description: s.description || "",
          image:
            s.bannerImage?.square?.url ||
            s.bannerImage?.wide?.url ||
            (Array.isArray(s.bannerImage?.wide) ? s.bannerImage.wide[0]?.url : "") ||
            firstProdImageMap[s._id.toString()] ||
            "",
          productCount: countMap[s._id.toString()] || 0,
          href: `/product-category/${s.slug}`,
        }));
      }
    }

    return {
      category: {
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description,
        bannerImage: category.bannerImage,
        categoryLevel: category.categoryLevel,
        parentCategory: parentCategory
          ? {
              _id: parentCategory._id.toString(),
              name: parentCategory.name,
              slug: parentCategory.slug,
              description: parentCategory.description,
            }
          : null,
        seo: category.seo,
      },
      parentCategory: parentCategory
        ? {
            _id: parentCategory._id.toString(),
            name: parentCategory.name,
            slug: parentCategory.slug,
            description: parentCategory.description,
          }
        : null,
      siblingCategories,
      subCategories,
      products: items,
    };
  } catch (error) {
    console.error("getCategoryDetails error:", error);
    return null;
  }
}
