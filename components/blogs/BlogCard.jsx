import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ blog }) {
  return (
    <article className="group">
      <Link href={`/blogs/${blog.slug}`} className="block">
        <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
          <Image
            src={blog.bannerImage.url}
            alt={blog.title}
            fill
            className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-[2px] text-stone-500">
            {blog.tags?.[0] || "Stoneza"}
          </p>

          <h2 className="mt-3 font-heading text-xl font-display uppercase leading-snug text-stone-900 transition-colors duration-300 group-hover:text-stone-600">
            {blog.title}
          </h2>

          <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-stone-600 text-body">
            {blog.excerpt}
          </p>

          <span className="mt-4 inline-block border-b border-stone-900 pb-0.5 text-sm font-medium text-stone-900 transition-colors duration-300 group-hover:border-stone-500 group-hover:text-stone-500">
            Read more
          </span>
        </div>
      </Link>
    </article>
  );
}