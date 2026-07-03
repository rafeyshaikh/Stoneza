"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-1 text-sm text-stone-500 dark:text-stone-400">
      <Link href="/admin" className="hover:text-stone-900 dark:hover:text-stone-100">Admin</Link>
      {segments.slice(1).map((segment, idx) => {
        const href = `/${segments.slice(0, idx + 2).join("/")}`;
        const label = segment.replace(/-/g, " ");

        return (
          <div key={href} className="flex items-center gap-1">
            <ChevronRight className="size-3" />
            <Link href={href} className="capitalize hover:text-stone-900 dark:hover:text-stone-100">{label}</Link>
          </div>
        );
      })}
    </div>
  );
}
