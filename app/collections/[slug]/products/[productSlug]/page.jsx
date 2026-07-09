import { notFound } from "next/navigation";
import { connectDB } from "@/lib/databaseConnection";
import Product from "@/models/Product.model";
import Category from "@/models/Category.model"; // Ensure Category model is loaded for populate
import CollectionProductDetailClient from "./CollectionProductDetailClient";

export async function generateMetadata({ params }) {
  const { slug, productSlug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug: productSlug, deletedAt: null }).lean();

  if (!product) {
    return {
      title: "Product Not Found | Stoneza",
      description: "The requested stone product could not be found.",
    };
  }

  // Load SEO from product schema or fallback to details
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
    `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/collections/${slug}/products/${productSlug}`;

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
}

export default async function ProductPage({ params }) {
  const { productSlug } = await params;
  await connectDB();

  const product = await Product.findOne({
    slug: productSlug,
    deletedAt: null,
  })
    .populate("category", "name slug")
    .lean();

  if (!product) {
    notFound();
  }

  // Serialize to pass to client component safely
  const safeProduct = JSON.parse(JSON.stringify(product));

  return <CollectionProductDetailClient productData={safeProduct} />;
}
