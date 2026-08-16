"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  MapPin,
  Sparkles,
  Building2,
  Eye,
  MoreVertical,
  CheckSquare,
  Square,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ProjectTable({ initialProjects = [] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const SEGMENTS = [
    "Hospitality",
    "Residential",
    "Landscape",
    "Commercial",
    "Export",
    "other",
  ];

  // Filter projects based on search query, segment, and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location?.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.stone?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSegment =
      selectedSegment === "all" ||
      project.segment?.toLowerCase() === selectedSegment.toLowerCase();

    const matchesStatus =
      selectedStatus === "all" || project.status === selectedStatus;

    return matchesSearch && matchesSegment && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProjects.map((p) => p._id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSingle = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete project");
      }

      toast.success("Project deleted successfully");
      setProjects((prev) => prev.filter((item) => item._id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } catch (error) {
      toast.error(error.message || "Error deleting project");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.length} selected project(s)?`
      )
    )
      return;

    try {
      setIsBulkDeleting(true);
      const res = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to bulk delete projects");
      }

      toast.success(`${selectedIds.length} projects deleted successfully`);
      setProjects((prev) => prev.filter((p) => !selectedIds.includes(p._id)));
      setSelectedIds([]);
    } catch (error) {
      toast.error(error.message || "Error performing bulk delete");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-stone-800 dark:bg-stone-950">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <Input
              type="text"
              placeholder="Search title, city, state, stone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-stone-50/50 dark:bg-stone-900/50"
            />
          </div>

          {/* Segment Filter */}
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-stone-500" />
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              aria-label="Filter by segment"
              className="h-10 rounded-md border border-stone-200 bg-stone-50/50 px-3 text-sm font-medium text-stone-800 outline-hidden dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-200"
            >
              <option value="all">All Segments</option>
              {SEGMENTS.map((seg) => (
                <option key={seg} value={seg}>
                  {seg}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter by status"
            className="h-10 rounded-md border border-stone-200 bg-stone-50/50 px-3 text-sm font-medium text-stone-800 outline-hidden dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-200"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
            >
              <Trash2 className="mr-1.5 size-4" />
              Delete Selected ({selectedIds.length})
            </Button>
          )}

        </div>
      </div>

      {/* Projects Table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-700 dark:text-stone-300">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase font-semibold text-stone-600 dark:border-stone-800 dark:bg-stone-900/80 dark:text-stone-400">
              <tr>
                <th className="p-4 w-10">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="cursor-pointer text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                  >
                    {selectedIds.length > 0 &&
                    selectedIds.length === filteredProjects.length ? (
                      <CheckSquare className="size-4 text-stone-900 dark:text-stone-100" />
                    ) : (
                      <Square className="size-4" />
                    )}
                  </button>
                </th>
                <th className="py-4 px-4">Project</th>
                <th className="py-4 px-4">Segment</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Stone & Supply</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500">
                    <Building2 className="mx-auto size-10 text-stone-300 dark:text-stone-700 mb-2" />
                    <p className="font-medium text-base text-stone-900 dark:text-stone-100">
                      No projects found
                    </p>
                    <p className="text-sm mt-1">
                      {searchQuery || selectedSegment !== "all"
                        ? "Try clearing filters or search terms."
                        : "Get started by creating your first showcase project."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => {
                  const isSelected = selectedIds.includes(project._id);
                  const displayImage =
                    project.bannerImage?.url ||
                    project.images?.[0]?.url ||
                    null;

                  const locationText =
                    project.location?.formatted ||
                    [project.location?.city, project.location?.state]
                      .filter(Boolean)
                      .join(", ") ||
                    "—";

                  return (
                    <tr
                      key={project._id}
                      className={`group transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-900/50 ${
                        isSelected ? "bg-stone-50/90 dark:bg-stone-900/80" : ""
                      }`}
                    >
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => toggleSelect(project._id)}
                          className="cursor-pointer text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                        >
                          {isSelected ? (
                            <CheckSquare className="size-4 text-stone-900 dark:text-stone-100" />
                          ) : (
                            <Square className="size-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 shrink-0 dark:border-stone-800 dark:bg-stone-900">
                            {displayImage ? (
                              <Image
                                src={displayImage}
                                alt={project.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-stone-400">
                                <Building2 className="size-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-stone-900 dark:text-stone-100">
                                {project.title}
                              </span>
                              {project.isFeatured && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] py-0 px-1.5 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900">
                                  <Sparkles className="mr-1 size-3 inline" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant="outline"
                          className="font-normal capitalize bg-stone-100 border-stone-300 text-stone-800 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-300"
                        >
                          {project.segment || "Other"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 text-xs">
                          <MapPin className="size-3.5 text-stone-400 shrink-0" />
                          <span>{locationText}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="text-xs font-medium text-stone-900 dark:text-stone-100 line-clamp-1">
                            {project.stone || "—"}
                          </p>
                          {project.supply && (
                            <p className="text-[11px] text-stone-500 line-clamp-1">
                              Supply: {project.supply}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          className={
                            project.status === "published"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900"
                              : "bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-400"
                          }
                        >
                          {project.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/projects/${project._id}`}>
                            <Button variant="ghost" size="icon" className="size-8">
                              <Pencil className="size-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                            onClick={() => handleDeleteSingle(project._id)}
                            disabled={deletingId === project._id}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
