import { notFound } from "next/navigation";
import { connectDB } from "@/lib/databaseConnection";
import Product from "@/models/Product.model";
import Category from "@/models/Category.model";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    await connectDB();
    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return {
        title: "Product Not Found | Stoneza",
        description: "The requested stone product could not be found.",
      };
    }

    const title = product.seo?.metaTitle?.trim() || `${product.name} | Stoneza`;
    const description =
      product.seo?.metaDescription?.trim() ||
      product.shortDescription?.trim() ||
      (product.description?.replace(/<[^>]*>/g, "")?.slice(0, 160)?.trim() ||
        "Explore premium natural stone products from Stoneza.");

    const ogImage =
      product.seo?.ogImage?.trim() ||
      (product.images?.length ? product.images[0].url : "");

    const canonicalUrl =
      product.seo?.canonicalUrl?.trim() ||
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/product/${slug}`;

    const keywords =
      product.seo?.keywords?.length
        ? product.seo.keywords
        : product.tags || [];

    return {
      title,
      description,
      keywords: keywords.join(", "),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        images: ogImage ? [{ url: ogImage }] : [],
        url: canonicalUrl,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    return {
      title: "Product | Stoneza",
      description: "Explore premium natural stone products from Stoneza.",
    };
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  let safeProduct = null;

  try {
    await connectDB();
    const product = await Product.findOne({ slug })
      .populate({
        path: "category",
        populate: { path: "parentCategory" },
      })
      .lean();

    if (product) {
      const categoryObj = product.category;
      let categoryName = "Category";
      let parentCategoryName = "";

      let relatedProductsRaw = [];
      let relatedCategoriesRaw = [];

      if (categoryObj) {
        categoryName = categoryObj.name || "Category";

        // 1. Fetch products of the SAME category
        relatedProductsRaw = await Product.find({
          category: categoryObj._id,
          status: "published",
        })
          .select("name slug images stoneDetails price")
          .limit(16)
          .lean();

        // 2. Fetch related categories (sibling categories under same parent or level)
        if (categoryObj.parentCategory) {
          parentCategoryName = categoryObj.parentCategory.name || "";
          relatedCategoriesRaw = await Category.find({
            parentCategory: categoryObj.parentCategory._id,
            isActive: true,
          })
            .select("name slug categoryLevel bannerImage description")
            .limit(12)
            .lean();
        } else {
          relatedCategoriesRaw = await Category.find({
            categoryLevel: categoryObj.categoryLevel || 1,
            isActive: true,
          })
            .select("name slug categoryLevel bannerImage description")
            .limit(12)
            .lean();
        }
      }

      // Fallback if no same category products found
      if (relatedProductsRaw.length === 0) {
        relatedProductsRaw = await Product.find({ status: "published" })
          .select("name slug images stoneDetails price")
          .limit(12)
          .lean();
      }

      // Format Track 1 items: Products of the same category
      const relatedProducts = relatedProductsRaw.map((p) => ({
        title: p.name,
        subtitle: p.stoneDetails?.stoneType || p.stoneDetails?.faceTexture || "Natural Stone",
        href: `/product/${p.slug}`,
        imageUrl: p.images?.[0]?.url || "",
        bg: "#FAF8F5",
        isCurrent: p.slug === product.slug,
      }));

      // Format Track 2 items: Related categories
      const relatedCategories = relatedCategoriesRaw.map((c) => ({
        title: c.name,
        subtitle: c.description || "Category",
        href: `/product-category/${c.slug}`,
        imageUrl:
          c.bannerImage?.square?.url ||
          (Array.isArray(c.bannerImage?.wide) && c.bannerImage.wide[0]?.url) ||
          "",
        bg: "#FAF8F5",
        isCurrent: categoryObj && c._id.toString() === categoryObj._id.toString(),
      }));

      safeProduct = JSON.parse(
        JSON.stringify({
          ...product,
          categoryName,
          parentCategoryName,
          relatedProducts,
          relatedCategories,
        })
      );
    }
  } catch (error) {
    console.error("ProductDetailPage error:", error.message);
  }

  if (!safeProduct) {
    notFound();
  }

  return <ProductDetailClient productData={safeProduct} />;
}
