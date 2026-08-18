import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import HomepageEditor from "@/components/admin/cms/HomepageEditor";

export default function HomepageCmsPage() {
  return (
    <div className="space-y-6 w-full min-w-0">
      <Breadcrumbs />
      <PageHeader
        title="Homepage CMS"
        description="Enable, customize, and manage all homepage layouts, banners, sliders, and reviews with Cloudinary uploads."
      />
      <div className="w-full min-w-0">
        <HomepageEditor />
      </div>
    </div>
  );
}
