"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function VariantManager({ variants = [] }) {
  return (
    <div className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-heading text-base font-semibold text-stone-900 dark:text-stone-100">Variants</h4>
        <Button variant="outline" size="sm">
          <Plus className="size-4" /> Add Variant
        </Button>
      </div>
      {!variants.length ? <p className="text-sm text-stone-500 dark:text-stone-400">No variants added yet.</p> : null}
    </div>
  );
}
