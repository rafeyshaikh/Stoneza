"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/admin/products/ImageUploader";
import { Image as ImageIcon, Footprints } from "lucide-react";

export default function SectionManager({ data = {}, onChange, uploadImage }) {
  const [activeTab, setActiveTab] = useState("middleBanner");

  const updateSubField = (section, field, value) => {
    onChange({
      [section]: {
        ...data[section],
        [field]: value,
      },
    });
  };

  const handleMiddleBannerSelect = (file) => {
    updateSubField("middleBanner", "pendingFile", file);
  };

  const tabs = [
    { id: "middleBanner", name: "Middle Banner", icon: ImageIcon },
    { id: "footer", name: "Footer Settings", icon: Footprints },
  ];

  return (
    <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* NAV TABS */}
        <div className="flex shrink-0 gap-1.5 overflow-x-auto lg:flex-col lg:w-56 border-b lg:border-b-0 lg:border-r border-stone-300 pb-3 lg:pb-0 lg:pr-4 dark:border-stone-800 scrollbar-none">
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
                  <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
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
                    file={data.middleBanner?.pendingFile}
                    existingImage={data.middleBanner?.image?.url ? data.middleBanner.image : null}
                    onFileSelect={handleMiddleBannerSelect}
                    onRemove={() => {
                      updateSubField("middleBanner", "image", { url: "", publicId: "" });
                      updateSubField("middleBanner", "pendingFile", null);
                    }}
                    hint="Upload landscape image (approx. 1920x600 recommendations)."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FOOTER SETTINGS */}
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
