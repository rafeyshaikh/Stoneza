import Image from "next/image";
import Link from "next/link";

function BlogCard({ blog }) {
  if (!blog) return <div />;

  return (
    <Link href={`/blogs/${blog.slug}`} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-stone-200">
        <Image
          src={blog.bannerImage?.url}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </div>

      <div className="mt-4 sm:mt-6">
        {blog.tags?.length > 0 && (
          <p className="font-heading text-xs sm:text-sm uppercase tracking-[0.18em] text-stone-600">
            {blog.tags[0]}
          </p>
        )}

        <h3 className="mt-2 sm:mt-4 font-heading text-[18px] sm:text-[20px] md:text-[22px] leading-[1.4] text-stone-800 transition group-hover:text-stone-600">
          {blog.title}
        </h3>
      </div>
    </Link>
  );
}

export default function BlogNavigation({ previousBlog, nextBlog }) {
  if (!previousBlog && !nextBlog) {
    return null;
  }

  return (
    <section className="bg-[#f8f6f2] py-12 sm:py-16 md:py-24 border-t border-stone-200/60">
      <div className="mx-auto grid max-w-[1400px] gap-8 sm:gap-12 md:gap-16 px-4 sm:px-6 md:px-8 md:grid-cols-2">
        <BlogCard blog={previousBlog} />
        <BlogCard blog={nextBlog} />
      </div>
    </section>
  );
}