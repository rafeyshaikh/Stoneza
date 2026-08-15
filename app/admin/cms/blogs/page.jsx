import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import BlogsTable from "@/components/admin/blogs/BlogsTable";

import Blog from "@/models/Blog.model";

import { connectDB } from "@/lib/databaseConnection";

export default async function AdminBlogPage() {
  let safeBlogs = [];
  try {
    await connectDB();
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .lean();
    safeBlogs = JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error("AdminBlogPage error:", error.message);
  }

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