import { notFound } from "next/navigation";
import { getCategoryDetails } from "@/lib/getCategoryDetails";
import CategoryPageClient from "./CategoryPageClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getCategoryDetails(slug);

  if (!data || !data.category) {
    return {
      title: "Category Not Found | Stoneza",
      description: "The requested stone category could not be found.",
    };
  }

  const category = data.category;

  // Load SEO from category schema or fallback to details
  const title =
    category.seo?.metaTitle?.trim() ||
    `${category.name} — Natural Stone`;

  const description =
    category.seo?.metaDescription?.trim() ||
    category.description?.replace(/<[^>]*>/g, "")?.trim() ||
    `Explore quarry-direct ${category.name} natural stone surfaces by Stoneza. Premium calibrated cladding, paving, and architectural slabs.`;

  const ogImage =
    category.seo?.ogImage?.trim() ||
    category.bannerImage?.square?.url ||
    category.bannerImage?.wide?.url ||
    (Array.isArray(category.bannerImage?.wide) ? category.bannerImage.wide[0]?.url : "") ||
    "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png";

  const canonicalUrl =
    category.seo?.canonicalUrl?.trim() ||
    `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/product-category/${slug}`;

  const keywords = category.seo?.keywords || [
    category.name,
    "natural stone",
    "stone manufacturer",
    "architectural stone",
    "Stoneza",
  ];

  return {
    title,
    description,
    keywords: Array.isArray(keywords) ? keywords.join(", ") : keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : [],
      url: canonicalUrl,
      siteName: "Stoneza",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const data = await getCategoryDetails(slug);

  if (!data) {
    notFound();
  }

  const safeData = JSON.parse(JSON.stringify(data));

  return <CategoryPageClient initialData={safeData} slug={slug} />;
}
