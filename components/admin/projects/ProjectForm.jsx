"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/admin/products/ImageUploader";
import MultipleImageUploader from "@/components/admin/products/MultipleImageUploader";

import { uploadAdminImage } from "@/lib/uploadAdminImage";

const uploadImage = (file, folder = "projects") => uploadAdminImage(file, folder);

const SEGMENTS = [
  "Hospitality",
  "Residential",
  "Landscape",
  "Commercial",
  "Export",
  "other",
];

const EMPTY_FORM = {
  title: "",
  slug: "",
  description: "",
  segment: "Commercial",
  location: {
    city: "",
    state: "",
    formatted: "",
  },
  application: "",
  stone: "",
  products: "",
  supply: "",
  isFeatured: false,
  status: "published",
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    ogImage: "",
    canonicalUrl: "",
  },
};

export default function ProjectForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [formData, setFormData] = useState(
    initialData
      ? {
          ...initialData,
          location: {
            city: initialData.location?.city || "",
            state: initialData.location?.state || "",
            formatted: initialData.location?.formatted || "",
          },
          application: Array.isArray(initialData.application)
            ? initialData.application.join(", ")
            : initialData.application || "",
          products: Array.isArray(initialData.products)
            ? initialData.products.join(", ")
            : initialData.products || "",
          seo: {
            metaTitle: initialData.seo?.metaTitle || "",
            metaDescription: initialData.seo?.metaDescription || "",
            keywords: Array.isArray(initialData.seo?.keywords)
              ? initialData.seo.keywords.join(", ")
              : initialData.seo?.keywords || "",
            ogImage: initialData.seo?.ogImage || "",
            canonicalUrl: initialData.seo?.canonicalUrl || "",
          },
        }
      : EMPTY_FORM
  );

  // Banner image states
  const [bannerFile, setBannerFile] = useState(null);
  const [existingBanner, setExistingBanner] = useState(
    initialData?.bannerImage || null
  );

  // Multiple gallery images states
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [existingGallery, setExistingGallery] = useState(
    initialData?.images || []
  );

  const [submitting, setSubmitting] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const handleSeoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Project title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Project description is required");
      return;
    }

    try {
      setSubmitting(true);

      // 1. Banner Image Upload
      let bannerImage = existingBanner;
      if (bannerFile) {
        setUploadingProgress("Uploading banner image...");
        bannerImage = await uploadImage(bannerFile, "projects/banner");
      }

      // 2. Gallery Images Upload
      let uploadedGallery = [...existingGallery];
      if (galleryFiles.length > 0) {
        setUploadingProgress(
          `Uploading ${galleryFiles.length} gallery image(s)...`
        );
        for (let i = 0; i < galleryFiles.length; i++) {
          const imgData = await uploadImage(galleryFiles[i], "projects/gallery");
          uploadedGallery.push(imgData);
        }
      }

      setUploadingProgress("Saving project details...");

      // 3. Format payload
      const payload = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        segment: formData.segment,
        location: {
          city: formData.location.city,
          state: formData.location.state,
          formatted:
            formData.location.formatted ||
            [formData.location.city, formData.location.state]
              .filter(Boolean)
              .join(", "),
        },
        application: formData.application
          ? formData.application
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        stone: formData.stone,
        products: formData.products
          ? formData.products
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        supply: formData.supply,
        bannerImage,
        images: uploadedGallery,
        isFeatured: formData.isFeatured,
        status: formData.status,
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords
            ? formData.seo.keywords
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],
        },
      };

      const url = isEdit
        ? `/api/admin/projects/${initialData._id}`
        : "/api/admin/projects";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        if (res.status === 413) {
          throw new Error("Project data or images are too large for the server.");
        }
        throw new Error(`Server error (${res.status}: ${res.statusText || "Invalid response"})`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to save project");
      }

      toast.success(
        isEdit
          ? "Project updated successfully!"
          : "Project created successfully!"
      );
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong saving the project.");
    } finally {
      setSubmitting(false);
      setUploadingProgress("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-7xl space-y-6">
      {/* Header Back Bar */}
      <div className="flex items-center justify-between">
        <Link href="/admin/projects">
          <Button type="button" variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Projects
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={submitting}
          className="bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {uploadingProgress || (isEdit ? "Updating..." : "Creating...")}
            </>
          ) : isEdit ? (
            "Update Project"
          ) : (
            "Create Project"
          )}
        </Button>
      </div>

      {/* Basic Information */}
      <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-950">
        <div className="mb-6 border-b border-stone-100 pb-4 dark:border-stone-900">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            1. Overview & Basic Info
          </h3>
          <p className="text-xs text-stone-500">
            Define the project title, segment type, and main description.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Title */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Project Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Grand Resort & Spa Arrival Court"
              required
            />
          </div>

          {/* Custom Slug (Optional) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              URL Slug (Optional)
            </label>
            <Input
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="auto-generated-from-title-if-blank"
            />
            <p className="text-[11px] text-stone-400">
              Leave blank to automatically generate from the project title.
            </p>
          </div>

          {/* Segment Enum */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Segment [Enum] *
            </label>
            <select
              value={formData.segment}
              onChange={(e) => handleChange("segment", e.target.value)}
              className="w-full h-10 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-900 outline-hidden dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
              required
            >
              {SEGMENTS.map((seg) => (
                <option key={seg} value={seg}>
                  {seg}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Description *
            </label>
            <Textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Provide a comprehensive narrative about this project's stone design, architectural vision, and scale..."
              required
            />
          </div>
        </div>
      </section>

      {/* Specifications & Attributes */}
      <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-950">
        <div className="mb-6 border-b border-stone-100 pb-4 dark:border-stone-900">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            2. Specifications & Attributes
          </h3>
          <p className="text-xs text-stone-500">
            Detail the project location, stone type, applications, products, and supply terms.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Location City */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              City
            </label>
            <Input
              value={formData.location.city}
              onChange={(e) => handleLocationChange("city", e.target.value)}
              placeholder="e.g. Udaipur"
            />
          </div>

          {/* Location State */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              State / Region
            </label>
            <Input
              value={formData.location.state}
              onChange={(e) => handleLocationChange("state", e.target.value)}
              placeholder="e.g. Rajasthan"
            />
          </div>

          {/* Stone */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Stone Specification
            </label>
            <Input
              value={formData.stone}
              onChange={(e) => handleChange("stone", e.target.value)}
              placeholder="e.g. Castle Grey — Kandla Grey Sandstone"
            />
          </div>

          {/* Application */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Application Areas
            </label>
            <Input
              value={formData.application}
              onChange={(e) => handleChange("application", e.target.value)}
              placeholder="e.g. Arrival court, entrance approach, pool deck (comma-separated)"
            />
            <p className="text-[11px] text-stone-400">
              Separate multiple applications with commas.
            </p>
          </div>

          {/* Products */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Products Used
            </label>
            <Input
              value={formData.products}
              onChange={(e) => handleChange("products", e.target.value)}
              placeholder="e.g. Crazy paving, fieldstone cladding, step treads (comma-separated)"
            />
            <p className="text-[11px] text-stone-400">
              Separate multiple products with commas.
            </p>
          </div>

          {/* Supply */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Supply Model & Scope
            </label>
            <Input
              value={formData.supply}
              onChange={(e) => handleChange("supply", e.target.value)}
              placeholder="e.g. Quarry-direct, batch-matched across phases"
            />
          </div>
        </div>
      </section>

      {/* Media & Gallery */}
      <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-950">
        <div className="mb-6 border-b border-stone-100 pb-4 dark:border-stone-900">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            3. Project Media & Gallery
          </h3>
          <p className="text-xs text-stone-500">
            Upload a main showcase banner image and gallery imagery.
          </p>
        </div>

        <div className="space-y-6">
          {/* Banner Image */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Main Banner Image
            </label>
            <ImageUploader
              file={bannerFile}
              existingImage={existingBanner}
              onFileSelect={setBannerFile}
              onRemove={() => {
                setBannerFile(null);
                setExistingBanner(null);
              }}
              uploading={submitting}
              hint="Main hero image for project showcase cards."
            />
          </div>

          {/* Multiple Gallery Images */}
          <div className="space-y-2 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Gallery Images
            </label>
            <MultipleImageUploader
              files={galleryFiles}
              existingImages={existingGallery}
              onFilesChange={setGalleryFiles}
              onExistingImagesChange={setExistingGallery}
              uploading={submitting}
              hint="Upload high-res gallery shots showing installation details, wet vs dry textures, and applications."
            />
          </div>
        </div>
      </section>

      {/* SEO Settings */}
      <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-950">
        <div className="mb-6 border-b border-stone-100 pb-4 dark:border-stone-900">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            4. SEO & Metadata
          </h3>
          <p className="text-xs text-stone-500">
            Optimize this project page for search engines and social previews.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Meta Title
            </label>
            <Input
              value={formData.seo.metaTitle}
              onChange={(e) => handleSeoChange("metaTitle", e.target.value)}
              placeholder="e.g. Castle Grey Sandstone Project | Stoneza"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Keywords
            </label>
            <Input
              value={formData.seo.keywords}
              onChange={(e) => handleSeoChange("keywords", e.target.value)}
              placeholder="sandstone, crazy paving, resort paving"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Meta Description
            </label>
            <Textarea
              rows={3}
              value={formData.seo.metaDescription}
              onChange={(e) => handleSeoChange("metaDescription", e.target.value)}
              placeholder="Brief search summary..."
            />
          </div>
        </div>
      </section>

      {/* Status & Featured Toggle */}
      <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-950">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => handleChange("isFeatured", checked)}
            />
            <div>
              <label htmlFor="isFeatured" className="font-semibold text-sm cursor-pointer">
                Feature on Showcase / Homepage
              </label>
              <p className="text-xs text-stone-500">
                Highlights this project in premier sections across the site.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Switch
              id="statusToggle"
              checked={formData.status === "published"}
              onCheckedChange={(checked) =>
                handleChange("status", checked ? "published" : "draft")
              }
            />
            <div>
              <label htmlFor="statusToggle" className="font-semibold text-sm cursor-pointer">
                Status: {formData.status === "published" ? "Published" : "Draft"}
              </label>
              <p className="text-xs text-stone-500">
                {formData.status === "published"
                  ? "Visible on the live website."
                  : "Saved as draft, hidden from visitors."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Submission */}
      <div className="flex justify-end gap-3">
        <Link href="/admin/projects">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={submitting}
          className="bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {uploadingProgress || (isEdit ? "Updating..." : "Creating...")}
            </>
          ) : isEdit ? (
            "Update Project"
          ) : (
            "Create Project"
          )}
        </Button>
      </div>
    </form>
  );
}
