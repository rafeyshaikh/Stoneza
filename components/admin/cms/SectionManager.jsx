"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/admin/products/ImageUploader";
import { toast } from "sonner";
import { Image as ImageIcon, Sparkles, Layout, Globe, Footprints, Plus, Trash2 } from "lucide-react";

export default function SectionManager({ data = {}, onChange, uploadImage }) {
  const [activeTab, setActiveTab] = useState("middleBanner");

  const updateSubField = (section, field, value) => {
    onChange({
      ...data,
      [section]: {
        ...data[section],
        [field]: value,
      },
    });
  };

  const handleMiddleBannerUpload = async (file) => {
    try {
      const uploaded = await uploadImage(file, "homepage/middle");
      if (uploaded) {
        updateSubField("middleBanner", "image", uploaded);
        toast.success("Middle banner uploaded");
      }
    } catch (e) {
      console.error(e);
      toast.error("Upload failed");
    }
  };

  // Three Banners handlers
  const handleThreeBannerUpload = async (index, file) => {
    try {
      const uploaded = await uploadImage(file, "homepage/threebanners");
      if (uploaded) {
        const list = [...(data.threeBanners || [])];
        list[index] = { ...list[index], image: uploaded };
        onChange({ ...data, threeBanners: list });
        toast.success("ThreeBanner image uploaded");
      }
    } catch (e) {
      console.error(e);
      toast.error("Upload failed");
    }
  };

  const updateThreeBannerField = (index, field, value) => {
    const list = [...(data.threeBanners || [])];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...data, threeBanners: list });
  };

  const addThreeBanner = () => {
    const list = [...(data.threeBanners || [])];
    list.push({ title: "", image: { url: "", publicId: "" }, buttonLink: "" });
    onChange({ ...data, threeBanners: list });
    toast.success("Added new banner column");
  };

  const removeThreeBanner = (index) => {
    const list = (data.threeBanners || []).filter((_, idx) => idx !== index);
    onChange({ ...data, threeBanners: list });
    toast.success("Removed banner column");
  };

  // Brand Promos handlers
  const handleBrandPromoUpload = async (index, file) => {
    try {
      const uploaded = await uploadImage(file, "homepage/promos");
      if (uploaded) {
        const list = [...(data.brandPromos || [])];
        list[index] = { ...list[index], image: uploaded };
        onChange({ ...data, brandPromos: list });
        toast.success("Brand promo image uploaded");
      }
    } catch (e) {
      console.error(e);
      toast.error("Upload failed");
    }
  };

  const updateBrandPromoField = (index, field, value) => {
    const list = [...(data.brandPromos || [])];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...data, brandPromos: list });
  };

  const addBrandPromo = () => {
    const list = [...(data.brandPromos || [])];
    list.push({ title: "", image: { url: "", publicId: "" }, caption: "", buttonText: "", buttonLink: "" });
    onChange({ ...data, brandPromos: list });
    toast.success("Added brand promo block");
  };

  const removeBrandPromo = (index) => {
    const list = (data.brandPromos || []).filter((_, idx) => idx !== index);
    onChange({ ...data, brandPromos: list });
    toast.success("Removed brand promo block");
  };

  const tabs = [
    { id: "middleBanner", name: "Middle Banner", icon: ImageIcon },
    { id: "threeBanners", name: "Three Banners", icon: Layout },
    { id: "brandPromos", name: "Brand Promos", icon: Sparkles },
    { id: "seo", name: "SEO Settings", icon: Globe },
    { id: "footer", name: "Footer Settings", icon: Footprints },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* NAV TABS */}
        <div className="flex shrink-0 gap-1.5 overflow-x-auto lg:flex-col lg:w-56 border-b lg:border-b-0 lg:border-r border-stone-300 pb-3 lg:pb-0 lg:pr-4 dark:border-stone-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition cursor-pointer select-none whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm"
                    : "text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800/50 dark:hover:text-stone-100"
                }`}
              >
                <Icon size={16} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* DETAILS EDITOR PANEL */}
        <div className="flex-1 min-w-0">
          {/* TAB 1: MIDDLE BANNER */}
          {activeTab === "middleBanner" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-heading text-base font-semibold text-stone-900 dark:text-stone-100">
                  Middle Promotion Banner
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Full width homepage campaign banner.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="grid gap-2 grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="mid-eyebrow">Banner Eyebrow</Label>
                      <Input
                        id="mid-eyebrow"
                        placeholder="e.g. The Stoneza Collection"
                        value={data.middleBanner?.eyebrow || ""}
                        onChange={(e) => updateSubField("middleBanner", "eyebrow", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="mid-title">Banner Title</Label>
                      <Input
                        id="mid-title"
                        placeholder="e.g. All Products"
                        value={data.middleBanner?.title || ""}
                        onChange={(e) => updateSubField("middleBanner", "title", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="mid-caption">Banner Description / Caption</Label>
                    <Textarea
                      id="mid-caption"
                      rows={2}
                      placeholder="e.g. Natural stone. Timeless character..."
                      value={data.middleBanner?.caption || ""}
                      onChange={(e) => updateSubField("middleBanner", "caption", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="mid-btn-text">Button Text</Label>
                    <Input
                      id="mid-btn-text"
                      placeholder="e.g. Learn More"
                      value={data.middleBanner?.buttonText || ""}
                      onChange={(e) => updateSubField("middleBanner", "buttonText", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="mid-btn-link">Button Redirect Link</Label>
                    <Input
                      id="mid-btn-link"
                      placeholder="e.g. /products"
                      value={data.middleBanner?.buttonLink || ""}
                      onChange={(e) => updateSubField("middleBanner", "buttonLink", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <ImageUploader
                    existingImage={data.middleBanner?.image?.url ? data.middleBanner.image : null}
                    onFileSelect={handleMiddleBannerUpload}
                    onRemove={() => updateSubField("middleBanner", "image", { url: "", publicId: "" })}
                    hint="Upload landscape image (approx. 1920x600 recommendations)."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THREE BANNERS */}
          {activeTab === "threeBanners" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading text-base font-semibold text-stone-900 dark:text-stone-100">
                    Three Banner Grid
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Custom column banners displayed side-by-side.
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={addThreeBanner} type="button">
                  <Plus className="mr-1.5 size-4" /> Add Banner
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {(data.threeBanners || []).map((banner, index) => (
                  <div key={index} className="relative rounded-xl border bg-white p-4 space-y-3 shadow-sm dark:bg-stone-900">
                    <button
                      onClick={() => removeThreeBanner(index)}
                      className="absolute right-2 top-2 text-stone-400 hover:text-red-500 transition"
                      type="button"
                    >
                      <Trash2 size={14} />
                    </button>

                    <h5 className="font-heading text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Column #{index + 1}
                    </h5>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Banner Title / Button Text</Label>
                      <Input
                        placeholder="e.g. Photo Frames"
                        value={banner.title || ""}
                        onChange={(e) => updateThreeBannerField(index, "title", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Redirect Link</Label>
                      <Input
                        placeholder="e.g. /collections/frames"
                        value={banner.buttonLink || ""}
                        onChange={(e) => updateThreeBannerField(index, "buttonLink", e.target.value)}
                      />
                    </div>

                    <div className="pt-2">
                      <ImageUploader
                        existingImage={banner.image?.url ? banner.image : null}
                        onFileSelect={(file) => handleThreeBannerUpload(index, file)}
                        onRemove={() => {
                          const list = [...(data.threeBanners || [])];
                          list[index] = { ...list[index], image: { url: "", publicId: "" } };
                          onChange({ ...data, threeBanners: list });
                        }}
                        hint="Portrait image."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BRAND PROMOS */}
          {activeTab === "brandPromos" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading text-base font-semibold text-stone-900 dark:text-stone-100">
                    Brand Promos (Two Banners)
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Dual banner grid highlighting brand values.
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={addBrandPromo} type="button">
                  <Plus className="mr-1.5 size-4" /> Add Promo Block
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {(data.brandPromos || []).map((promo, index) => (
                  <div key={index} className="relative rounded-xl border bg-white p-4 space-y-3 shadow-sm dark:bg-stone-900">
                    <button
                      onClick={() => removeBrandPromo(index)}
                      className="absolute right-2 top-2 text-stone-400 hover:text-red-500 transition"
                      type="button"
                    >
                      <Trash2 size={14} />
                    </button>

                    <h5 className="font-heading text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Promo Block #{index + 1}
                    </h5>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Title</Label>
                      <Input
                        placeholder="e.g. The Brand"
                        value={promo.title || ""}
                        onChange={(e) => updateBrandPromoField(index, "title", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Caption / Description</Label>
                      <Textarea
                        rows={2}
                        placeholder="What makes our products so covetable..."
                        value={promo.caption || ""}
                        onChange={(e) => updateBrandPromoField(index, "caption", e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2 grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Button Text</Label>
                        <Input
                          placeholder="e.g. Learn More"
                          value={promo.buttonText || ""}
                          onChange={(e) => updateBrandPromoField(index, "buttonText", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Button Link</Label>
                        <Input
                          placeholder="e.g. /pages/about-us"
                          value={promo.buttonLink || ""}
                          onChange={(e) => updateBrandPromoField(index, "buttonLink", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <ImageUploader
                        existingImage={promo.image?.url ? promo.image : null}
                        onFileSelect={(file) => handleBrandPromoUpload(index, file)}
                        onRemove={() => {
                          const list = [...(data.brandPromos || [])];
                          list[index] = { ...list[index], image: { url: "", publicId: "" } };
                          onChange({ ...data, brandPromos: list });
                        }}
                        hint="Promo image."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SEO SETTINGS */}
          {activeTab === "seo" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-heading text-base font-semibold text-stone-900 dark:text-stone-100">
                  Homepage SEO Settings
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Manage search engine indexing parameters for the homepage.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="seo-meta-title">Meta Title</Label>
                  <Input
                    id="seo-meta-title"
                    placeholder="Stoneza - Natural Stone Showcase & Enquiry"
                    value={data.seo?.metaTitle || ""}
                    onChange={(e) => updateSubField("seo", "metaTitle", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="seo-meta-desc">Meta Description</Label>
                  <Textarea
                    id="seo-meta-desc"
                    rows={4}
                    placeholder="Elevate interiors and outdoor spaces with natural stone..."
                    value={data.seo?.metaDescription || ""}
                    onChange={(e) => updateSubField("seo", "metaDescription", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="seo-keywords">Keywords (Comma-separated)</Label>
                  <Input
                    id="seo-keywords"
                    placeholder="natural stone, marble, granite, luxury flooring"
                    value={data.seo?.keywords || ""}
                    onChange={(e) => updateSubField("seo", "keywords", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FOOTER SETTINGS */}
          {activeTab === "footer" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-heading text-base font-semibold text-stone-900 dark:text-stone-100">
                  Footer Information
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Manage static texts displayed at the bottom of all pages.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="footer-caption">Footer Caption</Label>
                  <Textarea
                    id="footer-caption"
                    rows={3}
                    placeholder="Enter brand footer pitch..."
                    value={data.footer?.caption || ""}
                    onChange={(e) => updateSubField("footer", "caption", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="footer-copyright">Copyright Text</Label>
                  <Input
                    id="footer-copyright"
                    placeholder="e.g. © 2026 Stoneza. All rights reserved."
                    value={data.footer?.copyright || ""}
                    onChange={(e) => updateSubField("footer", "copyright", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
