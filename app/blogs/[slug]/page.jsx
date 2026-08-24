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

  const title = blog.seo?.metaTitle || `${blog.title} | Stoneza`;
  const description = blog.seo?.metaDescription || blog.excerpt || "Read the latest stone insights and guides from Stoneza.";
  const canonicalUrl = blog.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_BASE_URL || "https://stoneza.in"}/blogs/${slug}`;
  const ogImage = blog.seo?.ogImage || blog.bannerImage?.url || "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png";

  return {
    title,
    description,
    keywords: blog.seo?.keywords || [],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: "article",
      publishedTime: blog.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

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
        id="blog-banner"
        className="relative w-full h-[320px] sm:h-[420px] md:h-[520px] lg:h-[620px] xl:h-[680px]"
      >
        <Image
          src={safeBlog.bannerImage.url}
          alt={safeBlog.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </section>

      {/* Reading Bar */}
      <BlogReadingBar
        title={safeBlog.title}
        shareUrl={shareUrl}
        shareImage={safeBlog.bannerImage?.url}
        prevBlog={safePrevious}
        nextBlog={safeNext}
      />

      {/* Content */}
      <BlogContent blog={safeBlog} shareUrl={shareUrl} />

      {/* Previous + Next */}
      <BlogNavigation previousBlog={safePrevious} nextBlog={safeNext} />
    </main>
  );
}