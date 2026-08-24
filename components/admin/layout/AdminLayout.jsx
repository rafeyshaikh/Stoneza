"use client";

import { useState } from "react";

import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminNavbar from "@/components/admin/layout/AdminNavbar";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex h-full w-full overflow-hidden bg-[radial-gradient(circle_at_top,#f5f5f4_0%,#e7e5e4_35%,#d6d3d1_100%)] dark:bg-[radial-gradient(circle_at_top,#1c1917_0%,#111827_40%,#0c0a09_100%)]">
      {/* Desktop Sidebar */}
      <AdminSidebar className="hidden lg:flex shrink-0 h-full" />

      {/* Mobile Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div className="h-full w-72 max-w-[85vw]" onClick={(e) => e.stopPropagation()}>
            <AdminSidebar className="flex w-full h-full" onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Right Column: Fixed Navbar + Scrollable Main Content */}
      <div className="flex min-w-0 min-h-0 flex-1 flex-col h-full overflow-hidden">
        <AdminNavbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
