"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/admin/products/ImageUploader";
import SeoManager from "@/components/admin/seo/SeoManager";
import { uploadAdminImage } from "@/lib/uploadAdminImage";

export default function AboutEditor() {
  const [data, setData] = useState({
    hero: { eyebrow: "", title: "", image: { url: "", publicId: "" } },
    story: { eyebrow: "", lead: "", paragraphs: [], eras: [] },
    stats: [],
    founders: { eyebrow: "", image: { url: "", publicId: "" }, people: [] },
    howWeWork: { eyebrow: "", title: "", steps: [] },
    showroom: { eyebrow: "", title: "", description: "", buttonText: "", buttonLink: "" },
    manifesto: { quote: "", sub: "" },
    cta: { eyebrow: "", title: "", description: "", buttonText: "", buttonLink: "" },
    seo: { metaTitle: "", metaDescription: "", keywords: "", canonicalUrl: "", ogImage: "" },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const res = await fetch("/api/admin/cms/about");
        const result = await res.json();
        if (!ignore && result.success && result.data) {
          setData({
            hero: result.data.hero || { eyebrow: "", title: "", image: { url: "", publicId: "" } },
            story: result.data.story || { eyebrow: "", lead: "", paragraphs: [], eras: [] },
            stats: result.data.stats || [],
            founders: result.data.founders || { eyebrow: "", image: { url: "", publicId: "" }, people: [] },
            howWeWork: result.data.howWeWork || { eyebrow: "", title: "", steps: [] },
            showroom: result.data.showroom || { eyebrow: "", title: "", description: "", buttonText: "", buttonLink: "" },
            manifesto: result.data.manifesto || { quote: "", sub: "" },
            cta: result.data.cta || { eyebrow: "", title: "", description: "", buttonText: "", buttonLink: "" },
            seo: {
              metaTitle: result.data.seo?.metaTitle || "",
              metaDescription: result.data.seo?.metaDescription || "",
              keywords: Array.isArray(result.data.seo?.keywords)
                ? result.data.seo.keywords.join(", ")
                : result.data.seo?.keywords || "",
              canonicalUrl: result.data.seo?.canonicalUrl || "",
              ogImage: result.data.seo?.ogImage || "",
              ogTitle: result.data.seo?.ogTitle || "",
              ogDescription: result.data.seo?.ogDescription || "",
              ogUrl: result.data.seo?.ogUrl || "",
              ogType: result.data.seo?.ogType || "website",
              twitterCard: result.data.seo?.twitterCard || "summary_large_image",
              twitterTitle: result.data.seo?.twitterTitle || "",
              twitterDescription: result.data.seo?.twitterDescription || "",
              twitterImage: result.data.seo?.twitterImage || "",
              robotsIndex: result.data.seo?.robotsIndex !== false,
              robotsFollow: result.data.seo?.robotsFollow !== false,
              enableCustomJsonLd: Boolean(result.data.seo?.enableCustomJsonLd),
              customJsonLd: result.data.seo?.customJsonLd || "",
            },
          });
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load About Us CMS data");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const uploadImage = async (file, folder = "about") => {
    try {
      return await uploadAdminImage(file, folder);
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to upload image");
      return null;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = JSON.parse(JSON.stringify(data));

      let pendingUploads = 0;
      if (data.hero?.pendingFile) pendingUploads++;
      if (data.story?.pendingFile) pendingUploads++;
      if (data.founders?.pendingFile) pendingUploads++;

      if (pendingUploads > 0) {
        toast.loading("Uploading images to Cloudinary...", { id: "about-cms" });
      } else {
        toast.loading("Saving About Us settings...", { id: "about-cms" });
      }

      if (data.hero?.pendingFile) {
        const uploaded = await uploadImage(data.hero.pendingFile, "about/hero");
        if (uploaded) payload.hero.image = uploaded;
        delete payload.hero.pendingFile;
      }

      if (data.story?.pendingFile) {
        const uploaded = await uploadImage(data.story.pendingFile, "about/story");
        if (uploaded) payload.story.image = uploaded;
        delete payload.story.pendingFile;
      }

      if (data.founders?.pendingFile) {
        const uploaded = await uploadImage(data.founders.pendingFile, "about/founders");
        if (uploaded) payload.founders.image = uploaded;
        delete payload.founders.pendingFile;
      }

      toast.loading("Saving settings to database...", { id: "about-cms" });

      const res = await fetch("/api/admin/cms/about", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Save failed");

      setData(payload);
      toast.success("About Us CMS updated successfully", { id: "about-cms" });
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to save About Us settings", { id: "about-cms" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-stone-500">
        <Loader2 className="mr-2 size-6 animate-spin text-stone-900 dark:text-white" />
        Loading About Us CMS configurations...
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* STICKY SAVE BAR */}
      <div className="sticky top-14 z-30 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-xl border border-stone-300/80 bg-white/95 p-4 shadow-md backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/95">
        <div>
          <h2 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
            About Us CMS Controls
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Modify brand story, timeline eras, founders, and showroom information.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto shadow-sm cursor-pointer bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900">
          {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
          {saving ? "Saving..." : "Save About Settings"}
        </Button>
      </div>

      {/* 1. HERO SECTION */}
      <section className="space-y-4 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">1. Hero Section</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Eyebrow</Label>
              <Input
                value={data.hero?.eyebrow || ""}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, eyebrow: e.target.value } })}
              />
            </div>
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                value={data.hero?.title || ""}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
              />
            </div>
          </div>
          <ImageUploader
            file={data.hero?.pendingFile}
            existingImage={data.hero?.image?.url ? data.hero.image : null}
            onFileSelect={(file) => setData({ ...data, hero: { ...data.hero, pendingFile: file } })}
            onRemove={() => setData({ ...data, hero: { ...data.hero, pendingFile: null, image: { url: "", publicId: "" } } })}
            hint="Landscape background image."
          />
        </div>
      </section>

      {/* 2. STORY SECTION */}
      <section className="space-y-4 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">2. Where It Began (Story & Homepage About Section)</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Section Eyebrow</Label>
              <Input
                value={data.story?.eyebrow || ""}
                onChange={(e) => setData({ ...data, story: { ...data.story, eyebrow: e.target.value } })}
              />
            </div>
            <div>
              <Label className="text-xs">Lead Paragraph</Label>
              <Textarea
                rows={3}
                value={data.story?.lead || ""}
                onChange={(e) => setData({ ...data, story: { ...data.story, lead: e.target.value } })}
              />
            </div>
          </div>

          <ImageUploader
            file={data.story?.pendingFile}
            existingImage={data.story?.image?.url ? data.story.image : null}
            onFileSelect={(file) => setData({ ...data, story: { ...data.story, pendingFile: file } })}
            onRemove={() => setData({ ...data, story: { ...data.story, pendingFile: null, image: { url: "", publicId: "" } } })}
            hint="Homepage & About page featured story image."
          />
        </div>

        <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Story Paragraphs</Label>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => setData({ ...data, story: { ...data.story, paragraphs: [...(data.story?.paragraphs || []), ""] } })}
              >
                <Plus className="mr-1 size-3.5" /> Add Paragraph
              </Button>
            </div>
            {(data.story?.paragraphs || []).map((p, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Textarea
                  rows={2}
                  value={p}
                  onChange={(e) => {
                    const list = [...data.story.paragraphs];
                    list[idx] = e.target.value;
                    setData({ ...data, story: { ...data.story, paragraphs: list } });
                  }}
                />
                <Button
                  size="icon"
                  variant="destructive"
                  type="button"
                  onClick={() => {
                    const list = data.story.paragraphs.filter((_, i) => i !== idx);
                    setData({ ...data, story: { ...data.story, paragraphs: list } });
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
      </section>

      {/* 3. FOUNDERS */}
      <section className="space-y-4 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">3. Leadership &amp; Direction</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Section Eyebrow</Label>
              <Input
                value={data.founders?.eyebrow || ""}
                onChange={(e) => setData({ ...data, founders: { ...data.founders, eyebrow: e.target.value } })}
              />
            </div>

            {(data.founders?.people || []).map((person, pIdx) => (
              <div key={pIdx} className="rounded-xl border p-3 bg-white space-y-2 dark:bg-stone-900">
                <Input
                  placeholder="Director Name"
                  value={person.name || ""}
                  onChange={(e) => {
                    const people = [...data.founders.people];
                    people[pIdx] = { ...people[pIdx], name: e.target.value };
                    setData({ ...data, founders: { ...data.founders, people } });
                  }}
                />
                <Input
                  placeholder="Role (e.g. Director, Director — Operations)"
                  value={person.role || ""}
                  onChange={(e) => {
                    const people = [...data.founders.people];
                    people[pIdx] = { ...people[pIdx], role: e.target.value };
                    setData({ ...data, founders: { ...data.founders, people } });
                  }}
                />
              </div>
            ))}
          </div>

          <ImageUploader
            file={data.founders?.pendingFile}
            existingImage={data.founders?.image?.url ? data.founders.image : null}
            onFileSelect={(file) => setData({ ...data, founders: { ...data.founders, pendingFile: file } })}
            onRemove={() => setData({ ...data, founders: { ...data.founders, pendingFile: null, image: { url: "", publicId: "" } } })}
            hint="Portrait founders photo."
          />
        </div>
      </section>

      {/* 4. SHOWROOM & MANIFESTO */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border p-5 bg-stone-50/80 dark:bg-stone-950/70">
          <h3 className="font-heading text-base font-semibold">Experience Centre</h3>
          <Input
            placeholder="Eyebrow"
            value={data.showroom?.eyebrow || ""}
            onChange={(e) => setData({ ...data, showroom: { ...data.showroom, eyebrow: e.target.value } })}
          />
          <Input
            placeholder="Title"
            value={data.showroom?.title || ""}
            onChange={(e) => setData({ ...data, showroom: { ...data.showroom, title: e.target.value } })}
          />
          <Textarea
            rows={3}
            placeholder="Description"
            value={data.showroom?.description || ""}
            onChange={(e) => setData({ ...data, showroom: { ...data.showroom, description: e.target.value } })}
          />
        </div>

        <div className="space-y-3 rounded-2xl border p-5 bg-stone-50/80 dark:bg-stone-950/70">
          <h3 className="font-heading text-base font-semibold">Manifesto Quote</h3>
          <Textarea
            rows={3}
            placeholder="Quote text"
            value={data.manifesto?.quote || ""}
            onChange={(e) => setData({ ...data, manifesto: { ...data.manifesto, quote: e.target.value } })}
          />
          <Input
            placeholder="Subtitle"
            value={data.manifesto?.sub || ""}
            onChange={(e) => setData({ ...data, manifesto: { ...data.manifesto, sub: e.target.value } })}
          />
        </div>
      </section>

      {/* 5. SEO & METADATA */}
      <SeoManager
        seo={data.seo}
        onChange={(field, value) =>
          setData((prev) => ({
            ...prev,
            seo: { ...(prev.seo || {}), [field]: value },
          }))
        }
        entityContext={{
          type: "about",
          name: "About Stoneza",
          description: data.story?.lead || "Three generations of quarrying Bijolia sandstone, Kota stone & Asind granite.",
          path: "/about-us",
          image: data.hero?.image?.url || "",
        }}
      />
    </div>
  );
}
