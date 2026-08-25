"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import TipTapEditor from "@/components/admin/editor/TipTapEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PageEditor({
  pageKey,
  title = "Static Page",
}) {
  const [content, setContent] = useState("");
  const [pageTitle, setPageTitle] = useState(title);
  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonicalUrl: "",
    ogImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPage();
  }, [pageKey]);

  const fetchPage = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/cms/pages/${pageKey}`);
      const data = await res.json();

      if (data.success) {
        setPageTitle(data.data?.title || title);
        setContent(data.data?.content || "");
        setSeo(data.data?.seo || {
          metaTitle: "",
          metaDescription: "",
          keywords: "",
          canonicalUrl: "",
          ogImage: "",
        });
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
          seo,
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
    <div className="space-y-5 w-full">
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

      {/* SEO & Metadata Section */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70 space-y-4">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">
          {title} SEO & Metadata
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400">Meta Title</Label>
            <Input
              placeholder={`e.g. ${title} | Stoneza`}
              value={seo.metaTitle || ""}
              onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400">Canonical URL</Label>
            <Input
              placeholder={`e.g. https://stoneza.in/${pageKey}`}
              value={seo.canonicalUrl || ""}
              onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400">Keywords (Comma separated)</Label>
            <Input
              placeholder="e.g. natural stone, terms, stoneza policy"
              value={seo.keywords || ""}
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400">OG Image URL</Label>
            <Input
              placeholder="https://..."
              value={seo.ogImage || ""}
              onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400">Meta Description</Label>
          <Textarea
            rows={3}
            placeholder={`Search engine description for the ${title} page...`}
            value={seo.metaDescription || ""}
            onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
        >
          {saving
            ? "Saving..."
            : `Save ${title}`}
        </Button>
      </div>
    </div>
  );
}