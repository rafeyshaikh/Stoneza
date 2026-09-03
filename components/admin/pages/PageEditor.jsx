"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import TipTapEditor from "@/components/admin/editor/TipTapEditor";
import SeoManager from "@/components/admin/seo/SeoManager";

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
    ogTitle: "",
    ogDescription: "",
    ogUrl: "",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    robotsIndex: true,
    robotsFollow: true,
    enableCustomJsonLd: false,
    customJsonLd: "",
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
        setSeo({
          metaTitle: data.data?.seo?.metaTitle || "",
          metaDescription: data.data?.seo?.metaDescription || "",
          keywords: Array.isArray(data.data?.seo?.keywords)
            ? data.data.seo.keywords.join(", ")
            : data.data?.seo?.keywords || "",
          canonicalUrl: data.data?.seo?.canonicalUrl || "",
          ogImage: data.data?.seo?.ogImage || "",
          ogTitle: data.data?.seo?.ogTitle || "",
          ogDescription: data.data?.seo?.ogDescription || "",
          ogUrl: data.data?.seo?.ogUrl || "",
          ogType: data.data?.seo?.ogType || "website",
          twitterCard: data.data?.seo?.twitterCard || "summary_large_image",
          twitterTitle: data.data?.seo?.twitterTitle || "",
          twitterDescription: data.data?.seo?.twitterDescription || "",
          twitterImage: data.data?.seo?.twitterImage || "",
          robotsIndex: data.data?.seo?.robotsIndex !== false,
          robotsFollow: data.data?.seo?.robotsFollow !== false,
          enableCustomJsonLd: Boolean(data.data?.seo?.enableCustomJsonLd),
          customJsonLd: data.data?.seo?.customJsonLd || "",
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
          seo: {
            ...seo,
            keywords: typeof seo.keywords === "string"
              ? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean)
              : seo.keywords || [],
          },
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
    <div className="space-y-6 w-full">
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
      <SeoManager
        seo={seo}
        onChange={(field, value) => setSeo((prev) => ({ ...prev, [field]: value }))}
        entityContext={{
          type: "page",
          name: pageTitle || title,
          description: content,
          path: `/${pageKey}`,
        }}
      />

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