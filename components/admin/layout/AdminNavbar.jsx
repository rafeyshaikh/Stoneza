"use client";

import { MoonStar, SunMedium, Bell, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function AdminNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();

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
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          <SunMedium className="size-4 dark:hidden" />
          <MoonStar className="hidden size-4 dark:block" />
        </Button>
        <Button variant="outline" onClick={logout}>Logout</Button>
      </div>
    </header>
  );
}
