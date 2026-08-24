import BlogCard from "@/components/blogs/BlogCard";
import BlogsPagination from "@/components/blogs/BlogsPagination";

import { connectDB } from "@/lib/databaseConnection";
import Seo from "@/models/Seo.model";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    await connectDB();
    const seo = await Seo.findOne().lean();

    const title = "The Journal & Stories | Stoneza Natural Stones";
    const description =
      "Explore natural stone guides, architectural design inspiration, poolside landscaping ideas, quarry insights, and stone craft stories from Stoneza.";
    const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/blogs`;
    const ogImage =
      seo?.ogImage ||
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png";

    return {
      title,
      description,
      keywords: seo?.keywords || "stone journal, natural stone guide, marble flooring guide, sandstone cladding, landscape ideas, stoneza stories",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (err) {
    return {
      title: "The Journal & Stories | Stoneza Natural Stones",
      description:
        "Explore natural stone guides, architectural design inspiration, poolside landscaping ideas, quarry insights, and stone craft stories from Stoneza.",
    };
  }
}

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