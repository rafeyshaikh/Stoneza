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

import { uploadAdminImage } from "@/lib/uploadAdminImage";
import { generateSlug } from "@/lib/generateSlug";

const uploadImage = (file, folder = "collections") => uploadAdminImage(file, folder);

const EMPTY_FORM = {
  name: "",
  slug: "",
  isSlugManual: false,
  description: "",
  parentCollection: "none",
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

export default function CollectionForm({
  parentCollections = [],
  initialData = null,
  isEdit = false,
}) {
  const router = useRouter();
  const [formData, setFormData] = useState(() => {
    if (!initialData) return EMPTY_FORM;

    return {
      name: initialData.name || "",
      slug: initialData.slug || "",
      isSlugManual: Boolean(isEdit && initialData.slug),
      description: initialData.description || "",
      parentCollection: initialData.parentCollection?._id
        ? initialData.parentCollection._id.toString()
        : initialData.parentCollection
        ? initialData.parentCollection.toString()
        : "none",
      sortOrder: initialData.sortOrder ?? 0,
      isActive: initialData.isActive ?? true,
      bannerImage: {
        square: initialData.bannerImage?.square || { url: "", publicId: "" },
        wide: initialData.bannerImage?.wide || [],
      },
      seo: {
        metaTitle: initialData.seo?.metaTitle || "",
        metaDescription: initialData.seo?.metaDescription || "",
        keywords: Array.isArray(initialData.seo?.keywords)
          ? initialData.seo.keywords.join(", ")
          : initialData.seo?.keywords || "",
        canonicalUrl: initialData.seo?.canonicalUrl || "",
        ogImage: initialData.seo?.ogImage || "",
      },
    };
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [squareBannerFile, setSquareBannerFile] = useState(null);
  const [wideBanner1File, setWideBanner1File] = useState(null);
  const [wideBanner2File, setWideBanner2File] = useState(null);

  const level1Parents = parentCollections.filter(
    (item) => item.collectionLevel === 1 && (!initialData || item._id !== initialData._id)
  );

  const handleInputChange = (field, value) => {
    if (field === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: prev.isSlugManual ? prev.slug : generateSlug(value),
      }));
      return;
    }
    if (field === "slug") {
      const formatted = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        slug: formatted,
        isSlugManual: true,
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSeoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Collection name is required");
      return;
    }

    try {
      setLoading(true);
      setUploadingImages(true);

      let squareBanner = formData.bannerImage.square;
      let wide1 = formData.bannerImage.wide?.[0] || null;
      let wide2 = formData.bannerImage.wide?.[1] || null;

      if (squareBannerFile) {
        squareBanner = await uploadImage(squareBannerFile);
      }

      if (wideBanner1File) {
        wide1 = await uploadImage(wideBanner1File);
      }

      if (wideBanner2File) {
        wide2 = await uploadImage(wideBanner2File);
      }

      setUploadingImages(false);

      const wideBanners = [wide1, wide2].filter(
        (item) => item && (item.url || item.publicId)
      );

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        parentCollection:
          formData.parentCollection === "none"
            ? null
            : formData.parentCollection,
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: formData.isActive,
        bannerImage: {
          square: squareBanner,
          wide: wideBanners,
        },
        seo: {
          metaTitle: formData.seo.metaTitle.trim(),
          metaDescription: formData.seo.metaDescription.trim(),
          keywords: formData.seo.keywords
            ? formData.seo.keywords
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],
          canonicalUrl: formData.seo.canonicalUrl.trim(),
          ogImage: formData.seo.ogImage.trim(),
        },
      };

      delete payload.isSlugManual;

      const url = isEdit
        ? `/api/admin/collections/${initialData._id}`
        : "/api/admin/collections";

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        if (res.status === 413) {
          throw new Error("Collection data or images are too large for the server.");
        }
        throw new Error(`Server error (${res.status}: ${res.statusText || "Invalid response"})`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to save collection");
      }

      toast.success(
        isEdit
          ? "Collection updated successfully"
          : "Collection created successfully"
      );

      router.push("/admin/collections");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save collection");
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <Section title="Basic Details">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Collection Name *">
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g. Poolside Collection"
              required
            />
          </Field>

          <Field label="Slug (URL Path) *">
            <div className="relative flex items-center">
              <span className="inline-flex h-9 items-center px-3 rounded-l-md border border-r-0 border-stone-300 bg-stone-100 text-xs text-stone-500 font-mono select-none dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
                /collections/
              </span>
              <Input
                value={formData.slug || ""}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="e.g. poolside-collection"
                className="rounded-l-none font-mono text-sm pr-14"
                required
              />
              {formData.isSlugManual && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      slug: generateSlug(prev.name),
                      isSlugManual: false,
                    }));
                  }}
                  className="absolute right-2 text-[10px] text-amber-600 hover:text-amber-700 underline font-sans cursor-pointer"
                  title="Sync slug with collection name"
                >
                  Reset
                </button>
              )}
            </div>
          </Field>

          <Field label="Parent Collection (Optional)">
            <Select
              value={formData.parentCollection}
              onValueChange={(val) => handleInputChange("parentCollection", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Top Collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Level 1 Top Collection)</SelectItem>
                {level1Parents.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Sort Order">
            <Input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => handleInputChange("sortOrder", e.target.value)}
            />
          </Field>

          <div className="flex items-center justify-between rounded-xl border border-stone-300/70 p-4 dark:border-stone-800">
            <div>
              <p className="font-heading text-sm font-medium">Collection Active</p>
              <p className="text-xs text-stone-500">Toggle public visibility of this collection.</p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            />
          </div>
        </div>

        <Field label="Description">
          <Textarea
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Write a clear description for this collection..."
          />
        </Field>
      </Section>

      <Section title="Collection Banners">
        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Square Banner (1:1 Aspect)">
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
                    square: { url: "", publicId: "" },
                  },
                }));
              }}
              uploading={uploadingImages}
              hint="Used in collection cards and grid displays."
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
                    wide: prev.bannerImage.wide.filter((_, idx) => idx !== 0),
                  },
                }));
              }}
              uploading={uploadingImages}
              hint="Primary hero banner."
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
                    wide: prev.bannerImage.wide.filter((_, idx) => idx !== 1),
                  },
                }));
              }}
              uploading={uploadingImages}
              hint="Secondary promotional banner."
            />
          </Field>
        </div>
      </Section>

      <Section title="Search Engine Optimization (SEO)">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Meta Title">
            <Input
              value={formData.seo.metaTitle}
              onChange={(e) => handleSeoChange("metaTitle", e.target.value)}
              placeholder="e.g. Poolside Stone Collection | Stoneza"
            />
          </Field>

          <Field label="Canonical URL">
            <Input
              value={formData.seo.canonicalUrl}
              onChange={(e) => handleSeoChange("canonicalUrl", e.target.value)}
              placeholder="e.g. https://stoneza.in/collections/poolside-collection"
            />
          </Field>

          <Field label="Keywords (Comma separated)">
            <Input
              value={formData.seo.keywords}
              onChange={(e) => handleSeoChange("keywords", e.target.value)}
              placeholder="e.g. poolside stone, pool tiles, natural copings"
            />
          </Field>

          <Field label="OG Image URL">
            <Input
              value={formData.seo.ogImage}
              onChange={(e) => handleSeoChange("ogImage", e.target.value)}
              placeholder="https://..."
            />
          </Field>
        </div>

        <Field label="Meta Description">
          <Textarea
            rows={3}
            value={formData.seo.metaDescription}
            onChange={(e) => handleSeoChange("metaDescription", e.target.value)}
            placeholder="Meta description for search engine results..."
          />
        </Field>
      </Section>

      <div className="flex items-center justify-end gap-4 border-t border-stone-300/70 pt-6 dark:border-stone-800">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/collections")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900">
          {loading ? "Saving..." : isEdit ? "Update Collection" : "Create Collection"}
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-4 rounded-2xl border border-stone-300/70 bg-white/70 p-6 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/70">
      <h3 className="font-heading text-base font-bold tracking-wide text-stone-900 dark:text-stone-100">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400">
        {label}
      </Label>
      {children}
    </div>
  );
}
