"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function CategoryTable({ categories = [] }) {
  const router = useRouter();

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

  return (
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
          {categories.map((category) => (
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

      {!categories.length && (
        <p className="py-8 text-center text-sm text-stone-500">
          No categories found.
        </p>
      )}
    </div>
  );
}
