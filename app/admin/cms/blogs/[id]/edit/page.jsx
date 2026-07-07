import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import BlogsForm from "@/components/admin/blogs/BlogsForm";

import { connectDB } from "@/lib/databaseConnection";
import Blog from "@/models/Blog.model";

export default async function EditBlogPage({ params }) {

  const { id } = await params;
  await connectDB();

  const blog = await Blog.findById(id).lean();

  if (!blog) {
    notFound();
  }

  const safeBlog = JSON.parse(JSON.stringify(blog));

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      <PageHeader
        title="Edit Blog"
        description="Update and republish your article."
      />

      <BlogsForm initialData={safeBlog} isEdit />
    </div>
  );
}