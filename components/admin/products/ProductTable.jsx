"use client";

import { useMemo, useState } from "react";

import SearchBar from "@/components/admin/shared/SearchBar";
import { Button } from "@/components/ui/button";

export default function ProductTable({ products = [] }) {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return `${product.name} ${product.slug}`.toLowerCase().includes(query.toLowerCase());
    });
  }, [products, query]);

  return (
    <div className="space-y-4 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar value={query} onChange={setQuery} placeholder="Search products" />
        <Button variant="destructive">Bulk Delete</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone-300/70 text-stone-500 dark:border-stone-800 dark:text-stone-400">
              <th className="pb-3 pr-3 font-medium">Name</th>
              <th className="pb-3 pr-3 font-medium">Category</th>
              <th className="pb-3 pr-3 font-medium">Price</th>
              <th className="pb-3 pr-3 font-medium">Stock</th>
              <th className="pb-3 pr-3 font-medium">Featured</th>
              <th className="pb-3 pr-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-b border-stone-200/70 dark:border-stone-900">
                <td className="py-3 pr-3 text-stone-900 dark:text-stone-100">{product.name}</td>
                <td className="py-3 pr-3">{product.category?.name || "-"}</td>
                <td className="py-3 pr-3">INR {Number(product.price || 0).toLocaleString("en-IN")}</td>
                <td className="py-3 pr-3">{product.stock ?? 0}</td>
                <td className="py-3 pr-3">{product.isFeatured ? "Yes" : "No"}</td>
                <td className="py-3 pr-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
