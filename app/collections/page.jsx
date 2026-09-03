import { getCollectionsOverviewData } from "@/lib/getCollectionsOverviewData";
import CollectionsOverviewClient from "@/components/collections/CollectionsOverviewClient";
import Seo from "@/models/Seo.model";
import Pages from "@/models/Pages.model";
import { connectDB } from "@/lib/databaseConnection";
import { resolveEntityMetadata } from "@/lib/seo/resolveMetadata";
import { resolveStructuredData } from "@/lib/seo/schemaGenerator";
import JsonLd from "@/components/common/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    await connectDB();
    const [pagesDoc, seoDoc] = await Promise.all([
      Pages.findOne().select("collectionsOverview").lean(),
      Seo.findOne().lean(),
    ]);

    const cmsOverview = pagesDoc?.collectionsOverview;

    return resolveEntityMetadata({
      entityType: "page",
      entity: cmsOverview,
      seo: cmsOverview?.seo,
      path: "/collections",
      globalSeo: seoDoc,
      defaultTitle: "Natural Stone Collections",
      defaultDescription: "Explore Stoneza's named collections of natural stone, paving, facade cladding, and landscape surfaces.",
    });
  } catch (error) {
    console.error("Collections generateMetadata error:", error);
    return {
      title: "Collections",
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
  const structuredData = resolveStructuredData({
    entityType: "collectionsOverview",
    entity: safeData,
  });

  return (
    <>
      <JsonLd data={structuredData} id="collections-overview-ldjson" />
      <CollectionsOverviewClient data={safeData} />
    </>
  );
}
