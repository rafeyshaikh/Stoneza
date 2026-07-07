"use client";

import TipTapEditor from "@/components/admin/editor/TipTapEditor";

export default function BlogsEditor({
  title = "New Blog Page",
  value = "",
  onChange,
}) {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">
          {title} Content
        </h3>

        <div className="mt-4">
          <TipTapEditor
            value={value}
            onChange={onChange}
            placeholder={`Write ${title} content...`}
          />
        </div>
      </section>
    </div>
  );
}