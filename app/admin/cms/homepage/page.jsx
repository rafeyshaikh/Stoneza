import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import HeroManager from "@/components/admin/cms/HeroManager";
import FeaturedCollectionsManager from "@/components/admin/cms/FeaturedCollectionsManager";
import TestimonialsManager from "@/components/admin/cms/TestimonialsManager";
import InstagramManager from "@/components/admin/cms/InstagramManager";
import NewArrivalsManager from "@/components/admin/cms/NewArrivalsManager";
import OurProcessManager from "@/components/admin/cms/OurProcessManager";
import ShopTheLookManager from "@/components/admin/cms/ShopTheLookManager";

export default function HomepageCmsPage() {
  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Homepage CMS" description="Enable, order, and manage all homepage sections with direct Cloudinary uploads." />
      <div className="space-y-4">
        <HeroManager />
        <FeaturedCollectionsManager />
        <TestimonialsManager />
        <InstagramManager />
        <NewArrivalsManager />
        <OurProcessManager />
        <ShopTheLookManager />
      </div>
    </>
  );
}
