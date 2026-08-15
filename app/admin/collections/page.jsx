import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import CollectionTable from "@/components/admin/collections/CollectionTable";

import Collection from "@/models/Collection.model";
import { connectDB } from "@/lib/databaseConnection";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  await connectDB();
  const collections = await Collection.find({})
    .populate("parentCollection", "name collectionLevel")
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  return (
    <>
      <Breadcrumbs />
      <PageHeader
        title="Collections"
        description="Manage 2-level collections, sub-collections, and collection SEO."
        actionLabel="Add Collection"
        onAction="/admin/collections/new"
      />
      <CollectionTable collections={JSON.parse(JSON.stringify(collections))} />
    </>
  );
}
