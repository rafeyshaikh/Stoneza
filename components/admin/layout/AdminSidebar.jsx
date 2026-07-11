"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Grid2X2,
  Users,
  Star,
  FileText,
  Search,
  Settings,
  NotebookPen
} from "lucide-react";
import { BiSolidCommentDetail } from "react-icons/bi";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Grid2X2 },
  { label: "Enquiries", href: "/admin/enquiries", icon: BiSolidCommentDetail },
  { label: "Homepage CMS", href: "/admin/cms/homepage", icon: FileText },
  { label: "Pages CMS", href: "/admin/cms/pages", icon: FileText },
  { label: "Blog CMS", href: "/admin/cms/blogs", icon: NotebookPen },
  { label: "SEO", href: "/admin/seo", icon: Search },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col border-r border-stone-300/60 bg-stone-100/70 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-950/70 lg:sticky lg:top-0 lg:h-screen">
      <div className="flex h-16 items-center border-b border-stone-300/60 px-6 dark:border-stone-800">
        <div className="space-y-0.5">
          <p className="font-heading text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Stoneza
          </p>
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
            Admin Console
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-stone-900 text-stone-100 shadow-sm dark:bg-stone-100 dark:text-stone-950"
                  : "text-stone-700 hover:bg-stone-200/80 dark:text-stone-300 dark:hover:bg-stone-900",
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
