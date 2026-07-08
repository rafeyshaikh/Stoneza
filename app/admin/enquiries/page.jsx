import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import EnquiriesTable from "@/components/admin/enquiries/EnquiriesTable";

import Enquiry from "@/models/Enquiry.model";
import { connectDB } from "@/lib/databaseConnection";

export default async function AdminEnquiriesPage() {
  await connectDB();
  const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).limit(10).lean();

  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Enquiries" description="Track customer enquiries, statuses, and communication progression." />
      <EnquiriesTable enquiries={JSON.parse(JSON.stringify(enquiries))} />
    </>
  );
}
