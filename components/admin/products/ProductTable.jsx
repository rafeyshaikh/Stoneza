"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

import SearchBar from "@/components/admin/shared/SearchBar";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductTable({ products = [], categories = [] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");

  const [items, setItems] = useState(products);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    fetchProducts();
  }, [debouncedQuery, page, category, status, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1); // reset to page 1 whenever the search term changes
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  async function fetchProducts() {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit: 10,
        query: debouncedQuery,
        category,
        status,
        sort,
      });

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setItems(data.data.items);
      setTotalPages(data.data.pagination.totalPages);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Product deleted successfully");
      router.refresh();
      fetchProducts(); // refresh the current page's rows too
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to delete product");
    }
  }

  function handleFilterChange(setter) {
    return (value) => {
      setter(value === "all" ? "" : value);
      setPage(1); // any filter/sort change should reset pagination
    };
  }

  return (
    <div className="space-y-4 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search products"
        />

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={category || "all"}
            onValueChange={handleFilterChange(setCategory)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent
              className="z-50 border border-stone-200 bg-white shadow-lg dark:border-stone-800 dark:bg-stone-900"
              position="popper"
              side="bottom"
              align="start"
              avoidCollisions={false}
              sideOffset={4}
            >
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status || "all"}
            onValueChange={handleFilterChange(setStatus)}
          >
            <SelectTrigger className="w-[140px]">
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
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={handleFilterChange(setSort)}>
            <SelectTrigger className="w-[160px]">
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
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* <Button variant="destructive">Bulk Delete</Button> */}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone-300/70 text-stone-500 dark:border-stone-800 dark:text-stone-400">
              <th className="pb-3 pr-3 font-medium">Product</th>
              <th className="pb-3 pr-3 font-medium">Category</th>
              <th className="pb-3 pr-3 font-medium">Price</th>
              <th className="pb-3 pr-3 font-medium">Stock</th>
              <th className="pb-3 pr-3 font-medium">Status</th>
              <th className="pb-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6">
                  <p className="py-10 text-center text-sm text-stone-500">
                    Loading...
                  </p>
                </td>
              </tr>
            )}

            {!loading &&
              items.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-stone-200/70 hover:bg-stone-100/50 dark:border-stone-900 dark:hover:bg-stone-900/40"
                >
                  {/* Product */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl border bg-stone-100 dark:bg-stone-900">
                        {product.images?.[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-stone-400">
                            No Image
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-stone-900 dark:text-stone-100">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs text-stone-500">
                          SKU: {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 pr-4">{product.category?.name || "-"}</td>

                  {/* Price */}
                  <td className="py-4 pr-4">
                    {product.discountPrice ? (
                      <div>
                        <p className="font-semibold text-stone-900 dark:text-stone-100">
                          ₹
                          {Number(product.discountPrice).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                        <p className="text-xs text-stone-500 line-through">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ) : (
                      <span className="font-medium">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="py-4 pr-4">
                    <StockBadge stock={product.stock} />
                  </td>

                  {/* Status */}
                  <td className="py-4 pr-4">
                    <StatusBadge status={product.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product._id}/edit`}>
                        <Button size="icon" variant="outline">
                          <Pencil className="size-4" />
                        </Button>
                      </Link>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && !items.length && (
              <tr>
                <td colSpan="6">
                  <p className="py-10 text-center text-sm text-stone-500">
                    No products found.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stone-200/70 pt-3 dark:border-stone-900">
          <p className="text-xs text-stone-500">
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

function StockBadge({ stock }) {
  if (stock <= 0) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
        Out of Stock
      </span>
    );
  }

  if (stock <= 10) {
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
        Low ({stock})
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
      {stock} In Stock
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        status === "published"
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      }`}
    >
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}
