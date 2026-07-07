import PageHeader from "@/components/admin/shared/PageHeader";
import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import BlogsForm from "@/components/admin/blogs/BlogsForm";

export const metadata = {
  title: "New Blog | Stoneza Admin",
};

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "CMS",
            href: "/admin/cms",
          },
          {
            label: "Blogs",
            href: "/admin/cms/blogs",
          },
          {
            label: "New Blog",
          },
        ]}
      />

      <PageHeader
        title="Create New Blog"
        description="Write and publish SEO-optimized blog posts for Stoneza."
      />

      <BlogsForm />
    </div>
  );
}