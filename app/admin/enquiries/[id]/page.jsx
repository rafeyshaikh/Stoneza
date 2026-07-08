import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import { connectDB } from "@/lib/databaseConnection";
import Enquiry from "@/models/Enquiry.model";
import { notFound } from "next/navigation";
import EnquiryDetailsClient from "@/components/admin/enquiries/EnquiryDetailsClient";

export default async function EnquiryDetailsPage({ params }) {
  const { id } = await params;

  await connectDB();
  const enquiry = await Enquiry.findById(id).lean();

  if (!enquiry) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs />
      <PageHeader
        title="Enquiry Details"
        description="View customer data, enquiry requirements, and update status/notes."
      />
      <div className="mt-6">
        <EnquiryDetailsClient enquiry={JSON.parse(JSON.stringify(enquiry))} />
      </div>
    </>
  );
}
