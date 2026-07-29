import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import AboutEditor from "@/components/admin/cms/AboutEditor";

export default function AboutCmsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <PageHeader
        title="About Us CMS"
        description="Manage your brand story, timeline eras, statistics, founders, and experience centre information."
      />
      <AboutEditor />
    </div>
  );
}
