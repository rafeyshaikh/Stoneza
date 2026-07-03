import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import PageEditor from "@/components/admin/pages/PageEditor";

export default function StaticPagesCmsPage() {
  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Static Pages CMS" description="Manage About, Policies, Terms, and Contact pages with TipTap + SEO controls." />
      <PageEditor title="About Us" />
    </>
  );
}
