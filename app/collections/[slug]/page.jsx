import { notFound } from "next/navigation";
import { getCategoryDetails } from "@/lib/getCategoryDetails";
import CollectionPageClient from "./CollectionPageClient";

export default async function CollectionPage({ params }) {
  const { slug } = await params;
  const data = await getCategoryDetails(slug);

  if (!data) {
    notFound();
  }

  return <CollectionPageClient initialData={data} slug={slug} />;
}
