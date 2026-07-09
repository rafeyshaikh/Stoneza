"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import TipTapEditor from "@/components/admin/editor/TipTapEditor";

export default function PageEditor({
  pageKey,
  title = "Static Page",
}) {
  const [content, setContent] = useState("");
  const [pageTitle, setPageTitle] = useState(title);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/cms/pages/${pageKey}`);
      const data = await res.json();

      if (data.success) {
        setPageTitle(data.data?.title || title);
        setContent(data.data?.content || "");
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to load ${title}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await fetch(`/api/admin/cms/pages/${pageKey}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: pageTitle,
          content,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(`${title} updated successfully`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">
          {title} Content
        </h3>

        <div className="mt-4">
          {loading ? (
            <div className="flex h-[400px] items-center justify-center text-stone-500 dark:text-stone-400">
              Loading...
            </div>
          ) : (
            <TipTapEditor
              value={content}
              onChange={setContent}
              placeholder={`Write ${title} content...`}
            />
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : `Save ${title}`}
        </Button>
      </div>
    </div>
  );
}