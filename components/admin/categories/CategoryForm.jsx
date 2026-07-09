"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import ImageUploader from "@/components/admin/products/ImageUploader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new Error("Could not read the selected file"));
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file, folder = "categories") {
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
    throw new Error(data.message || "Image upload failed");
  }

  return data.data;
}

const EMPTY_FORM = {
  name: "",

  description: "",

  parentCategory: "none",

  sortOrder: 0,

  isActive: true,

  bannerImage: {
    square: {
      url: "",
      publicId: "",
    },

    wide: [],
  },

  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonicalUrl: "",
    ogImage: "",
  },
};

export default function CategoryForm({
  parentCategories = [],
  initialData = null,
  isEdit = false,
}) {
  const router = useRouter();
  const [formData, setFormData] = useState(() => {

    if (!initialData) return EMPTY_FORM;

    return {
      name: initialData.name || "",

      description: initialData.description || "",

      parentCategory: initialData.parentCategory || "none",

      sortOrder: initialData.sortOrder || 0,

      isActive:
        initialData.isActive === undefined ? true : initialData.isActive,

      bannerImage: {
        square: initialData.bannerImage?.square || {
          url: "",
          publicId: "",
        },

        wide: initialData.bannerImage?.wide || [],
      },

      seo: {
        metaTitle: initialData.seo?.metaTitle || "",

        metaDescription: initialData.seo?.metaDescription || "",

        keywords: initialData.seo?.keywords?.join(", ") || "",

        canonicalUrl: initialData.seo?.canonicalUrl || "",

        ogImage: initialData.seo?.ogImage || "",
      },
    };
  });
  const [squareBannerFile, setSquareBannerFile] = useState(null);

  const [wideBanner1File, setWideBanner1File] = useState(null);

  const [wideBanner2File, setWideBanner2File] = useState(null);

  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
    setSubmitError("");

    try {
      setSubmitting(true);

      setUploadingImages(true);

      let squareBanner = formData.bannerImage.square;

      if (squareBannerFile) {
        squareBanner = await uploadImage(squareBannerFile, "categories/square");
      }

      const wideBanners = [];

      if (wideBanner1File) {
        const uploaded = await uploadImage(wideBanner1File, "categories/wide");

        wideBanners.push(uploaded);
      } else if (formData.bannerImage.wide?.[0]) {
        wideBanners.push(formData.bannerImage.wide[0]);
      }

      if (wideBanner2File) {
        const uploaded = await uploadImage(wideBanner2File, "categories/wide");

        wideBanners.push(uploaded);
      } else if (formData.bannerImage.wide?.[1]) {
        wideBanners.push(formData.bannerImage.wide[1]);
      }

      setUploadingImages(false);

      const payload = {
        ...formData,

        bannerImage: {
          square: squareBanner,

          wide: wideBanners,
        },

        parentCategory:
          formData.parentCategory === "none" ? null : formData.parentCategory,

        seo: {
          ...formData.seo,

          keywords: formData.seo.keywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      };

      const response = await fetch(
        isEdit
          ? `/api/admin/categories/${initialData._id}`
          : "/api/admin/categories",
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
        throw new Error(data.message || "Failed to save category");
      }

      toast.success(
        isEdit
          ? "Category updated successfully"
          : "Category created successfully",
      );

      router.push("/admin/categories");
      router.refresh();

      if (!isEdit) {
        setFormData(EMPTY_FORM);

        setSquareBannerFile(null);

        setWideBanner1File(null);

        setWideBanner2File(null);
      }
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "Something went wrong");
      toast.error(error.message || "Failed to save category");
    } finally {
      setUploadingImages(false);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold text-stone-900 dark:text-stone-100">
          Basic Information
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Category name" htmlFor="category-name">
            <Input
              id="category-name"
              placeholder="e.g. Landscape and Outdoor Living"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Field>

          <Field label="Parent category" htmlFor="parent-category">
            <ParentCategorySelect
              categories={parentCategories}
              value={formData.parentCategory}
              onChange={(value) => handleChange("parentCategory", value)}
            />
          </Field>

          <Field label="Sort order" htmlFor="sort-order">
            <Input
              id="sort-order"
              type="number"
              placeholder="0"
              value={formData.sortOrder}
              onChange={(e) =>
                handleChange("sortOrder", Number(e.target.value))
              }
            />
          </Field>

          <Field label="Status">
            <div className="flex h-10 items-center gap-3">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
              />
              <span className="text-sm text-stone-600 dark:text-stone-300">
                {formData.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </Field>

          <Field
            label="Description"
            htmlFor="category-description"
            className="md:col-span-2"
          >
            <Textarea
              id="category-description"
              placeholder="Short description of this category"
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Field>
        </div>
      </section>

      {/* Category Banners */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold text-stone-900 dark:text-stone-100">
          Category Banners
        </h3>

        <div className="space-y-6">
          <Field label="Square Banner (1000 × 1000)">
            <ImageUploader
              file={squareBannerFile}
              existingImage={formData.bannerImage.square}
              onFileSelect={setSquareBannerFile}
              onRemove={() => {
                setSquareBannerFile(null);

                setFormData((prev) => ({
                  ...prev,

                  bannerImage: {
                    ...prev.bannerImage,

                    square: {
                      url: "",
                      publicId: "",
                    },
                  },
                }));
              }}
              uploading={uploadingImages}
              hint="Used in category cards and collection sections."
            />
          </Field>

          <Field label="Wide Banner 1 (2200 × 640)">
            <ImageUploader
              file={wideBanner1File}
              existingImage={formData.bannerImage.wide?.[0]}
              onFileSelect={setWideBanner1File}
              onRemove={() => {
                setWideBanner1File(null);

                setFormData((prev) => ({
                  ...prev,

                  bannerImage: {
                    ...prev.bannerImage,

                    wide: [prev.bannerImage.wide?.[1] || null].filter(Boolean),
                  },
                }));
              }}
              uploading={uploadingImages}
              hint="Desktop hero banner."
            />
          </Field>

          <Field label="Wide Banner 2 (2200 × 640)">
            <ImageUploader
              file={wideBanner2File}
              existingImage={formData.bannerImage.wide?.[1]}
              onFileSelect={setWideBanner2File}
              onRemove={() => {
                setWideBanner2File(null);

                setFormData((prev) => ({
                  ...prev,

                  bannerImage: {
                    ...prev.bannerImage,

                    wide: [prev.bannerImage.wide?.[0] || null].filter(Boolean),
                  },
                }));
              }}
              uploading={uploadingImages}
              hint="Alternative banner for homepage or campaigns."
            />
          </Field>
        </div>
      </section>

      {/* SEO Settings */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold text-stone-900 dark:text-stone-100">
          SEO Settings
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Meta title" htmlFor="meta-title">
            <Input
              id="meta-title"
              placeholder="Meta title"
              value={formData.seo.metaTitle}
              onChange={(e) => handleSeoChange("metaTitle", e.target.value)}
            />
          </Field>

          <Field label="Keywords" htmlFor="keywords">
            <Input
              id="keywords"
              placeholder="comma, separated, keywords"
              value={formData.seo.keywords}
              onChange={(e) => handleSeoChange("keywords", e.target.value)}
            />
          </Field>

          <Field label="Canonical URL" htmlFor="canonical-url">
            <Input
              id="canonical-url"
              placeholder="https://example.com/category-slug"
              value={formData.seo.canonicalUrl}
              onChange={(e) => handleSeoChange("canonicalUrl", e.target.value)}
            />
          </Field>

          <Field label="OG image URL" htmlFor="og-image">
            <Input
              id="og-image"
              placeholder="https://example.com/og-image.jpg"
              value={formData.seo.ogImage}
              onChange={(e) => handleSeoChange("ogImage", e.target.value)}
            />
          </Field>

          <Field
            label="Meta description"
            htmlFor="meta-description"
            className="md:col-span-2"
          >
            <Textarea
              id="meta-description"
              placeholder="Meta description"
              rows={3}
              value={formData.seo.metaDescription}
              onChange={(e) =>
                handleSeoChange("metaDescription", e.target.value)
              }
            />
          </Field>
        </div>
      </section>

      {submitError && (
        <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting}
          className="rounded-lg border border-stone-900 bg-stone-900 px-5 py-2 text-white transition-colors hover:bg-stone-800 disabled:opacity-60 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          {uploadingImages
            ? "Uploading banners..."
            : submitting
              ? isEdit
                ? "Updating..."
                : "Saving..."
              : isEdit
                ? "Update Category"
                : "Save Category"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <Label
        htmlFor={htmlFor}
        className="text-sm font-medium text-stone-700 dark:text-stone-300"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

function ParentCategorySelect({ categories, value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id="parent-category" className="min-w-[220px] w-full">
        <SelectValue placeholder="Select parent category" />
      </SelectTrigger>

      <SelectContent
        className="z-50 border border-stone-200 bg-white shadow-lg dark:border-stone-800 dark:bg-stone-900"
        position="popper"
        side="bottom"
        align="start"
        avoidCollisions={false}
        sideOffset={4}
      >
        <SelectItem value="none">No Parent (Main Category)</SelectItem>

        {categories.map((category) => (
          <SelectItem key={category._id} value={category._id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
