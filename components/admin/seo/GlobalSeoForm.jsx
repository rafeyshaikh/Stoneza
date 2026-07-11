"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import ImageUploader from "@/components/admin/products/ImageUploader";
import { toast } from "sonner";

export default function GlobalSeoForm({ data, onSave }) {
  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    ogImage: "",
    googleAnalyticsId: "",
    searchConsoleVerification: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        keywords: data.keywords || "",
        ogImage: data.ogImage || "",
        googleAnalyticsId: data.googleAnalyticsId || "",
        searchConsoleVerification: data.searchConsoleVerification || "",
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });

  const handleOgImageUpload = async (file) => {
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, folder: "seo" }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Upload failed");
      handleChange("ogImage", result.data.url);
      toast.success("OG Image uploaded successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload OG image");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSave}
      className="space-y-5 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70"
    >
      <div>
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">
          Global SEO & Brand Settings
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Manage general website descriptions, search console verifications, and sharing previews.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="seo-meta-title">Default Search/Page Title</Label>
            <Input
              id="seo-meta-title"
              placeholder="e.g. Stoneza - Natural Stone Showcase"
              value={formData.metaTitle}
              onChange={(e) => handleChange("metaTitle", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="seo-keywords">Search Keywords (Comma-separated)</Label>
            <Input
              id="seo-keywords"
              placeholder="natural stone, marble, granite"
              value={formData.keywords}
              onChange={(e) => handleChange("keywords", e.target.value)}
            />
          </div>

          <div className="grid gap-3 grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="seo-ga">Google Analytics ID</Label>
              <Input
                id="seo-ga"
                placeholder="e.g. G-XXXXXXX"
                value={formData.googleAnalyticsId}
                onChange={(e) => handleChange("googleAnalyticsId", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="seo-search-console">Search Console Code</Label>
              <Input
                id="seo-search-console"
                placeholder="e.g. google-site-verification"
                value={formData.searchConsoleVerification}
                onChange={(e) => handleChange("searchConsoleVerification", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="seo-meta-description">Default Meta Description</Label>
            <Textarea
              id="seo-meta-description"
              rows={4}
              placeholder="Enter fallback meta description description details..."
              value={formData.metaDescription}
              onChange={(e) => handleChange("metaDescription", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <ImageUploader
            existingImage={formData.ogImage ? { url: formData.ogImage } : null}
            onFileSelect={handleOgImageUpload}
            onRemove={() => handleChange("ogImage", "")}
            hint="Upload custom OG Image (used when page links are shared on WhatsApp/Socials)."
          />
        </div>
      </div>

      <div className="flex justify-end border-t pt-4">
        <Button type="submit" disabled={saving} className="shadow-sm cursor-pointer border border-black bg-white hover:bg-gray-100 text-stone-900">
          {saving ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" /> Save Global SEO
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
