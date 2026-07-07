import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BlogsPagination({ currentPage, totalPages }) {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-20 flex items-center justify-center gap-6 text-sm text-stone-600"
    >
      {currentPage > 1 && (
        <Link
          href={`/blogs?page=${currentPage - 1}`}
          aria-label="Previous page"
          className="text-stone-500 transition-colors hover:text-stone-900"
        >
          <ChevronLeft className="size-4" />
        </Link>
      )}

      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="text-stone-400">
              …
            </span>
          );
        }

        const isActive = currentPage === page;

        return isActive ? (
          <span
            key={page}
            aria-current="page"
            className="font-medium text-stone-900"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={`/blogs?page=${page}`}
            className="transition-colors hover:text-stone-900"
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={`/blogs?page=${currentPage + 1}`}
          aria-label="Next page"
          className="text-stone-500 transition-colors hover:text-stone-900"
        >
          <ChevronRight className="size-4" />
        </Link>
      )}
    </nav>
  );
}