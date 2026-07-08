"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Grid2X2,
  MessageSquare,
  AlertCircle,
  ClipboardCheck,
  NotebookPen,
  ArrowUpRight,
  CheckCircle2,
  Activity,
} from "lucide-react";
import Link from "next/link";

import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";

const defaultStats = {
  totalProducts: 0,
  totalCategories: 0,
  totalEnquiries: 0,
  newEnquiries: 0,
  activeEnquiries: 0,
  totalBlogs: 0,
  enquiriesGraphData: [],
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
        if (!res.ok) {
          return;
        }

        const data = await res.json();
        setStats(data.data || defaultStats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  // Calculate chart max heights
  const maxGraphCount = Math.max(
    ...(stats.enquiriesGraphData?.map((d) => d.count) || []),
    5
  );

  return (
    <>
      <Breadcrumbs />

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Dashboard Overview
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Package}
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
        />
        <StatsCard
          label="Total Categories"
          value={stats.totalCategories}
          icon={Grid2X2}
          colorClass="bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400"
        />
        <StatsCard
          label="Total Enquiries"
          value={stats.totalEnquiries}
          icon={MessageSquare}
          colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
        />
        <StatsCard
          label="New Enquiries"
          value={stats.newEnquiries}
          icon={AlertCircle}
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
        />
        <StatsCard
          label="Active Enquiries"
          value={stats.activeEnquiries}
          icon={ClipboardCheck}
          colorClass="bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
        />
        <StatsCard
          label="Total Blogs"
          value={stats.totalBlogs}
          icon={NotebookPen}
          colorClass="bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400"
        />
      </div>

      {/* Layout Columns */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Left Side: Graph and Quick Actions */}
        <div className="xl:col-span-2 space-y-6">
          {/* Site Analytics Card */}
          <div className="rounded-2xl border border-stone-300/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
            <h3 className="font-heading text-base font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Activity className="size-4 text-emerald-500" />
              Site Analytics
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Enquiry requests submitted over the last 30 days
            </p>

            {/* Custom Bar Graph */}
            <div className="mt-6">
              <div className="flex h-36 items-end gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-2">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                    Loading stats...
                  </div>
                ) : (
                  stats.enquiriesGraphData?.map((day, idx) => {
                    const pct = (day.count / maxGraphCount) * 100;
                    return (
                      <div
                        key={idx}
                        className="group relative flex-1 flex flex-col justify-end h-full"
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-stone-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none shadow dark:bg-stone-100 dark:text-stone-900">
                          {day.count} {day.count === 1 ? "enquiry" : "enquiries"} ({day.date})
                        </div>
                        {/* Bar */}
                        <div
                          style={{ height: `${pct || 4}%` }}
                          className={`w-full rounded-t-sm transition-all duration-300 ${
                            day.count > 0
                              ? "bg-stone-600 hover:bg-stone-800 dark:bg-stone-300 dark:hover:bg-stone-100"
                              : "bg-stone-200/50 dark:bg-stone-900/50"
                          }`}
                        />
                      </div>
                    );
                  })
                )}
              </div>

              {/* X Labels */}
              {!loading && stats.enquiriesGraphData?.length > 0 && (
                <div className="flex justify-between mt-2 text-[10px] text-stone-400 px-1 select-none">
                  <span>{stats.enquiriesGraphData[0]?.date}</span>
                  <span>{stats.enquiriesGraphData[7]?.date}</span>
                  <span>{stats.enquiriesGraphData[14]?.date}</span>
                  <span>{stats.enquiriesGraphData[21]?.date}</span>
                  <span>{stats.enquiriesGraphData[29]?.date}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-2xl border border-stone-300/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
            <h3 className="font-heading text-base font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Quick Actions
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <QuickActionCard
                title="Add Product"
                description="Create a new stone or tile product spec sheet"
                href="/admin/products/new"
              />
              <QuickActionCard
                title="View Website"
                description="Open the live front-end website"
                href="/"
                external
              />
              <QuickActionCard
                title="Manage Enquiries"
                description="Moderate customer quotes and management notes"
                href="/admin/enquiries"
              />
              <QuickActionCard
                title="Blog CMS"
                description="Write and publish new content articles"
                href="/admin/cms/blogs"
              />
            </div>
          </div>
        </div>

        {/* Right Side: System Status */}
        <div className="xl:col-span-1">
          <div className="rounded-2xl border border-stone-300/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
            <h3 className="font-heading text-base font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-6">
              <CheckCircle2 className="size-4 text-emerald-500" />
              System Status
            </h3>

            <div className="space-y-4">
              <StatusRow
                label="Database"
                statusText="Connected"
                statusColor="bg-emerald-500"
                badgeColor="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
              />
              <StatusRow
                label="API"
                statusText="Operational"
                statusColor="bg-emerald-500"
                badgeColor="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
              />
              <StatusRow
                label="Next.js"
                statusText="v16.2.9"
                statusColor="bg-blue-500"
                badgeColor="bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatsCard({ label, value, icon: Icon, colorClass }) {
  return (
    <div className="rounded-2xl border border-stone-300/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass}`}>
        <Icon className="size-5" />
      </div>
      <p className="mt-4 text-3xl font-bold font-heading tracking-tight text-stone-900 dark:text-stone-100">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
        {label}
      </p>
    </div>
  );
}

function QuickActionCard({ title, description, href, external = false }) {
  const content = (
    <div className="group rounded-xl border border-stone-200 bg-stone-50/50 p-4 transition-all hover:bg-stone-100/50 hover:border-stone-300 cursor-pointer dark:border-stone-800 dark:bg-stone-900/30 dark:hover:bg-stone-900/60 dark:hover:border-stone-700 flex justify-between items-start h-full">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
          {title}
        </p>
        <p className="text-xs text-stone-500">
          {description}
        </p>
      </div>
      <ArrowUpRight className="size-4 text-stone-400 group-hover:text-stone-600 transition-colors ml-2" />
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
}

function StatusRow({ label, statusText, statusColor, badgeColor }) {
  return (
    <div className="flex items-center justify-between border-b border-stone-100 pb-3 last:border-0 last:pb-0 dark:border-stone-900">
      <div className="flex items-center gap-2.5">
        <span className={`h-2 w-2 rounded-full ${statusColor}`} />
        <span className="text-sm text-stone-700 dark:text-stone-300 font-medium">
          {label}
        </span>
      </div>
      <span className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${badgeColor}`}>
        {statusText}
      </span>
    </div>
  );
}
