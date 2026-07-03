"use client";

import { useState } from "react";

import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminNavbar from "@/components/admin/layout/AdminNavbar";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f5f5f4_0%,#e7e5e4_35%,#d6d3d1_100%)] dark:bg-[radial-gradient(circle_at_top,#1c1917_0%,#111827_40%,#0c0a09_100%)]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/45 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <div className="h-full w-72" onClick={(e) => e.stopPropagation()}>
              <AdminSidebar />
            </div>
          </div>
        )}

        <div className="flex min-h-screen flex-1 flex-col">
          <AdminNavbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
