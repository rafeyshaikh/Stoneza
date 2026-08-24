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
    <section className="pb-16 sm:pb-24 lg:pb-32">
      {/* Floating Content Card */}
      <div className="relative z-20 mx-auto -mt-16 sm:-mt-24 lg:-mt-32 max-w-[1056px] bg-[#f8f6f2] px-4 sm:px-8 md:px-12 lg:px-14 pt-8 sm:pt-10 lg:pt-12">
        {/* Meta */}
        <div className="mb-6 sm:mb-8 flex flex-wrap items-center gap-2.5 sm:gap-4 font-heading text-xs sm:text-sm uppercase tracking-[0.18em] text-stone-600">
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
              <span className="text-stone-700 font-semibold">{blog.tags[0]}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display uppercase text-[20px] sm:text-[24px] md:text-[30px] lg:text-[34px] tracking-[0.12em] leading-[1.35] text-[#393938]">
          {blog.title}
        </h1>

        {/* Content */}
        <div
          className="blog-content mt-8 sm:mt-12 lg:mt-14 text-[14px] sm:text-[15px] leading-[1.8] text-[#1c1c1b]"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Bottom Share */}
        <div className="mt-12 sm:mt-16 lg:mt-20 flex items-center">
          <span className="mr-3 sm:mr-4 font-heading text-xs sm:text-sm uppercase tracking-wider text-stone-500">
            Share:
          </span>
          <a
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="flex h-11 w-12 sm:h-14 sm:w-16 items-center justify-center border border-stone-300 transition hover:bg-stone-100"
          >
            <FaFacebookF className="size-4" />
          </a>

          <a
            href={twitterHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
            className="flex h-11 w-12 sm:h-14 sm:w-16 items-center justify-center border-y border-r border-stone-300 transition hover:bg-stone-100"
          >
            <FaXTwitter className="size-4" />
          </a>

          <a
            href={pinterestHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Pinterest"
            className="flex h-11 w-12 sm:h-14 sm:w-16 items-center justify-center border-y border-r border-stone-300 transition hover:bg-stone-100"
          >
            <FaPinterestP className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

