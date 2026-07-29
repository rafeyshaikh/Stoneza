"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import HeroManager from "./HeroManager";
import FeaturedCollectionsManager from "./FeaturedCollectionsManager";
import NewArrivalsManager from "./NewArrivalsManager";
import TestimonialsManager from "./TestimonialsManager";
import SectionManager from "./SectionManager";

export default function HomepageEditor() {
  const [data, setData] = useState({
    heroSlides: [],
    featuredProducts: { title: "", caption: "", buttonText: "", bannerImage: { url: "", publicId: "" } },
    middleBanner: { title: "", eyebrow: "", caption: "", buttonText: "", buttonLink: "", image: { url: "", publicId: "" } },
    newArrivalsTitle: "What's New",
    threeBanners: [],
    brandPromos: [],
    testimonials: [],
    footer: { caption: "", copyright: "" },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const res = await fetch("/api/admin/cms/homepage");
        const result = await res.json();
        if (!ignore && result.success && result.data) {
          setData({
            heroSlides: result.data.heroSlides || [],
            featuredProducts: result.data.featuredProducts || { title: "", caption: "", buttonText: "", bannerImage: { url: "", publicId: "" } },
            middleBanner: result.data.middleBanner || { title: "", eyebrow: "", caption: "", buttonText: "", buttonLink: "", image: { url: "", publicId: "" } },
            newArrivalsTitle: result.data.newArrivalsTitle || "What's New",
            threeBanners: result.data.threeBanners || [],
            brandPromos: result.data.brandPromos || [],
            testimonials: result.data.testimonials || [],
            footer: result.data.footer || { caption: "", copyright: "" },
          });
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load homepage CMS data");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const uploadImage = async (file, folder = "homepage") => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Upload failed");
      return result.data; // returns { url, publicId }
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to upload image");
      return null;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/cms/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Save failed");
      toast.success("Homepage CMS updated successfully");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to save homepage settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-stone-500 dark:text-stone-400">
        <Loader2 className="mr-2 size-6 animate-spin text-stone-900 dark:text-white" />
        Loading homepage CMS configurations...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 relative">
      {/* STICKY ACTION SAVE BAR */}
      <div className="sticky top-16 z-30 flex items-center justify-between rounded-xl border border-stone-300/80 bg-white/95 p-4 shadow-md backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/95">
        <div>
          <h2 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
            Customize Layout & Settings
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Modify text banners, images, dynamic sliders, testimonials and footer metadata.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="shadow-sm cursor-pointer bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
          {saving ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" /> Save Homepage Settings
            </>
          )}
        </Button>
      </div>

      <HeroManager
        slides={data.heroSlides}
        onChange={(slides) => setData((prev) => ({ ...prev, heroSlides: slides }))}
        uploadImage={uploadImage}
      />

      <FeaturedCollectionsManager
        data={data.featuredProducts}
        onChange={(val) => setData((prev) => ({ ...prev, featuredProducts: val }))}
        uploadImage={uploadImage}
      />

      <NewArrivalsManager
        title={data.newArrivalsTitle}
        onChange={(val) => setData((prev) => ({ ...prev, newArrivalsTitle: val }))}
      />

      <TestimonialsManager
        testimonials={data.testimonials}
        onChange={(testimonials) => setData((prev) => ({ ...prev, testimonials }))}
      />

      <SectionManager
        data={data}
        onChange={(updatedData) => setData((prev) => ({ ...prev, ...updatedData }))}
        uploadImage={uploadImage}
      />
    </div>
  );
}
