"use client";

import { MoonStar, SunMedium, Bell, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

import { useRouter } from "next/navigation";

export default function AdminNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="flex h-14 shrink-0 w-full items-center justify-between border-b border-stone-300/60 bg-stone-50/90 px-3 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-950/90 sm:px-6 z-30">
      <div className="flex items-center gap-2.5 min-w-0">
        <Button variant="ghost" size="icon" className="size-8 lg:hidden shrink-0" onClick={onMenuClick}>
          <Menu className="size-4" />
        </Button>
        <div className="min-w-0 flex items-center gap-2">
          <p className="hidden sm:inline text-xs text-stone-500 dark:text-stone-400">Welcome back,</p>
          <h1 className="font-heading text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
            {user?.name || "Admin"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode" className="size-8 dark:text-stone-100">
          <SunMedium className="size-4 dark:hidden" />
          <MoonStar className="hidden size-4 dark:block" />
        </Button>
        <Button variant="outline" size="sm" onClick={logout} className="h-8 px-3 text-xs hover:bg-stone-200/80 dark:hover:bg-stone-900 cursor-pointer dark:text-stone-100 dark:hover:text-stone-950">
          Logout
        </Button>
        <Button variant="outline" size="sm" onClick={() => router.push("/")} className="h-8 px-3 text-xs hover:bg-stone-200/80 dark:hover:bg-stone-900 cursor-pointer dark:text-stone-100 dark:hover:text-stone-950">
          Home
        </Button>
      </div>
    </header>
  );
}
