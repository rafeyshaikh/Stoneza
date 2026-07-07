import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaPinterestP } from "react-icons/fa";

export default function BlogContent({ blog, shareUrl }) {
  const facebookHref = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(
    shareUrl,
  )}`;

  const twitterHref = `https://twitter.com/share?text=${encodeURIComponent(
    blog.title,
  )}&url=${encodeURIComponent(shareUrl)}`;

  const pinterestHref = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
    shareUrl,
  )}&media=${encodeURIComponent(
    blog.bannerImage?.url || "",
  )}&description=`;

  return (
    <section className="pb-32">
      {/* Floating Content Card */}
      <div className="relative z-20 mx-auto -mt-32 max-w-[820px] bg-[#f8f6f2] px-6 pt-12 sm:px-14">
        {/* Meta */}
        <div className="mb-8 flex items-center gap-4 font-heading text-sm uppercase tracking-[0.18em] text-stone-600">
          <span>
            {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "2-digit",
                year: "numeric",
              },
            )}
          </span>

          {blog.tags?.length > 0 && (
            <>
              <span>•</span>
              <span>{blog.tags[0]}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display uppercase text-[18px] tracking-[0.18em] leading-[1.5] text-[#393938] md:text-[28px]">
          {blog.title}
        </h1>

        {/* Content */}
        <div
          className="blog-content mt-14 text-[14px] leading-[1] text-[#1c1c1b]"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Bottom Share */}
        <div className="mt-20 flex">
          <a
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="flex h-14 w-16 items-center justify-center border border-stone-300 transition hover:bg-stone-100"
          >
            <FaFacebookF className="size-4" />
          </a>

          <a
            href={twitterHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
            className="flex h-14 w-16 items-center justify-center border-y border-r border-stone-300 transition hover:bg-stone-100"
          >
            <FaXTwitter className="size-4" />
          </a>

          <a
            href={pinterestHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Pinterest"
            className="flex h-14 w-16 items-center justify-center border-y border-r border-stone-300 transition hover:bg-stone-100"
          >
            <FaPinterestP className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}