"use client";

import ImageWithLoader from "@/components/common/Loader";
import Link from "next/link";
import { Pencil, Trash2, Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CollectionTable({ collections = [] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("sortOrder");
  const [sortOrder, setSortOrder] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };
  const handleLevelChange = (val) => {
    setLevelFilter(val);
    setCurrentPage(1);
  };
  const handleStatusChange = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };
  const handleSortByChange = (val) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  async function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to delete this collection?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/collections/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success("Collection deleted successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to delete collection");
    }
  }

  const filteredCollections = collections.filter((col) => {
    const matchesSearch =
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      levelFilter === "all" || col.collectionLevel.toString() === levelFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && col.isActive) ||
      (statusFilter === "inactive" && !col.isActive);

    return matchesSearch && matchesLevel && matchesStatus;
  });

  const sortedCollections = [...filteredCollections].sort((a, b) => {
    let currentSortBy = sortBy;
    let currentSortOrder = sortOrder;

    if (sortBy === "createdAt-desc") {
      currentSortBy = "createdAt";
      currentSortOrder = "desc";
    } else if (sortBy === "createdAt-asc") {
      currentSortBy = "createdAt";
      currentSortOrder = "asc";
    }

    let aValue = a[currentSortBy];
    let bValue = b[currentSortBy];

    if (currentSortBy === "name") {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    }

    if (aValue < bValue) return currentSortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return currentSortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedCollections.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCollections = sortedCollections.slice(
    (validCurrentPage - 1) * itemsPerPage,
    validCurrentPage * itemsPerPage
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search collections by name or slug..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-stone-300/70 bg-white px-4 py-2 pl-10 text-sm outline-none transition dark:border-stone-800 dark:bg-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 text-stone-900 dark:text-stone-100"
          />
          <Search className="absolute left-3 top-2.5 size-4 text-stone-400" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={levelFilter} onValueChange={handleLevelChange}>
            <SelectTrigger className="w-[150px] border-stone-300/70 bg-white dark:bg-stone-900 dark:border-stone-800">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="1">Level 1 (Top)</SelectItem>
              <SelectItem value="2">Level 2 (Sub)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[130px] border-stone-300/70 bg-white dark:bg-stone-900 dark:border-stone-800">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="w-[160px] border-stone-300/70 bg-white dark:bg-stone-900 dark:border-stone-800">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sortOrder">Sort Order</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-300/70 bg-white/70 shadow-sm backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600 dark:text-stone-400">
            <thead className="border-b border-stone-300/70 bg-stone-100/50 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:border-stone-800 dark:bg-stone-800/50 dark:text-stone-400">
              <tr>
                <th className="px-6 py-4">Collection Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Parent Collection</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {paginatedCollections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-500 dark:text-stone-400">
                    No collections found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedCollections.map((col) => (
                  <tr key={col._id} className="transition-colors hover:bg-stone-50/50 dark:hover:bg-stone-800/50">
                    <td className="px-6 py-4 font-medium text-stone-900 dark:text-stone-100">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-800">
                          <ImageWithLoader
                            src={col.bannerImage?.square?.url || col.bannerImage?.landscape?.url}
                            alt={col.name}
                            fill
                            className="object-cover"
                            placeholderTitle={col.name}
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{col.name}</p>
                          {col.description && (
                            <p className="text-xs text-stone-400 line-clamp-1">{col.description}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-stone-500 dark:text-stone-400">
                      {col.slug}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        col.collectionLevel === 1
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}>
                        Level {col.collectionLevel}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-stone-500 dark:text-stone-400">
                      {col.parentCollection?.name || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        col.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                      }`}>
                        {col.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/collections/${col._id}/edit`}>
                          <Button variant="ghost" size="icon" className="size-8 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
                            <Pencil className="size-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(col._id)} className="size-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-stone-300/70 px-6 py-4 dark:border-stone-800">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Showing {(validCurrentPage - 1) * itemsPerPage + 1} to {Math.min(validCurrentPage * itemsPerPage, sortedCollections.length)} of {sortedCollections.length} collections
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={validCurrentPage === 1}>
                <ChevronLeft className="size-4 mr-1" /> Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={validCurrentPage === totalPages}>
                Next <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
