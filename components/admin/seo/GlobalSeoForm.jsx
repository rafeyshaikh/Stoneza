"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, BarChart3, Building2 } from "lucide-react";
import SeoManager from "@/components/admin/seo/SeoManager";

export default function GlobalSeoForm({ data, onSave }) {
  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    canonicalUrl: "",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    ogUrl: "",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    robotsIndex: true,
    robotsFollow: true,
    enableCustomJsonLd: false,
    customJsonLd: "",
    googleAnalyticsId: "",
    googleTagManagerId: "",
    searchConsoleVerification: "",
    facebookPixelId: "",
    organizationName: "Stoneza",
    organizationLegalName: "Stoneza Surfaces LLP",
    organizationLogo: "",
    organizationUrl: "https://stoneza.in",
    organizationPhone: "+91 78771 08154",
    organizationEmail: "sales@stoneza.in",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        keywords: Array.isArray(data.keywords)
          ? data.keywords
          : typeof data.keywords === "string" && data.keywords
          ? data.keywords.split(",").map((k) => k.trim()).filter(Boolean)
          : [],
        canonicalUrl: data.canonicalUrl || "",
        ogImage: data.ogImage || "",
        ogTitle: data.ogTitle || "",
        ogDescription: data.ogDescription || "",
        ogUrl: data.ogUrl || "",
        ogType: data.ogType || "website",
        twitterCard: data.twitterCard || "summary_large_image",
        twitterTitle: data.twitterTitle || "",
        twitterDescription: data.twitterDescription || "",
        twitterImage: data.twitterImage || "",
        robotsIndex: data.robotsIndex !== undefined ? data.robotsIndex : true,
        robotsFollow: data.robotsFollow !== undefined ? data.robotsFollow : true,
        enableCustomJsonLd: Boolean(data.enableCustomJsonLd),
        customJsonLd: data.customJsonLd || "",
        googleAnalyticsId: data.googleAnalyticsId || "",
        googleTagManagerId: data.googleTagManagerId || "",
        searchConsoleVerification: data.searchConsoleVerification || "",
        facebookPixelId: data.facebookPixelId || "",
        organizationName: data.organizationName || "Stoneza",
        organizationLegalName: data.organizationLegalName || "Stoneza Surfaces LLP",
        organizationLogo: data.organizationLogo || "",
        organizationUrl: data.organizationUrl || "https://stoneza.in",
        organizationPhone: data.organizationPhone || "+91 78771 08154",
        organizationEmail: data.organizationEmail || "sales@stoneza.in",
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Unified Enterprise SEO Manager (General, Social, Custom JSON-LD) */}
      <SeoManager
        seo={formData}
        onChange={handleChange}
        entityContext={{
          type: "home",
          name: "Stoneza | Natural Stone Manufacturer & Exporter",
          description: formData.metaDescription || "Quarry-direct natural stone manufacturer and exporter in India since 1992.",
          path: "/",
          image: formData.ogImage,
        }}
      />

      {/* Global Tracking, Verification & Webmaster Tools */}
      <div className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-5 text-stone-700 dark:text-stone-300" />
          <div>
            <h3 className="font-heading text-base font-semibold text-stone-900 dark:text-stone-100">
              Tracking, Analytics & Search Console
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Configure site-wide tracking IDs and search engine ownership verification codes.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="seo-ga">Google Analytics ID (GA4)</Label>
            <Input
              id="seo-ga"
              placeholder="e.g. G-XXXXXXX"
              value={formData.googleAnalyticsId}
              onChange={(e) => handleChange("googleAnalyticsId", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="seo-gtm">Google Tag Manager ID</Label>
            <Input
              id="seo-gtm"
              placeholder="e.g. GTM-XXXXXXX"
              value={formData.googleTagManagerId}
              onChange={(e) => handleChange("googleTagManagerId", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="seo-search-console">Google Search Console Verification Code</Label>
            <Input
              id="seo-search-console"
              placeholder="e.g. google-site-verification=..."
              value={formData.searchConsoleVerification}
              onChange={(e) => handleChange("searchConsoleVerification", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="seo-pixel">Meta / Facebook Pixel ID</Label>
            <Input
              id="seo-pixel"
              placeholder="e.g. 123456789012345"
              value={formData.facebookPixelId}
              onChange={(e) => handleChange("facebookPixelId", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Global Organization / Business Knowledge Graph */}
      <div className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70 space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-stone-700 dark:text-stone-300" />
          <div>
            <h3 className="font-heading text-base font-semibold text-stone-900 dark:text-stone-100">
              Organization & Knowledge Graph Details
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Default brand structured data provided to Google and knowledge panels.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="org-name">Brand / Organization Name</Label>
            <Input
              id="org-name"
              placeholder="e.g. Stoneza"
              value={formData.organizationName}
              onChange={(e) => handleChange("organizationName", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-legal">Legal Business Name</Label>
            <Input
              id="org-legal"
              placeholder="e.g. Stoneza Surfaces LLP"
              value={formData.organizationLegalName}
              onChange={(e) => handleChange("organizationLegalName", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-phone">Primary Contact Phone</Label>
            <Input
              id="org-phone"
              placeholder="+91 78771 08154"
              value={formData.organizationPhone}
              onChange={(e) => handleChange("organizationPhone", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-email">Primary Sales / Support Email</Label>
            <Input
              id="org-email"
              placeholder="sales@stoneza.in"
              value={formData.organizationEmail}
              onChange={(e) => handleChange("organizationEmail", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={saving}
          className="shadow-sm cursor-pointer border border-stone-900 bg-stone-900 text-white hover:bg-stone-800"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" /> Saving SEO Settings...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" /> Save All Global SEO Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
