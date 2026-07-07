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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-300/60 bg-stone-50/90 px-4 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-950/90 lg:px-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="size-4" />
        </Button>
        <div>
          <p className="text-sm text-stone-500 dark:text-stone-400">Welcome back</p>
          <h1 className="font-heading text-base font-semibold text-stone-900 dark:text-stone-100">{user?.name || "Admin"}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode" className="dark:text-stone-100">
          <SunMedium className="size-4 dark:hidden" />
          <MoonStar className="hidden size-4 dark:block" />
        </Button>
        <Button variant="outline" onClick={logout} className="hover:bg-stone-200/80 dark:hover:bg-stone-900 cursor-pointer dark:text-stone-100 dark:hover:text-stone-950">
          Logout
        </Button>
        <Button variant="outline" onClick={() => router.push("/")} className="hover:bg-stone-200/80 dark:hover:bg-stone-900 cursor-pointer dark:text-stone-100 dark:hover:text-stone-950">
          Home
        </Button>
      </div>
    </header>
  );
}
