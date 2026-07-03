import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import ReviewsTable from "@/components/admin/reviews/ReviewsTable";

import Review from "@/models/Review.model";
import { connectDB } from "@/lib/databaseConnection";

export default async function ReviewsPage() {
  await connectDB();
  const reviews = await Review.find({}).sort({ createdAt: -1 }).limit(100).lean();

  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Reviews" description="Moderate purchased-and-delivered reviews before they go public." />
      <ReviewsTable reviews={JSON.parse(JSON.stringify(reviews))} />
    </>
  );
}
