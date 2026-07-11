import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import HomepageEditor from "@/components/admin/cms/HomepageEditor";

export default function HomepageCmsPage() {
  return (
    <>
      <Breadcrumbs />
      <PageHeader
        title="Homepage CMS"
        description="Enable, customize, and manage all homepage layouts, banners, sliders, and reviews with Cloudinary uploads."
      />
      <div className="mt-5">
        <HomepageEditor />
      </div>
    </>
  );
}
