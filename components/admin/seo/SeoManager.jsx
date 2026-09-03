"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Globe,
  Share2,
  Code2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Trash2,
  Loader2,
  ExternalLink,
  Search,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadAdminImage } from "@/lib/uploadAdminImage";
import { validateJsonLdString } from "@/lib/seo/schemaGenerator";
import { stripHtml } from "@/lib/seo/resolveMetadata";

/**
 * Reusable Enterprise SEO Manager Component for Stoneza Admin Dashboard.
 *
 * @param {Object} props
 * @param {Object} props.seo - SEO subdocument state
 * @param {Function} props.onChange - Callback: (field, value) => void
 * @param {Object} props.entityContext - Contextual entity values for live previews & fallbacks
 *   entityContext = {
 *     type: 'product' | 'category' | 'collection' | 'page' | 'about' | 'contact',
 *     name: string,
 *     description: string,
 *     slug: string,
 *     path: string, // e.g. '/product/my-slug'
 *     image: string, // primary entity image url
 *     sku: string,
 *     categoryName: string,
 *     stoneType: string,
 *   }
 */
export default function SeoManager({
  seo = {},
  onChange,
  entityContext = {},
}) {
  const [activeTab, setActiveTab] = useState("basic");
  const [uploadingOg, setUploadingOg] = useState(false);
  const [uploadingTwitter, setUploadingTwitter] = useState(false);
  const [jsonValidation, setJsonValidation] = useState({ tested: false, valid: true, error: null });

  // Fallback calculations for preview & indicators
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://stoneza.in";

  const publicPath =
    entityContext.path ||
    (entityContext.slug
      ? entityContext.type === "product"
        ? `/product/${entityContext.slug}`
        : entityContext.type === "category"
        ? `/product-category/${entityContext.slug}`
        : entityContext.type === "collection"
        ? `/collections/${entityContext.slug}`
        : `/${entityContext.slug}`
      : "/");

  const autoCanonical = `${baseUrl}${publicPath === "/" ? "" : publicPath}`;
  const effectiveCanonical = seo.canonicalUrl?.trim() || autoCanonical;

  const autoTitle = useMemo(() => {
    const rawName = entityContext.name || entityContext.title || "Stoneza Surface";
    if (entityContext.type === "product") {
      const stone = entityContext.stoneType || "Natural Stone";
      return `${rawName} — ${stone}`;
    }
    if (entityContext.type === "category") {
      return `${rawName} — Natural Stone`;
    }
    if (entityContext.type === "collection") {
      return `${rawName} Collection`;
    }
    return rawName;
  }, [entityContext]);

  const effectiveMetaTitle = seo.metaTitle?.trim() || autoTitle;

  const autoDescription = useMemo(() => {
    const desc = stripHtml(entityContext.description || "");
    if (desc) return desc.slice(0, 160);
    if (entityContext.type === "product") {
      return `Explore quarry-direct ${entityContext.name || "natural stone"} surfaces by Stoneza. Precision-calibrated architectural slabs.`;
    }
    return "Quarry-direct natural stone manufacturer and exporter in India since 1992.";
  }, [entityContext]);

  const effectiveMetaDesc = seo.metaDescription?.trim() || autoDescription;

  const effectiveOgTitle = seo.ogTitle?.trim() || effectiveMetaTitle;
  const effectiveOgDesc = seo.ogDescription?.trim() || effectiveMetaDesc;
  const effectiveOgImage =
    seo.ogImage?.trim() ||
    entityContext.image ||
    "https://res.cloudinary.com/chlmognp/image/upload/v1785340265/stoneza/homepage/hero/newslide1-pk39hw4z.png";

  const effectiveTwitterTitle = seo.twitterTitle?.trim() || effectiveOgTitle;
  const effectiveTwitterDesc = seo.twitterDescription?.trim() || effectiveOgDesc;
  const effectiveTwitterImage = seo.twitterImage?.trim() || effectiveOgImage;

  // Handle OG Image upload
  const handleOgImageUpload = async (file) => {
    try {
      setUploadingOg(true);
      const res = await uploadAdminImage(file, "seo/og");
      if (res?.url) {
        onChange("ogImage", res.url);
        toast.success("Open Graph image uploaded successfully");
      }
    } catch (e) {
      toast.error(e.message || "Failed to upload OG image");
    } finally {
      setUploadingOg(false);
    }
  };

  // Handle Twitter Image upload
  const handleTwitterImageUpload = async (file) => {
    try {
      setUploadingTwitter(true);
      const res = await uploadAdminImage(file, "seo/twitter");
      if (res?.url) {
        onChange("twitterImage", res.url);
        toast.success("Twitter image uploaded successfully");
      }
    } catch (e) {
      toast.error(e.message || "Failed to upload Twitter image");
    } finally {
      setUploadingTwitter(false);
    }
  };

  // Live Automatic Schema Preview
  const autoSchemaPreview = useMemo(() => {
    const type = entityContext.type || "page";
    if (type === "product") {
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: entityContext.name || "Product Name",
        description: effectiveMetaDesc,
        image: entityContext.image ? [entityContext.image] : [],
        sku: entityContext.sku || "STZ-EXAMPLE",
        brand: { "@type": "Brand", name: "Stoneza" },
        material: entityContext.stoneType || "Natural Stone",
        offers: {
          "@type": "Offer",
          url: effectiveCanonical,
          priceCurrency: "INR",
          price: "0",
          availability: "https://schema.org/InStock",
        },
      };
    }
    if (type === "category" || type === "collection") {
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: entityContext.name || "Collection",
        description: effectiveMetaDesc,
        url: effectiveCanonical,
        image: effectiveOgImage,
      };
    }
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: effectiveMetaTitle,
      description: effectiveMetaDesc,
      url: effectiveCanonical,
    };
  }, [entityContext, effectiveMetaTitle, effectiveMetaDesc, effectiveCanonical, effectiveOgImage]);

  // Test / Validate Custom JSON-LD
  const handleValidateCustomJson = () => {
    const res = validateJsonLdString(seo.customJsonLd || "");
    setJsonValidation({ tested: true, valid: res.valid, error: res.error });
    if (res.valid) {
      toast.success("Valid JSON-LD structured data!");
      // Format prettified JSON
      try {
        const formatted = JSON.stringify(res.parsed, null, 2);
        onChange("customJsonLd", formatted);
      } catch {
        // preserve existing
      }
    } else {
      toast.error(`JSON Syntax Error: ${res.error}`);
    }
  };

  // Keywords string handling (support string or array)
  const keywordsValue = Array.isArray(seo.keywords)
    ? seo.keywords.join(", ")
    : seo.keywords || "";

  return (
    <div className="space-y-6 rounded-2xl border border-stone-300/80 bg-white/80 p-5 shadow-xs backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/80">
      {/* Header with Navigation Tabs */}
      <div className="flex flex-col gap-4 border-b border-stone-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="size-5 text-stone-700 dark:text-stone-300" />
            <h3 className="font-heading text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
              SEO & Social Optimization
            </h3>
          </div>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            Configure search engine indexing, social share cards, and structured JSON-LD schemas.
          </p>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-100/70 p-1 dark:border-stone-800 dark:bg-stone-950/60">
          <TabButton
            active={activeTab === "basic"}
            onClick={() => setActiveTab("basic")}
            icon={<Search className="size-3.5" />}
            label="Basic SEO"
          />
          <TabButton
            active={activeTab === "og"}
            onClick={() => setActiveTab("og")}
            icon={<Share2 className="size-3.5" />}
            label="Open Graph"
          />
          <TabButton
            active={activeTab === "twitter"}
            onClick={() => setActiveTab("twitter")}
            icon={<FaXTwitter className="size-3.5" />}
            label="Twitter / X"
          />
          <TabButton
            active={activeTab === "schema"}
            onClick={() => setActiveTab("schema")}
            icon={<Code2 className="size-3.5" />}
            label="Structured Data"
          />
        </div>
      </div>

      {/* =========================================================
          TAB 1: BASIC SEO & LIVE SEARCH ENGINE PREVIEW
          ========================================================= */}
      {activeTab === "basic" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Live Google Search Engine Preview Box */}
          <div className="rounded-xl border border-stone-200/90 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-stone-950/40">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <Search className="size-3.5" /> Google Search Preview
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/60">
                Live Snippet
              </span>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-xs font-sans dark:border-stone-800 dark:bg-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex size-5 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-stone-900 leading-none dark:text-stone-100">
                    Stoneza
                  </span>
                  <span className="text-[11px] text-stone-500 leading-tight truncate max-w-md dark:text-stone-400">
                    {effectiveCanonical}
                  </span>
                </div>
              </div>
              <h4 className="text-[18px] leading-snug font-normal text-[#1a0dab] hover:underline cursor-pointer dark:text-[#8ab4f8] line-clamp-1">
                {effectiveMetaTitle}
              </h4>
              <p className="mt-1 text-[13px] leading-relaxed text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2">
                {effectiveMetaDesc}
              </p>
            </div>
          </div>

          {/* Form Fields for Basic SEO */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Meta Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
                  Meta Title
                </Label>
                <CharacterCount current={seo.metaTitle?.length || 0} max={60} />
              </div>
              <Input
                placeholder={autoTitle}
                value={seo.metaTitle || ""}
                onChange={(e) => onChange("metaTitle", e.target.value)}
              />
              <FallbackNote
                isOverridden={Boolean(seo.metaTitle?.trim())}
                fallbackText={autoTitle}
                onReset={() => onChange("metaTitle", "")}
              />
            </div>

            {/* Canonical URL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
                  Canonical URL
                </Label>
              </div>
              <Input
                placeholder={autoCanonical}
                value={seo.canonicalUrl || ""}
                onChange={(e) => onChange("canonicalUrl", e.target.value)}
              />
              <FallbackNote
                isOverridden={Boolean(seo.canonicalUrl?.trim())}
                fallbackText={autoCanonical}
                onReset={() => onChange("canonicalUrl", "")}
              />
            </div>
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
                Meta Description
              </Label>
              <CharacterCount current={seo.metaDescription?.length || 0} max={160} />
            </div>
            <Textarea
              rows={3}
              placeholder={autoDescription}
              value={seo.metaDescription || ""}
              onChange={(e) => onChange("metaDescription", e.target.value)}
            />
            <FallbackNote
              isOverridden={Boolean(seo.metaDescription?.trim())}
              fallbackText={autoDescription}
              onReset={() => onChange("metaDescription", "")}
            />
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
              Search Keywords (Comma-separated)
            </Label>
            <Input
              placeholder="e.g. natural stone, sandstone cladding, stoneza surfaces"
              value={keywordsValue}
              onChange={(e) => onChange("keywords", e.target.value)}
            />
          </div>

          {/* Robots Directives */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-950/40">
            <h4 className="font-heading text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
              Robots & Crawling Directives
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              Instruct search engine bots how to index this page and crawl links.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
                <div>
                  <Label className="text-xs font-semibold cursor-pointer select-none">
                    Index in Search (robots: index)
                  </Label>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Allow search engines to show this page in search results.
                  </p>
                </div>
                <Switch
                  checked={seo.robotsIndex !== false}
                  onCheckedChange={(val) => onChange("robotsIndex", val)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
                <div>
                  <Label className="text-xs font-semibold cursor-pointer select-none">
                    Follow Links (robots: follow)
                  </Label>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Allow search engines to crawl hyperlinks on this page.
                  </p>
                </div>
                <Switch
                  checked={seo.robotsFollow !== false}
                  onCheckedChange={(val) => onChange("robotsFollow", val)}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
              <span className="font-medium">Active Directive:</span>
              <code className="rounded bg-stone-200/80 px-2 py-0.5 font-mono text-[11px] text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                {seo.robotsIndex !== false ? "index" : "noindex"},{" "}
                {seo.robotsFollow !== false ? "follow" : "nofollow"}
              </code>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: OPEN GRAPH (FACEBOOK, LINKEDIN, WHATSAPP)
          ========================================================= */}
      {activeTab === "og" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="rounded-xl border border-stone-200/90 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-stone-950/40">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Social Card Preview (WhatsApp / Facebook / LinkedIn)
            </span>

            <div className="mt-3 max-w-md overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-[#1a1a1a]">
              {effectiveOgImage ? (
                <div className="relative h-44 w-full bg-stone-100 dark:bg-stone-800">
                  <Image
                    src={effectiveOgImage}
                    alt="OG Preview"
                    fill
                    className="object-cover"
                    unoptimized={Boolean(effectiveOgImage.startsWith("http"))}
                  />
                </div>
              ) : (
                <div className="flex h-36 w-full items-center justify-center bg-stone-100 text-xs text-stone-400 dark:bg-stone-800">
                  No preview image
                </div>
              )}
              <div className="p-3">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  STONEZA.IN
                </span>
                <h5 className="mt-0.5 text-sm font-bold text-stone-900 line-clamp-1 dark:text-stone-100">
                  {effectiveOgTitle}
                </h5>
                <p className="mt-1 text-xs text-stone-500 line-clamp-2 dark:text-stone-400">
                  {effectiveOgDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* OG Title */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
                OG Title
              </Label>
              <Input
                placeholder={effectiveMetaTitle}
                value={seo.ogTitle || ""}
                onChange={(e) => onChange("ogTitle", e.target.value)}
              />
              <FallbackNote
                isOverridden={Boolean(seo.ogTitle?.trim())}
                fallbackText={effectiveMetaTitle}
                onReset={() => onChange("ogTitle", "")}
              />
            </div>

            {/* OG Type */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
                OG Type
              </Label>
              <Select
                value={seo.ogType || "website"}
                onValueChange={(val) => onChange("ogType", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select OG Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">website</SelectItem>
                  <SelectItem value="article">article</SelectItem>
                  <SelectItem value="product">product</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* OG Description */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
              OG Description
            </Label>
            <Textarea
              rows={2}
              placeholder={effectiveMetaDesc}
              value={seo.ogDescription || ""}
              onChange={(e) => onChange("ogDescription", e.target.value)}
            />
            <FallbackNote
              isOverridden={Boolean(seo.ogDescription?.trim())}
              fallbackText={effectiveMetaDesc}
              onReset={() => onChange("ogDescription", "")}
            />
          </div>

          {/* OG Image Uploader & Direct URL */}
          <div className="rounded-xl border border-dashed border-stone-300 p-4 dark:border-stone-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <Label className="text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-semibold">
                  Open Graph Image
                </Label>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Recommended size: 1200 × 630px.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="og-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleOgImageUpload(f);
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingOg}
                  onClick={() => document.getElementById("og-file-input")?.click()}
                  className="cursor-pointer"
                >
                  {uploadingOg ? (
                    <>
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mr-1.5 size-3.5" /> Upload Image
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Input
                placeholder="Or paste image URL (https://...)"
                value={seo.ogImage || ""}
                onChange={(e) => onChange("ogImage", e.target.value)}
              />
              {seo.ogImage && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => onChange("ogImage", "")}
                  title="Remove custom OG image"
                >
                  <Trash2 className="size-4 text-red-500" />
                </Button>
              )}
            </div>

            <FallbackNote
              isOverridden={Boolean(seo.ogImage?.trim())}
              fallbackText={entityContext.image || "Default Global OG Image"}
              onReset={() => onChange("ogImage", "")}
            />
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: TWITTER / X CARD METADATA
          ========================================================= */}
      {activeTab === "twitter" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Twitter Card Type */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
                Twitter Card Format
              </Label>
              <Select
                value={seo.twitterCard || "summary_large_image"}
                onValueChange={(val) => onChange("twitterCard", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Card Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary_large_image">summary_large_image (Large Banner)</SelectItem>
                  <SelectItem value="summary">summary (Small Thumbnail)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Twitter Title */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
                Twitter Title
              </Label>
              <Input
                placeholder={effectiveOgTitle}
                value={seo.twitterTitle || ""}
                onChange={(e) => onChange("twitterTitle", e.target.value)}
              />
              <FallbackNote
                isOverridden={Boolean(seo.twitterTitle?.trim())}
                fallbackText={effectiveOgTitle}
                onReset={() => onChange("twitterTitle", "")}
              />
            </div>
          </div>

          {/* Twitter Description */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
              Twitter Description
            </Label>
            <Textarea
              rows={2}
              placeholder={effectiveOgDesc}
              value={seo.twitterDescription || ""}
              onChange={(e) => onChange("twitterDescription", e.target.value)}
            />
            <FallbackNote
              isOverridden={Boolean(seo.twitterDescription?.trim())}
              fallbackText={effectiveOgDesc}
              onReset={() => onChange("twitterDescription", "")}
            />
          </div>

          {/* Twitter Image */}
          <div className="rounded-xl border border-dashed border-stone-300 p-4 dark:border-stone-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <Label className="text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-semibold">
                  Twitter Card Image
                </Label>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Defaults to OG image if empty.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="tw-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleTwitterImageUpload(f);
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingTwitter}
                  onClick={() => document.getElementById("tw-file-input")?.click()}
                  className="cursor-pointer"
                >
                  {uploadingTwitter ? (
                    <>
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mr-1.5 size-3.5" /> Upload Image
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Input
                placeholder="Or paste Twitter image URL (https://...)"
                value={seo.twitterImage || ""}
                onChange={(e) => onChange("twitterImage", e.target.value)}
              />
              {seo.twitterImage && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => onChange("twitterImage", "")}
                  title="Remove custom Twitter image"
                >
                  <Trash2 className="size-4 text-red-500" />
                </Button>
              )}
            </div>

            <FallbackNote
              isOverridden={Boolean(seo.twitterImage?.trim())}
              fallbackText={effectiveOgImage}
              onReset={() => onChange("twitterImage", "")}
            />
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: STRUCTURED DATA / JSON-LD (AUTOMATIC & CUSTOM)
          ========================================================= */}
      {activeTab === "schema" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Custom vs Automatic Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-stone-950/40">
            <div>
              <h4 className="font-heading text-sm font-semibold text-stone-900 dark:text-stone-100">
                JSON-LD Schema Mode
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {seo.enableCustomJsonLd
                  ? "Advanced Mode: Custom raw JSON-LD is overriding automatic schema."
                  : "Automatic Mode: Schema is automatically generated from live entity data."}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Label htmlFor="custom-json-switch" className="text-xs font-semibold cursor-pointer">
                Enable Custom JSON-LD
              </Label>
              <Switch
                id="custom-json-switch"
                checked={Boolean(seo.enableCustomJsonLd)}
                onCheckedChange={(checked) => {
                  onChange("enableCustomJsonLd", checked);
                  if (checked && !seo.customJsonLd?.trim()) {
                    // Pre-fill with automatic schema template
                    onChange("customJsonLd", JSON.stringify(autoSchemaPreview, null, 2));
                  }
                }}
              />
            </div>
          </div>

          {/* Automatic Mode View */}
          {!seo.enableCustomJsonLd && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400">
                  <Sparkles className="size-3.5 text-amber-600 dark:text-amber-400" />
                  Detected Schema Type:{" "}
                  <strong className="text-stone-900 dark:text-stone-100">
                    {autoSchemaPreview["@type"] || "WebPage"}
                  </strong>
                </span>
                <span className="text-xs text-stone-500">Auto-Generated</span>
              </div>

              <pre className="max-h-72 overflow-auto rounded-xl border border-stone-200 bg-stone-900 p-4 font-mono text-xs leading-relaxed text-emerald-400 shadow-inner dark:border-stone-800">
                {JSON.stringify(autoSchemaPreview, null, 2)}
              </pre>
            </div>
          )}

          {/* Custom Mode JSON Editor */}
          {seo.enableCustomJsonLd && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
                  Raw JSON-LD Editor
                </Label>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleValidateCustomJson}
                    className="cursor-pointer text-xs"
                  >
                    <CheckCircle2 className="mr-1.5 size-3.5 text-emerald-600" /> Validate & Format
                  </Button>
                </div>
              </div>

              <Textarea
                rows={10}
                className="font-mono text-xs leading-relaxed bg-stone-950 text-emerald-300 selection:bg-emerald-900"
                placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Product"\n}`}
                value={seo.customJsonLd || ""}
                onChange={(e) => {
                  onChange("customJsonLd", e.target.value);
                  setJsonValidation({ tested: false, valid: true, error: null });
                }}
              />

              {jsonValidation.tested && (
                <div
                  className={`flex items-center gap-2 rounded-lg p-3 text-xs ${
                    jsonValidation.valid
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "border border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                  }`}
                >
                  {jsonValidation.valid ? (
                    <>
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                      <span>Valid JSON syntax. This schema will be rendered on the live page.</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="size-4 shrink-0 text-red-600" />
                      <span>Syntax error: {jsonValidation.error}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Small UI helper components
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
        active
          ? "bg-white text-stone-900 shadow-xs dark:bg-stone-800 dark:text-stone-100"
          : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function CharacterCount({ current, max }) {
  const isOver = current > max;
  return (
    <span
      className={`text-[11px] font-mono ${
        isOver
          ? "font-bold text-amber-600 dark:text-amber-400"
          : "text-stone-500 dark:text-stone-400"
      }`}
    >
      {current} / {max} chars
    </span>
  );
}

function FallbackNote({ isOverridden, fallbackText, onReset }) {
  return (
    <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
      {isOverridden ? (
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle2 className="size-3" /> Custom override applied
        </span>
      ) : (
        <span className="truncate max-w-[280px]">
          <span className="font-medium text-stone-600 dark:text-stone-300">Auto:</span> {fallbackText || "None"}
        </span>
      )}

      {isOverridden && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer ml-2"
          title="Reset to automatic fallback"
        >
          <RotateCcw className="size-3" /> Reset
        </button>
      )}
    </div>
  );
}
