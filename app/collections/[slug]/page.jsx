import { notFound } from "next/navigation";
import { getCollectionDetails } from "@/lib/getCollectionDetails";
import CollectionPageClient from "./CollectionPageClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getCollectionDetails(slug);

  if (!data || !data.collection) {
    return {
      title: "Collection Not Found | Stoneza",
      description: "The requested stone collection could not be found.",
    };
  }

  const collection = data.collection;

  const title = collection.seo?.metaTitle?.trim() || `${collection.name} Collection | Stoneza`;
  const description =
    collection.seo?.metaDescription?.trim() ||
    (collection.description?.replace(/<[^>]*>/g, "")?.slice(0, 160)?.trim() ||
      `Explore our premium ${collection.name} collection of natural stones at Stoneza.`);

  const ogImage =
    collection.seo?.ogImage?.trim() ||
    (collection.bannerImage?.square?.url ||
      collection.bannerImage?.wide?.[0]?.url ||
      "");

  const canonicalUrl =
    collection.seo?.canonicalUrl?.trim() ||
    `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/collections/${slug}`;

  const keywords = collection.seo?.keywords || [];

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
  const data = await getCollectionDetails(slug);

  if (!data) {
    notFound();
  }

  const safeData = JSON.parse(JSON.stringify(data));

  return <CollectionPageClient initialData={safeData} slug={slug} />;
}
