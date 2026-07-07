"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import BlogsEditor from "@/components/admin/blogs/BlogsEditor";
import ImageUploader from "@/components/admin/products/ImageUploader";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result);

    reader.onerror = () => reject(new Error("Could not read file"));

    reader.readAsDataURL(file);
  });
}

async function uploadImage(file, folder = "blogs/banner") {
  const base64 = await fileToBase64(file);

  const response = await fetch("/api/admin/upload", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      image: base64,
      folder,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
}

const EMPTY_FORM = {
  title: "",

  excerpt: "",

  content: "",

  tags: "",

  status: "draft",

  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: "",

    canonicalUrl: "",

    ogImage: "",
  },
};

export default function BlogForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [formData, setFormData] = useState(
    initialData
      ? {
          ...initialData,

          tags: initialData.tags?.join(", ") || "",

          seo: {
            ...initialData.seo,

            keywords: initialData.seo?.keywords?.join(", ") || "",
          },
        }
      : EMPTY_FORM,
  );

  const [bannerFile, setBannerFile] = useState(null);

  const [existingBanner, setExistingBanner] = useState(
    initialData?.bannerImage || null,
  );

  const [submitting, setSubmitting] = useState(false);

  const [uploadingBanner, setUploadingBanner] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSeoChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      let bannerImage = existingBanner;

      if (bannerFile) {
        setUploadingBanner(true);

        bannerImage = await uploadImage(bannerFile, "blogs/banner");

        setUploadingBanner(false);
      }

      const payload = {
        ...formData,

        bannerImage,

        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),

        seo: {
          ...formData.seo,

          keywords: formData.seo.keywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      };

      const response = await fetch(
        isEdit ? `/api/admin/cms/blogs/${initialData._id}` : "/api/admin/cms/blogs",
        {
          method: isEdit ? "PATCH" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(
        isEdit ? "Blog updated successfully" : "Blog created successfully",
      );

      setFormData(EMPTY_FORM);

      setBannerFile(null);

      router.push("/admin/cms/blogs");
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          (isEdit ? "Failed to update blog" : "Failed to create blog"),
      );
    } finally {
      setSubmitting(false);

      setUploadingBanner(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto space-y-6">
      {/* Basic Information */}
      <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-stone-950">
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Blog Information</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Create an SEO-friendly article for Stoneza.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>

            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Best Natural Stones For Pool Areas"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Excerpt</label>

            <Textarea
              rows={4}
              value={formData.excerpt}
              onChange={(e) => handleChange("excerpt", e.target.value)}
              placeholder="Short description for blog cards and SEO..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">
              Blog Banner (2200 × 640)
            </label>

            <ImageUploader
              file={bannerFile}
              existingImage={existingBanner}
              onFileSelect={setBannerFile}
              onRemove={() => {
                setBannerFile(null);
                setExistingBanner(null);
              }}
              uploading={uploadingBanner || submitting}
              hint="Recommended size: 2200 × 640 pixels."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Content</label>

            <BlogsEditor
              title="Blog"
              value={formData.content}
              onChange={(value) => handleChange("content", value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Tags</label>

            <Input
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="marble, granite, pool tiles"
            />
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-stone-950">
        <div className="mb-6">
          <h3 className="text-xl font-semibold">SEO Settings</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Optimize this blog post for search engines.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            placeholder="Meta Title"
            value={formData.seo.metaTitle}
            onChange={(e) => handleSeoChange("metaTitle", e.target.value)}
          />

          <Input
            placeholder="Keywords"
            value={formData.seo.keywords}
            onChange={(e) => handleSeoChange("keywords", e.target.value)}
          />

          <Input
            placeholder="Canonical URL"
            value={formData.seo.canonicalUrl}
            onChange={(e) => handleSeoChange("canonicalUrl", e.target.value)}
          />

          <Input
            placeholder="OG Image URL"
            value={formData.seo.ogImage}
            onChange={(e) => handleSeoChange("ogImage", e.target.value)}
          />

          <div className="md:col-span-2">
            <Textarea
              rows={4}
              placeholder="Meta Description"
              value={formData.seo.metaDescription}
              onChange={(e) =>
                handleSeoChange("metaDescription", e.target.value)
              }
            />
          </div>
        </div>
      </section>

      {/* Publishing */}
      <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-stone-950">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Publish Blog</h4>

            <p className="text-sm text-muted-foreground">
              Enable this to make the blog visible on the website.
            </p>
          </div>

          <Switch
            checked={formData.status === "published"}
            onCheckedChange={(checked) =>
              handleChange("status", checked ? "published" : "draft")
            }
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Button size="lg" disabled={submitting}>
          {uploadingBanner
            ? "Uploading Banner..."
            : submitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Blog"
                : "Create Blog"}
        </Button>
      </div>
    </form>
  );
}
