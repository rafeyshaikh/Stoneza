import BlogCard from "@/components/blogs/BlogCard";
import BlogsPagination from "@/components/blogs/BlogsPagination";

import { connectDB } from "@/lib/databaseConnection";
import Blog from "@/models/Blog.model";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Stories | Stoneza",
  description:
    "Explore design inspiration, natural stone guides, poolside ideas, sculptures, fountains, and more.",
};

export default async function BlogsPage(props) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page || 1);
  const limit = 9;
  const skip = (page - 1) * limit;

  let safeBlogs = [];
  let totalBlogs = 0;

  try {
    await connectDB();
    const [blogs, count] = await Promise.all([
      Blog.find({ status: "published" })
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Blog.countDocuments({ status: "published" }),
    ]);
    safeBlogs = JSON.parse(JSON.stringify(blogs));
    totalBlogs = count;
  } catch (error) {
    console.error("BlogsPage error:", error.message);
  }

  const totalPages = Math.ceil(totalBlogs / limit) || 1;

  return (
    <section className="py-14 lg:py-16">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <h1 className="mb-12 text-center font-display text-4xl uppercase tracking-[6px] text-stone-900 lg:mb-14 lg:text-[28px]">
          Stories
        </h1>

        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {safeBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>

        <BlogsPagination currentPage={page} totalPages={totalPages} />
      </div>
    </section>
  );
}