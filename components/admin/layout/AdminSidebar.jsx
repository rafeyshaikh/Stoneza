"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Grid2X2,
  Layers,
  Users,
  Star,
  FileText,
  Search,
  Settings,
  NotebookPen,
  Building2,
} from "lucide-react";
import { BiSolidCommentDetail } from "react-icons/bi";

import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Grid2X2 },
  { label: "Collections", href: "/admin/collections", icon: Layers },
  { label: "Projects CMS", href: "/admin/projects", icon: Building2 },
  { label: "Enquiries", href: "/admin/enquiries", icon: BiSolidCommentDetail },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Homepage CMS", href: "/admin/cms/homepage", icon: FileText },
  { label: "About Us CMS", href: "/admin/cms/about", icon: FileText },
  { label: "Pages CMS", href: "/admin/cms/pages", icon: FileText },
  { label: "Blog CMS", href: "/admin/cms/blogs", icon: NotebookPen },
  { label: "SEO", href: "/admin/seo", icon: Search },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ className, onClose }) {
  const pathname = usePathname();
  const { userRole } = useAuth();

  const displayedNavItems = navItems.filter((item) => {
    if (item.href === "/admin/users") {
      return userRole === "admin";
    }
    return true;
  });

  return (
    <aside
      className={cn(
        "flex w-72 shrink-0 flex-col border-r border-stone-300/60 bg-stone-100/90 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-950/90 h-full z-40 select-none",
        className
      )}
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-stone-300/60 px-6 dark:border-stone-800">
        <div className="space-y-0.5">
          <p className="font-heading text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Stoneza
          </p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
            Admin Console
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {displayedNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
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
