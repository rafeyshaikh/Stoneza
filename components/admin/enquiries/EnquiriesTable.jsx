"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import SearchBar from "@/components/admin/shared/SearchBar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EnquiryStatusBadge from "@/components/admin/enquiries/EnquiryStatusBadge";
import { PROJECT_TYPES } from "@/lib/validations/enquiry";

export default function EnquiriesTable({ enquiries = [] }) {
  const [query, setQuery] = useState("");
  const [projectType, setProjectType] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");

  const [items, setItems] = useState(enquiries);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    fetchEnquiries();
  }, [debouncedQuery, page, projectType, status, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1); // reset to page 1 when search query changes
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  async function fetchEnquiries() {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit: 10,
        query: debouncedQuery,
        projectType,
        status,
        sort,
      });

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setItems(data.data.items);
      setTotalPages(data.data.pagination.totalPages);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to delete this enquiry?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Enquiry deleted successfully");
      fetchEnquiries();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to delete enquiry");
    }
  }

  function handleFilterChange(setter) {
    return (value) => {
      setter(value === "all" ? "" : value);
      setPage(1); // reset pagination when filter changes
    };
  }

  return (
    <div className="space-y-4 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search enquiries..."
        />

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={projectType || "all"}
            onValueChange={handleFilterChange(setProjectType)}
          >
            <SelectTrigger className="w-[180px] bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-800">
              <SelectValue placeholder="Project Type" />
            </SelectTrigger>
            <SelectContent
              className="z-50 border border-stone-200 bg-white shadow-lg dark:border-stone-800 dark:bg-stone-900"
              position="popper"
              side="bottom"
              align="start"
              avoidCollisions={false}
              sideOffset={4}
            >
              <SelectItem value="all">All Project Types</SelectItem>
              {PROJECT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status || "all"}
            onValueChange={handleFilterChange(setStatus)}
          >
            <SelectTrigger className="w-[140px] bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-800">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent
              className="z-50 border border-stone-200 bg-white shadow-lg dark:border-stone-800 dark:bg-stone-900"
              position="popper"
              side="bottom"
              align="start"
              avoidCollisions={false}
              sideOffset={4}
            >
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={handleFilterChange(setSort)}>
            <SelectTrigger className="w-[160px] bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-800">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="z-50 border border-stone-200 bg-white shadow-lg dark:border-stone-800 dark:bg-stone-900"
              position="popper"
              side="bottom"
              align="start"
              avoidCollisions={false}
              sideOffset={4}
            >
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-a-z">Name (A-Z)</SelectItem>
              <SelectItem value="name-z-a">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone-300/70 text-stone-500 dark:border-stone-800 dark:text-stone-400">
              <th className="pb-3 pr-3 font-medium">Name</th>
              <th className="pb-3 pr-3 font-medium">Number</th>
              <th className="pb-3 pr-3 font-medium">Total Area</th>
              <th className="pb-3 pr-3 font-medium">Project Type</th>
              <th className="pb-3 pr-3 font-medium">City/Site</th>
              <th className="pb-3 pr-3 font-medium">Stone Type</th>
              <th className="pb-3 pr-3 font-medium">Status</th>
              <th className="pb-3 pr-3 font-medium">Created</th>
              <th className="pb-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="9">
                  <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
                    Loading enquiries...
                  </p>
                </td>
              </tr>
            )}

            {!loading &&
              items.map((enquiry) => (
                <tr key={enquiry._id} className="border-b border-stone-200/70 dark:border-stone-900 hover:bg-stone-100/50 dark:hover:bg-stone-900/40">
                  <td className="py-3 pr-3 text-stone-900 dark:text-stone-100 font-medium">{enquiry.name}</td>
                  <td className="py-3 pr-3">{enquiry.phone}</td>
                  <td className="py-3 pr-3">{enquiry.area ? Number(enquiry.area).toLocaleString("en-IN") + " sq m" : "N/A"}</td>
                  <td className="py-3 pr-3">{enquiry.projectType}</td>
                  <td className="py-3 pr-3">{enquiry.city}</td>
                  <td className="py-3 pr-3">{enquiry.stoneType}</td>
                  <td className="py-3 pr-3"><EnquiryStatusBadge status={enquiry.status} /></td>
                  <td className="py-3 pr-3">{new Date(enquiry.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/enquiries/${enquiry._id}`}>
                        <Button size="sm" variant="outline" className="h-8 px-3 border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 cursor-pointer">
                          Open
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 border border-transparent text-red-600 hover:text-red-700 hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                        onClick={() => handleDelete(enquiry._id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {!loading && !items.length ? (
          <p className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">No enquiries available.</p>
        ) : null}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stone-200/70 pt-3 dark:border-stone-900">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
