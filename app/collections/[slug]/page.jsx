import { notFound } from "next/navigation";
import { getCollectionDetails } from "@/lib/getCollectionDetails";
import CollectionPageClient from "./CollectionPageClient";
import { resolveEntityMetadata } from "@/lib/seo/resolveMetadata";
import { resolveStructuredData } from "@/lib/seo/schemaGenerator";
import JsonLd from "@/components/common/JsonLd";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getCollectionDetails(slug);

  if (!data || !data.collection) {
    return {
      title: "Collection Not Found",
      description: "The requested stone collection could not be found.",
    };
  }

  return resolveEntityMetadata({
    entityType: "collection",
    entity: data.collection,
    path: `/collections/${slug}`,
  });
}

export default async function CollectionPage({ params }) {
  const { slug } = await params;
  const data = await getCollectionDetails(slug);

  if (!data || !data.collection) {
    notFound();
  }

  const safeData = JSON.parse(JSON.stringify(data));
  const structuredData = resolveStructuredData({
    entityType: "collection",
    entity: safeData.collection,
  });

  return (
    <>
      <JsonLd data={structuredData} id="collection-ldjson" />
      <CollectionPageClient initialData={safeData} slug={slug} />
    </>
  );
}
