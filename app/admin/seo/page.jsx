import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import GlobalSeoForm from "@/components/admin/seo/GlobalSeoForm";
import RobotsEditor from "@/components/admin/seo/RobotsEditor";
import SitemapSettings from "@/components/admin/seo/SitemapSettings";

export default function SeoPage() {
  return (
    <>
      <Breadcrumbs />
      <PageHeader title="SEO Management" description="Global SEO, robots management, sitemap controls, and extensible blog SEO architecture." />
      <div className="space-y-4">
        <GlobalSeoForm />
        <RobotsEditor />
        <SitemapSettings />
      </div>
    </>
  );
}
