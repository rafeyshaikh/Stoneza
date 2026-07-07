import { notFound } from "next/navigation";
import Image from "next/image";

import { connectDB } from "@/lib/databaseConnection";
import Blog from "@/models/Blog.model";

import BlogReadingBar from "@/components/blogs/BlogReadingBar";
import BlogContent from "@/components/blogs/BlogContent";
import BlogNavigation from "@/components/blogs/BlogNavigation";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://stoneza.com";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();

  const blog = await Blog.findOne({
    slug: slug,
    status: "published",
  }).lean();

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
    keywords: blog.seo?.keywords || [],
    openGraph: {
      title: blog.seo?.metaTitle || blog.title,
      description: blog.seo?.metaDescription || blog.excerpt,
      images: blog.bannerImage?.url ? [blog.bannerImage.url] : [],
    },
  };
}

const BANNER_HEIGHT = 650; // px — keep in sync with the banner <section> height below

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  await connectDB();

  const blog = await Blog.findOne({
    slug: slug,
    status: "published",
  }).lean();

  if (!blog) {
    notFound();
  }

  const blogs = await Blog.find({ status: "published" })
    .sort({ publishedAt: 1 })
    .select("title slug bannerImage tags")
    .lean();

  const currentIndex = blogs.findIndex((item) => item.slug === blog.slug);

  const previousBlog = currentIndex > 0 ? blogs[currentIndex - 1] : null;
  const nextBlog =
    currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;

  const safeBlog = JSON.parse(JSON.stringify(blog));
  const safePrevious = previousBlog
    ? JSON.parse(JSON.stringify(previousBlog))
    : null;
  const safeNext = nextBlog ? JSON.parse(JSON.stringify(nextBlog)) : null;

  const shareUrl = `${SITE_URL}/blogs/${safeBlog.slug}`;

  return (
    <main className="bg-[#f8f6f2]">
      {/* Banner */}
      <section
        className="relative w-full"
        style={{ height: BANNER_HEIGHT }}
      >
        <Image
          src={safeBlog.bannerImage.url}
          alt={safeBlog.title}
          fill
          priority
          className="object-cover"
        />
      </section>

      {/* Reading Bar */}
      <BlogReadingBar
        title={safeBlog.title}
        shareUrl={shareUrl}
        shareImage={safeBlog.bannerImage.url}
        prevBlog={safePrevious}
        nextBlog={safeNext}
        bannerHeight={BANNER_HEIGHT}
      />

      {/* Content */}
      <BlogContent blog={safeBlog} shareUrl={shareUrl} />

      {/* Previous + Next */}
      <BlogNavigation previousBlog={safePrevious} nextBlog={safeNext} />
    </main>
  );
}