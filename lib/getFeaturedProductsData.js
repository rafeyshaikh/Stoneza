import { connectDB } from "./databaseConnection.js";
import Product from "@/models/Product.model.js";
import Category from "@/models/Category.model.js";
import Collection from "@/models/Collection.model.js";

export async function getFeaturedProductsData() {
  try {
    await connectDB();

    // Query STRICTLY products where status is published AND isFeatured is true
    const products = await Product.find({ status: "published", isFeatured: true })
      .populate("category", "name slug")
      .populate("collection", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    if (!products || products.length === 0) {
      return [];
    }

    return products.map((p) => {
      const stoneType = p.stoneDetails?.stoneType || p.category?.name || "Natural Stone";
      
      let finishCount = 0;
      if (Array.isArray(p.variants) && p.variants.length > 0) {
        finishCount = p.variants.reduce((acc, v) => acc + (v.options?.length || 1), 0);
      }

      const metaSuffix = finishCount > 0
        ? `${finishCount} FINISHES`
        : p.stoneDetails?.productForm || p.category?.name || "SIGNATURE STONE";

      const categoryMeta = `${stoneType.toUpperCase()} · ${metaSuffix.toUpperCase()}`;
      const primaryImage = p.images?.[0]?.url || p.hoverImage?.url || "/placeholder-stone.jpg";

      return {
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        categoryMeta,
        href: `/products/${p.slug}`,
        image: primaryImage,
      };
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}
