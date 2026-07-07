"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaPinterestP } from "react-icons/fa";

// Keep these in sync with your actual layout:
const HEADER_HEIGHT = 106; // px — height of your sticky site header
const BAR_HEIGHT = 58; // px — height of this reading bar

export default function BlogReadingBar({
  title,
  shareUrl,
  shareImage,
  prevBlog,
  nextBlog,
  bannerHeight = 650,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = bannerHeight * 0.4;

    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [bannerHeight]);

  const facebookHref = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(
    shareUrl,
  )}`;

  const twitterHref = `https://twitter.com/share?text=${encodeURIComponent(
    title,
  )}&url=${encodeURIComponent(shareUrl)}`;

  const pinterestHref = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
    shareUrl,
  )}&media=${encodeURIComponent(shareImage || "")}&description=`;

  return (
    <>
      {/*
        Spacer: the bar itself is `fixed` (removed from normal flow),
        so we reserve its height in the flow to avoid content jump.
      */}
      <div style={{ height: BAR_HEIGHT }} aria-hidden="true" />

      <div
        className={`
          fixed left-0 z-200 w-full border-y border-stone-300 bg-[#f8f6f2]
          transition-transform duration-300 ease-out
          ${visible ? "pointer-events-auto" : "pointer-events-none"}
        `}
        style={{
          top: HEADER_HEIGHT - BAR_HEIGHT,
          height: BAR_HEIGHT,
          transform: visible
            ? `translateY(${BAR_HEIGHT}px)`
            : "translateY(0px)",
        }}
      >
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-6 lg:px-14">
          {/* Left */}
          <div className="overflow-hidden text-ellipsis whitespace-nowrap pr-8">
            <span className="font-heading text-[15px] uppercase text-stone-700">
              Now reading: {title}
            </span>
          </div>

          {/* Right */}
          <div className="flex shrink-0 items-center gap-8 lg:gap-12">
            <div className="hidden items-center gap-6 sm:flex">
              <span className="font-heading text-[15px] uppercase tracking-wider">
                Share
              </span>

              <div className="flex gap-5">
                <a
                  href={facebookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                >
                  <FaFacebookF className="size-4" />
                </a>

                <a
                  href={twitterHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X"
                >
                  <FaXTwitter className="size-4" />
                </a>

                <a
                  href={pinterestHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Pinterest"
                >
                  <FaPinterestP className="size-4" />
                </a>
              </div>
            </div>

            {prevBlog && (
              <Link
                href={`/blogs/${prevBlog.slug}`}
                className="flex items-center gap-2 font-heading text-[15px] uppercase transition hover:text-stone-500"
              >
                <ChevronLeft className="size-4" />
                Prev
              </Link>
            )}

            {nextBlog && (
              <Link
                href={`/blogs/${nextBlog.slug}`}
                className="flex items-center gap-2 font-heading text-[15px] uppercase transition hover:text-stone-500"
              >
                Next
                <ChevronRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}