"use client";

import Image from "next/image";
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

export default function CategoryTable({ categories = [] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("sortOrder");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination states
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
  const handleSortOrderToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Category deleted successfully");

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Failed to delete category");
    }
  }

  // Filtering
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      levelFilter === "all" || cat.categoryLevel.toString() === levelFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && cat.isActive) ||
      (statusFilter === "inactive" && !cat.isActive);

    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Sorting
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === "name") {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedCategories.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCategories = sortedCategories.slice(
    (validCurrentPage - 1) * itemsPerPage,
    validCurrentPage * itemsPerPage
  );

  return (
    <>
      {/* Filters Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-stone-300/70 bg-white px-4 py-2 pl-10 text-sm outline-none transition dark:border-stone-800 dark:bg-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 text-stone-900 dark:text-stone-100"
          />
          <Search className="absolute left-3 top-2.5 size-4 text-stone-400" />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Level Filter */}
          <Select
            value={levelFilter}
            onValueChange={handleLevelChange}
          >
            <SelectTrigger className="w-[150px] border-stone-300/70 bg-white dark:bg-stone-900 dark:border-stone-850">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent 
              className="z-50 border border-stone-200 bg-white shadow-lg dark:border-stone-800 dark:bg-stone-900"
              position="popper"
              side="bottom"
              align="start"
              avoidCollisions={false}
              sideOffset={4}
            >
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="1">Main Category</SelectItem>
              <SelectItem value="2">Sub Category</SelectItem>
              <SelectItem value="3">Final Category</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[140px] border-stone-300/70 bg-white dark:bg-stone-900 dark:border-stone-850">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent
              className="z-50 border border-stone-200 bg-white shadow-lg dark:border-stone-800 dark:bg-stone-900"
              position="popper"
              side="bottom"
              align="start"
              avoidCollisions={false}
              sideOffset={4}
            >
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={sortBy}
            onValueChange={handleSortByChange}
          >
            <SelectTrigger className="w-[140px] border-stone-300/70 bg-white dark:bg-stone-900 dark:border-stone-850">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent
              className="z-50 border border-stone-200 bg-white shadow-lg dark:border-stone-800 dark:bg-stone-900"
              position="popper"
              side="bottom"
              align="start"
              avoidCollisions={false}
              sideOffset={4}
            >
              <SelectItem value="sortOrder">Sort Order</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="categoryLevel">Category Level</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleSortOrderToggle}
            title={sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}
            className="border-stone-300/70 bg-white dark:bg-stone-900 dark:border-stone-850"
          >
            <ArrowUpDown className="size-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-300/70 bg-stone-50/80 p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone-300/70 text-stone-500 dark:border-stone-800 dark:text-stone-400">
              <th className="pb-3 pr-3 font-medium">Banner</th>

              <th className="pb-3 pr-3 font-medium">Category</th>

              <th className="pb-3 pr-3 font-medium">Level</th>

              <th className="pb-3 pr-3 font-medium">Parent</th>

              <th className="pb-3 pr-3 font-medium">Sort</th>

              <th className="pb-3 pr-3 font-medium">Status</th>

              <th className="pb-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCategories.map((category) => (
              <tr
                key={category._id}
                className="border-b border-stone-200/70 dark:border-stone-900"
              >
                <td className="py-4 pr-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
                    {category.bannerImage?.square?.url ? (
                      <Image
                        src={category.bannerImage.square.url}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-stone-400">
                        No Image
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-4 pr-3">
                  <div>
                    <p className="font-medium text-stone-900 dark:text-stone-100">
                      {category.name}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">{category.slug}</p>
                  </div>
                </td>

                <td className="py-4 pr-3">
                  {category.categoryLevel === 1 && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      Main Category
                    </span>
                  )}

                  {category.categoryLevel === 2 && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      Sub Category
                    </span>
                  )}

                  {category.categoryLevel === 3 && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Final Category
                    </span>
                  )}
                </td>

                <td className="py-4 pr-3">
                  {category.parentCategory?.name || "Root"}
                </td>

                <td className="py-4 pr-3">{category.sortOrder}</td>

                <td className="py-4 pr-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      category.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="py-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/categories/${category._id}/edit`}>
                      <Button size="icon" variant="outline">
                        <Pencil className="size-4" />
                      </Button>
                    </Link>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(category._id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!sortedCategories.length && (
          <p className="py-8 text-center text-sm text-stone-500">
            No categories found.
          </p>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-stone-200/70 pt-4 mt-4 dark:border-stone-900">
            <p className="text-xs text-stone-500">
              Page {validCurrentPage} of {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                disabled={validCurrentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="border-stone-300/70 bg-white dark:bg-stone-900 dark:border-stone-850"
              >
                <ChevronLeft className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="outline"
                disabled={validCurrentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="border-stone-300/70 bg-white dark:bg-stone-900 dark:border-stone-850"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
