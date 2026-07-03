"use client";

import { Button } from "@/components/ui/button";

export default function ConfirmDialog({ open, title, description, onCancel, onConfirm }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-md rounded-2xl border border-stone-300 bg-stone-50 p-5 shadow-xl dark:border-stone-800 dark:bg-stone-950">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">{title}</h3>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}
