import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import BlogsTable from "@/components/admin/blogs/BlogsTable";

import Blog from "@/models/Blog.model";

import { connectDB } from "@/lib/databaseConnection";

export default async function AdminBlogPage() {
  await connectDB();

  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .lean();

  const safeBlogs = JSON.parse(JSON.stringify(blogs));

  return (
    <>
      <Breadcrumbs />

      <PageHeader
        title="Blog CMS"
        description="Manage Blogs and Articles"
        actionLabel="Post Blog"
        onAction="/admin/cms/blogs/new"
      />

      <BlogsTable blogs={safeBlogs} />
    </>
  );
}