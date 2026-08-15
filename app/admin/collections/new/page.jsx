import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import CollectionForm from "@/components/admin/collections/CollectionForm";

import Collection from "@/models/Collection.model";
import { connectDB } from "@/lib/databaseConnection";

export const dynamic = "force-dynamic";

export default async function NewCollectionPage() {
  await connectDB();

  const collections = await Collection.find({ collectionLevel: 1 })
    .select("name collectionLevel")
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  const safeCollections = JSON.parse(JSON.stringify(collections));

  return (
    <>
      <Breadcrumbs />
      <PageHeader
        title="Add Collection"
        description="Create a top-level collection or sub-collection."
      />
      <CollectionForm parentCollections={safeCollections} />
    </>
  );
}
