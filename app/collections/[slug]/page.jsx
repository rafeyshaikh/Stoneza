import { notFound } from "next/navigation";
import { getCategoryDetails } from "@/lib/getCategoryDetails";
import CollectionPageClient from "./CollectionPageClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getCategoryDetails(slug);

  if (!data || !data.category) {
    return {
      title: "Collection Not Found | Stoneza",
      description: "The requested stone collection could not be found.",
    };
  }

  const category = data.category;

  // Load SEO from category schema or fallback to details
  const title = category.seo?.metaTitle?.trim() || `${category.name} Collection | Stoneza`;
  const description =
    category.seo?.metaDescription?.trim() ||
    (category.description?.replace(/<[^>]*>/g, "")?.slice(0, 160)?.trim() ||
      `Explore our premium ${category.name} collection of natural stones at Stoneza.`);

  const ogImage =
    category.seo?.ogImage?.trim() ||
    (category.bannerImage?.square?.url ||
      category.bannerImage?.wide?.[0]?.url ||
      "");

  const canonicalUrl =
    category.seo?.canonicalUrl?.trim() ||
    `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/collections/${slug}`;

  const keywords = category.seo?.keywords || [];

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

export default async function CollectionPage({ params }) {
  const { slug } = await params;
  const data = await getCategoryDetails(slug);

  if (!data) {
    notFound();
  }

  const safeData = JSON.parse(JSON.stringify(data));

  return <CollectionPageClient initialData={safeData} slug={slug} />;
}
