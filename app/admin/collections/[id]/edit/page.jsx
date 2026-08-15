import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import CollectionForm from "@/components/admin/collections/CollectionForm";

import { connectDB } from "@/lib/databaseConnection";
import Collection from "@/models/Collection.model";

export const dynamic = "force-dynamic";

export default async function EditCollectionPage({ params }) {
  await connectDB();
  const { id } = await params;

  const collection = await Collection.findById(id)
    .populate("parentCollection")
    .lean();

  if (!collection) {
    notFound();
  }

  const parentCollections = await Collection.find({
    _id: { $ne: id },
    collectionLevel: 1,
  })
    .select("name collectionLevel")
    .sort({ name: 1 })
    .lean();

  const safeCollection = JSON.parse(JSON.stringify(collection));
  const safeParents = JSON.parse(JSON.stringify(parentCollections));

  return (
    <>
      <Breadcrumbs />
      <PageHeader
        title="Edit Collection"
        description="Update collection details, images, and SEO configuration."
      />
      <CollectionForm
        parentCollections={safeParents}
        initialData={safeCollection}
        isEdit
      />
    </>
  );
}
