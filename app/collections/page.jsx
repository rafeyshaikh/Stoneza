import { Suspense } from "react";
import { getCollectionsOverviewData } from "@/lib/getCollectionsOverviewData";
import CollectionsOverviewClient from "@/components/collections/CollectionsOverviewClient";
import Seo from "@/models/Seo.model";
import Pages from "@/models/Pages.model";
import { connectDB } from "@/lib/databaseConnection";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    await connectDB();
    const [pagesDoc, seoDoc] = await Promise.all([
      Pages.findOne().select("collectionsOverview").lean(),
      Seo.findOne().lean(),
    ]);

    const cmsOverview = pagesDoc?.collectionsOverview;
    const baseDomain =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://stoneza.in";

    const collectionsSeo = cmsOverview?.seo;

    const title =
      collectionsSeo?.metaTitle?.trim() ||
      (cmsOverview?.title
        ? `${cmsOverview.title} — Natural Stone Series`
        : "Natural Stone Collections");

    const description =
      collectionsSeo?.metaDescription?.trim() ||
      cmsOverview?.description ||
      seoDoc?.metaDescription ||
      "Explore Stoneza's named collections of natural stone, paving, facade cladding, and landscape surfaces.";

    const ogImage =
      collectionsSeo?.ogImage?.trim() ||
      cmsOverview?.bannerImage?.square?.url ||
      cmsOverview?.bannerImage?.wide?.[0]?.url ||
      seoDoc?.ogImage ||
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png";

    const canonicalUrl = "https://stoneza.in/collections";

    const keywords =
      collectionsSeo?.keywords?.trim() ||
      "natural stone collections, stone paving, wall cladding, landscape stone";

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        images: ogImage ? [{ url: ogImage }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch (error) {
    console.error("Collections generateMetadata error:", error);
    return {
      title: "Collections | Stoneza",
      description: "Explore our premium named collections of architectural natural stone.",
    };
  }
}

export default async function CollectionsPage() {
  let data = null;

  try {
    data = await getCollectionsOverviewData();
  } catch (error) {
    console.error("CollectionsPage error:", error);
  }

  const safeData = data ? JSON.parse(JSON.stringify(data)) : null;

  return <CollectionsOverviewClient data={safeData} />;
}
