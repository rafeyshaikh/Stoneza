"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaPinterestP } from "react-icons/fa";

const BAR_HEIGHT = 52; // px — height of reading bar

export default function BlogReadingBar({
  title,
  shareUrl,
  shareImage,
  prevBlog,
  nextBlog,
}) {
  const [visible, setVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(125);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerEl = document.querySelector("header");
      if (headerEl) {
        setHeaderHeight(headerEl.offsetHeight);
      } else {
        setHeaderHeight(window.innerWidth >= 1024 ? 125 : 64);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight, { passive: true });

    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const bannerEl = document.getElementById("blog-banner") || document.querySelector("main section");
      const threshold = bannerEl ? bannerEl.offsetHeight * 0.45 : 250;
      setVisible(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const facebookHref = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(
    shareUrl || "",
  )}`;

  const twitterHref = `https://twitter.com/share?text=${encodeURIComponent(
    title || "",
  )}&url=${encodeURIComponent(shareUrl || "")}`;

  const pinterestHref = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
    shareUrl || "",
  )}&media=${encodeURIComponent(shareImage || "")}&description=`;

  return (
    <div
      className={`
        fixed left-0 z-[850] w-full border-y border-stone-300 bg-[#f8f6f2]/95 backdrop-blur-sm
        transition-all duration-300 ease-out shadow-sm
        ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      style={{
        top: visible ? headerHeight : headerHeight - BAR_HEIGHT,
        height: BAR_HEIGHT,
      }}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-3 sm:px-6 lg:px-14">
        {/* Left: Title */}
        <div className="min-w-0 flex-1 overflow-hidden pr-3 sm:pr-6">
          <p className="truncate font-heading text-xs sm:text-[13px] md:text-[14px] uppercase tracking-wider text-stone-700">
            <span className="hidden md:inline font-semibold text-stone-900">Now reading: </span>
            {title}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-5 lg:gap-8">
          {/* Share: Desktop */}
          <div className="hidden sm:flex items-center gap-3 lg:gap-4 text-stone-700">
            <span className="font-heading text-xs uppercase tracking-wider text-stone-500">
              Share
            </span>
            <div className="flex gap-2.5 lg:gap-3.5">
              <a
                href={facebookHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="hover:text-stone-950 transition-colors p-1"
              >
                <FaFacebookF className="size-3.5" />
              </a>
              <a
                href={twitterHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                className="hover:text-stone-950 transition-colors p-1"
              >
                <FaXTwitter className="size-3.5" />
              </a>
              <a
                href={pinterestHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Pinterest"
                className="hover:text-stone-950 transition-colors p-1"
              >
                <FaPinterestP className="size-3.5" />
              </a>
            </div>
          </div>

          {/* Share: Mobile icons */}
          <div className="flex sm:hidden items-center gap-1 text-stone-700 border-r border-stone-300 pr-2">
            <a
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="p-1 hover:text-stone-950"
            >
              <FaFacebookF className="size-3" />
            </a>
            <a
              href={twitterHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X"
              className="p-1 hover:text-stone-950"
            >
              <FaXTwitter className="size-3" />
            </a>
            <a
              href={pinterestHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Pinterest"
              className="p-1 hover:text-stone-950"
            >
              <FaPinterestP className="size-3" />
            </a>
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {prevBlog && (
              <Link
                href={`/blogs/${prevBlog.slug}`}
                className="flex items-center gap-0.5 sm:gap-1 font-heading text-xs sm:text-[13px] uppercase transition text-stone-700 hover:text-stone-950"
                title={prevBlog.title}
              >
                <ChevronLeft className="size-3.5 sm:size-4" />
                <span className="hidden xs:inline">Prev</span>
              </Link>
            )}

            {prevBlog && nextBlog && (
              <span className="text-stone-300 text-xs select-none">/</span>
            )}

            {nextBlog && (
              <Link
                href={`/blogs/${nextBlog.slug}`}
                className="flex items-center gap-0.5 sm:gap-1 font-heading text-xs sm:text-[13px] uppercase transition text-stone-700 hover:text-stone-950"
                title={nextBlog.title}
              >
                <span className="hidden xs:inline">Next</span>
                <ChevronRight className="size-3.5 sm:size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}