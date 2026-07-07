import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import EnquiryTimeline from "@/components/admin/enquiries/EnquiryTimeline";

export default function EnquiryDetailsPage() {
  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Enquiry Details" description="View customer data, enquiry items, and timeline progression." />
      <EnquiryTimeline status="Processing" />
    </>
  );
}
