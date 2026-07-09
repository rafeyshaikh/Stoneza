"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";


export default function BlogsTable({ blogs = [] }) {
  const router = useRouter();
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Blog deleted successfully");

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Failed to delete blog");
    }
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-300/70 bg-stone-50/80 p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-stone-300/70 text-stone-500 dark:border-stone-800 dark:text-stone-400">
            <th className="pb-3 pr-3 font-medium">Banner</th>

            <th className="pb-3 pr-3 font-medium">Blog</th>

            <th className="pb-3 pr-3 font-medium">Author</th>

            <th className="pb-3 pr-3 font-medium">Status</th>

            <th className="pb-3 pr-3 font-medium">Published</th>

            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr
              key={blog._id}
              className="border-b border-stone-200/70 dark:border-stone-900"
            >
              <td className="py-4 pr-3">
                <div className="relative h-14 w-24 overflow-hidden rounded-lg border dark:border-stone-800">
                  <Image
                    src={blog.bannerImage?.url}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </td>

              <td className="py-4 pr-3">
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">
                    {blog.title}
                  </p>

                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{blog.slug}</p>
                </div>
              </td>

              <td className="py-4 pr-3">{blog.author}</td>

              <td className="py-4 pr-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    blog.status === "published"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {blog.status}
                </span>
              </td>

              <td className="py-4 pr-3">
                {blog.publishedAt
                  ? new Date(blog.publishedAt).toLocaleDateString("en-IN")
                  : "-"}
              </td>

              <td className="py-4">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/cms/blogs/${blog._id}/edit`}>
                    <Button size="icon" variant="outline" className="hover:bg-stone-200/80 dark:hover:bg-stone-900 cursor-pointer">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(blog._id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!blogs.length ? (
        <p className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">
          No blogs found.
        </p>
      ) : null}
    </div>
  );
}
