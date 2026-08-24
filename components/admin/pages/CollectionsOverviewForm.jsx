"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/admin/products/ImageUploader";
import { uploadAdminImage } from "@/lib/uploadAdminImage";

const DEFAULT_COLLECTIONS_DATA = {
  title: "Collections",
  description: "Twelve named collections. Each one is a way of working with stone, not a group of colours.",
  bannerImage: {
    square: { url: "", publicId: "" },
    wide: [{ url: "", publicId: "" }],
  },
  megamenu: {
    enabled: true,
    featuredCard: {
      eyebrow: "Featured Collection",
      title: "",
      description: "",
      image: { url: "", publicId: "" },
      badge: "",
      href: "",
    },
  },
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonicalUrl: "",
    ogImage: "",
  },
};

export default function CollectionsOverviewForm() {
  const [data, setData] = useState(DEFAULT_COLLECTIONS_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const uploadImage = async (file, folder = "pages/collections") => {
    try {
      return await uploadAdminImage(file, folder);
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to upload image");
      return null;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/cms/pages/collectionsOverview");
      const result = await res.json();

      if (result.success && result.data) {
        setData({
          title: result.data.title || DEFAULT_COLLECTIONS_DATA.title,
          description: result.data.description || DEFAULT_COLLECTIONS_DATA.description,
          bannerImage: {
            square: {
              url: result.data.bannerImage?.square?.url || "",
              publicId: result.data.bannerImage?.square?.publicId || "",
            },
            wide: Array.isArray(result.data.bannerImage?.wide) && result.data.bannerImage.wide.length > 0
              ? result.data.bannerImage.wide
              : [{ url: "", publicId: "" }],
          },
          megamenu: {
            enabled: result.data.megamenu?.enabled ?? true,
            featuredCard: {
              eyebrow: result.data.megamenu?.featuredCard?.eyebrow || "Featured Collection",
              title: result.data.megamenu?.featuredCard?.title || "",
              description: result.data.megamenu?.featuredCard?.description || "",
              image: {
                url: result.data.megamenu?.featuredCard?.image?.url || "",
                publicId: result.data.megamenu?.featuredCard?.image?.publicId || "",
              },
              badge: result.data.megamenu?.featuredCard?.badge || "",
              href: result.data.megamenu?.featuredCard?.href || "",
            },
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load Collections overview settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = JSON.parse(JSON.stringify(data));

      // 1. Process Square Banner image
      if (data.bannerImage?.square?.pendingFile) {
        toast.loading("Uploading square banner image...", { id: "collections-save" });
        const uploaded = await uploadImage(data.bannerImage.square.pendingFile, "pages/collections/square");
        if (uploaded) {
          payload.bannerImage.square = uploaded;
        }
      }
      if (payload.bannerImage?.square) {
        delete payload.bannerImage.square.pendingFile;
      }

      // 2. Process Wide Banner image
      if (data.bannerImage?.wide?.[0]?.pendingFile) {
        toast.loading("Uploading wide banner image...", { id: "collections-save" });
        const uploaded = await uploadImage(data.bannerImage.wide[0].pendingFile, "pages/collections/wide");
        if (uploaded) {
          payload.bannerImage.wide = [uploaded];
        }
      }
      if (payload.bannerImage?.wide?.[0]) {
        delete payload.bannerImage.wide[0].pendingFile;
      }

      // 3. Process Megamenu Featured Card image
      if (data.megamenu?.featuredCard?.image?.pendingFile) {
        toast.loading("Uploading featured card image...", { id: "collections-save" });
        const uploaded = await uploadImage(data.megamenu.featuredCard.image.pendingFile, "pages/collections/featured");
        if (uploaded) {
          payload.megamenu.featuredCard.image = uploaded;
        }
      }
      if (payload.megamenu?.featuredCard?.image) {
        delete payload.megamenu.featuredCard.image.pendingFile;
      }

      toast.loading("Saving Collections settings...", { id: "collections-save" });
      const res = await fetch("/api/admin/cms/pages/collectionsOverview", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      setData(payload);
      toast.success("Collections overview page updated successfully", { id: "collections-save" });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong", { id: "collections-save" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <div className="flex h-48 items-center justify-center text-stone-500 dark:text-stone-400">
          Loading Collections overview settings...
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* STICKY SAVE BAR */}
      <div className="sticky top-14 z-30 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-xl border border-stone-300/80 bg-white/95 p-4 shadow-md backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/95">
        <div>
          <h2 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
            Collections Overview Controls
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Configure section title, description, banner images, and megamenu card.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="sm" className="w-full sm:w-auto">
          {saving ? "Saving..." : "Save Collections Overview"}
        </Button>
      </div>

      {/* 1. GENERAL CONTENT */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          1. Section Header & Description
        </h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Section Title</Label>
            <Input
              value={data.title}
              onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Collections"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={data.description}
              onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Twelve named collections..."
            />
          </div>
        </div>
      </section>

      {/* 2. BANNER IMAGES */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          2. Banner Images (Square & Wide)
        </h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Square Image (1:1 Ratio Thumbnail Card)</Label>
            <ImageUploader
              file={data.bannerImage?.square?.pendingFile}
              existingImage={data.bannerImage?.square?.url ? data.bannerImage.square : null}
              onFileSelect={(file) =>
                setData((prev) => ({
                  ...prev,
                  bannerImage: {
                    ...(prev.bannerImage || {}),
                    square: {
                      ...(prev.bannerImage?.square || {}),
                      pendingFile: file,
                    },
                  },
                }))
              }
              onRemove={() =>
                setData((prev) => ({
                  ...prev,
                  bannerImage: {
                    ...(prev.bannerImage || {}),
                    square: { url: "", publicId: "", pendingFile: null },
                  },
                }))
              }
              hint="Upload square image for catalog card (1:1 ratio)."
            />
          </div>

          <div className="space-y-2">
            <Label>Wide Banner (Page Header)</Label>
            <ImageUploader
              file={data.bannerImage?.wide?.[0]?.pendingFile}
              existingImage={data.bannerImage?.wide?.[0]?.url ? data.bannerImage.wide[0] : null}
              onFileSelect={(file) =>
                setData((prev) => ({
                  ...prev,
                  bannerImage: {
                    ...(prev.bannerImage || {}),
                    wide: [
                      {
                        ...(prev.bannerImage?.wide?.[0] || {}),
                        pendingFile: file,
                      },
                    ],
                  },
                }))
              }
              onRemove={() =>
                setData((prev) => ({
                  ...prev,
                  bannerImage: {
                    ...(prev.bannerImage || {}),
                    wide: [{ url: "", publicId: "", pendingFile: null }],
                  },
                }))
              }
              hint="Upload landscape banner for collections header (approx. 1920x600)."
            />
          </div>
        </div>
      </section>

      {/* 3. MEGAMENU FEATURED CARD */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          3. Megamenu Featured Card
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Eyebrow</Label>
            <Input
              value={data.megamenu?.featuredCard?.eyebrow || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  megamenu: {
                    ...(prev.megamenu || {}),
                    featuredCard: {
                      ...(prev.megamenu?.featuredCard || {}),
                      eyebrow: e.target.value,
                    },
                  },
                }))
              }
              placeholder="Featured Collection"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={data.megamenu?.featuredCard?.title || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  megamenu: {
                    ...(prev.megamenu || {}),
                    featuredCard: {
                      ...(prev.megamenu?.featuredCard || {}),
                      title: e.target.value,
                    },
                  },
                }))
              }
              placeholder="EarthSkin Collection"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={data.megamenu?.featuredCard?.description || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  megamenu: {
                    ...(prev.megamenu || {}),
                    featuredCard: {
                      ...(prev.megamenu?.featuredCard || {}),
                      description: e.target.value,
                    },
                  },
                }))
              }
              placeholder="Tactile raw stone veneers..."
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Link Href Target</Label>
            <Input
              value={data.megamenu?.featuredCard?.href || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  megamenu: {
                    ...(prev.megamenu || {}),
                    featuredCard: {
                      ...(prev.megamenu?.featuredCard || {}),
                      href: e.target.value,
                    },
                  },
                }))
              }
              placeholder="/collections/earthskin"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Featured Card Preview Image</Label>
            <ImageUploader
              file={data.megamenu?.featuredCard?.image?.pendingFile}
              existingImage={data.megamenu?.featuredCard?.image?.url ? data.megamenu.featuredCard.image : null}
              onFileSelect={(file) =>
                setData((prev) => ({
                  ...prev,
                  megamenu: {
                    ...(prev.megamenu || {}),
                    featuredCard: {
                      ...(prev.megamenu?.featuredCard || {}),
                      image: {
                        ...(prev.megamenu?.featuredCard?.image || {}),
                        pendingFile: file,
                      },
                    },
                  },
                }))
              }
              onRemove={() =>
                setData((prev) => ({
                  ...prev,
                  megamenu: {
                    ...(prev.megamenu || {}),
                    featuredCard: {
                      ...(prev.megamenu?.featuredCard || {}),
                      image: { url: "", publicId: "", pendingFile: null },
                    },
                  },
                }))
              }
              hint="Upload card image displayed in the navigation megamenu."
            />
          </div>
        </div>
      </section>

      {/* 3. SEO & METADATA */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70 space-y-4">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">
          3. SEO & Metadata
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400">Meta Title</Label>
            <Input
              placeholder="e.g. Natural Stone Collections | Stoneza"
              value={data.seo?.metaTitle || ""}
              onChange={(e) => setData({ ...data, seo: { ...data.seo, metaTitle: e.target.value } })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400">Canonical URL</Label>
            <Input
              placeholder="e.g. https://stoneza.in/collections"
              value={data.seo?.canonicalUrl || ""}
              onChange={(e) => setData({ ...data, seo: { ...data.seo, canonicalUrl: e.target.value } })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400">Keywords (Comma separated)</Label>
            <Input
              placeholder="e.g. natural stone collections, sandstone paving, cladding ranges"
              value={data.seo?.keywords || ""}
              onChange={(e) => setData({ ...data, seo: { ...data.seo, keywords: e.target.value } })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400">OG Image URL</Label>
            <Input
              placeholder="https://..."
              value={data.seo?.ogImage || ""}
              onChange={(e) => setData({ ...data, seo: { ...data.seo, ogImage: e.target.value } })}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400">Meta Description</Label>
          <Textarea
            rows={3}
            placeholder="Search engine description for the Collections overview page..."
            value={data.seo?.metaDescription || ""}
            onChange={(e) => setData({ ...data, seo: { ...data.seo, metaDescription: e.target.value } })}
          />
        </div>
      </section>

      {/* SAVE BUTTON */}
      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Saving..." : "Save Collections Overview"}
        </Button>
      </div>
    </div>
  );
}
