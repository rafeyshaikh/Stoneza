"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function NewArrivalsManager({ title = "What's New", onChange }) {
  return (
    <section className="space-y-4 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
      <div>
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">
          New Arrivals Section Settings
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Manage the carousel heading for the New Arrivals section.
        </p>
      </div>

      <div className="max-w-md space-y-1.5">
        <Label htmlFor="new-arrivals-title">Section Heading Title</Label>
        <Input
          id="new-arrivals-title"
          placeholder="What's New"
          value={title}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </section>
  );
}
