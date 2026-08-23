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

    const title =
      cmsOverview?.title
        ? `${cmsOverview.title} | ${seoDoc?.metaTitle || "Stoneza"}`
        : `Natural Stone Collections | ${seoDoc?.metaTitle || "Stoneza"}`;

    const description =
      cmsOverview?.description ||
      seoDoc?.metaDescription ||
      "Explore Stoneza's named collections of natural stone, paving, facade cladding, and landscape surfaces.";

    const ogImage =
      cmsOverview?.bannerImage?.square?.url ||
      cmsOverview?.bannerImage?.wide?.[0]?.url ||
      seoDoc?.ogImage ||
      "";

    const canonicalUrl = `${baseDomain}/collections`;

    return {
      title,
      description,
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

  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-[#EAE8E2] flex items-center justify-center font-heading text-[#78716C] uppercase tracking-[3px] text-[12px]">
          Loading Stoneza Collections...
        </div>
      }
    >
      <CollectionsOverviewClient data={safeData} />
    </Suspense>
  );
}
