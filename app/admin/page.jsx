"use client";

import { useEffect, useState } from "react";

import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import LowStockTable from "@/components/admin/dashboard/LowStockTable";

const defaultStats = {
  totalProducts: 0,
  totalCategories: 0,
  totalEnquiries: 0,
  totalRevenue: 0,
  totalCustomers: 0,
  recentEnquiries: [],
  recentCustomers: [],
  lowStockProducts: [],
  outOfStockProducts: [],
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(defaultStats);

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
      }
    }

    loadStats();
  }, []);

  return (
    <>
      <Breadcrumbs />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatsCard label="Total Products" value={stats.totalProducts} />
        <StatsCard label="Total Categories" value={stats.totalCategories} />
        <StatsCard label="Total Enquiries" value={stats.totalEnquiries} />
        <StatsCard label="Total Revenue" value={`INR ${Number(stats.totalRevenue).toLocaleString("en-IN")}`} />
        <StatsCard label="Total Customers" value={stats.totalCustomers} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RevenueChart />
        </div>
        <div className="xl:col-span-2">
          <LowStockTable products={stats.lowStockProducts} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <RecentOrders orders={stats.recentEnquiries} />
        <div className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
          <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">Recent Customers</h3>
          <ul className="mt-4 space-y-3">
            {stats.recentCustomers.map((customer) => (
              <li key={customer._id} className="flex items-center justify-between border-b border-stone-200/70 pb-3 dark:border-stone-900">
                <div>
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{customer.name}</p>
                  <p className="text-xs text-stone-500">{customer.email}</p>
                </div>
                <span className="text-xs text-stone-500">{new Date(customer.createdAt).toLocaleDateString("en-IN")}</span>
              </li>
            ))}
          </ul>
          {!stats.recentCustomers.length ? <p className="py-8 text-center text-sm text-stone-500">No customers yet.</p> : null}
        </div>
      </div>
    </>
  );
}
