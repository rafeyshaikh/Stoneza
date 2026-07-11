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
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/cms/homepage");
      const result = await res.json();
      if (result.success && result.data) {
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
      setLoading(false);
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });

  const uploadImage = async (file, folder = "homepage") => {
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, folder }),
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
    <div className="space-y-6 pb-20">
      {/* FLOATING ACTION SAVE BUTTON */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-stone-900 dark:text-stone-100">
            Customize Layout & Settings
          </h2>
          <p className="text-sm text-stone-500">
            Modify text banners, images, dynamic sliders, testimonials and SEO metadata.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="shadow-sm cursor-pointer bg-white hover:bg-gray-100">
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
