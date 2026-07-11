"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import GlobalSeoForm from "@/components/admin/seo/GlobalSeoForm";
import RobotsEditor from "@/components/admin/seo/RobotsEditor";
import SitemapSettings from "@/components/admin/seo/SitemapSettings";
import { Loader2 } from "lucide-react";

export default function SeoPage() {
  const [data, setData] = useState({
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    ogImage: "",
    googleAnalyticsId: "",
    searchConsoleVerification: "",
    robotsTxt: "",
    sitemapEnabled: true,
    sitemapExcludePaths: "",
    sitemapChangeFrequency: "weekly",
    sitemapPriority: 0.8,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeoData();
  }, []);

  const fetchSeoData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/seo");
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load SEO parameters");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedFields) => {
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Save failed");
      setData(result.data);
      toast.success("SEO settings saved successfully");
      return true;
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to save SEO settings");
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-stone-500">
        <Loader2 className="mr-2 size-6 animate-spin text-stone-900" />
        Loading SEO settings...
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs />
      <PageHeader
        title="SEO & Search Engine Management"
        description="Global homepage metadata, tracking tags, dynamic robots.txt and sitemap configurations."
      />
      <div className="mt-5 space-y-5 pb-20">
        <GlobalSeoForm data={data} onSave={handleSave} />
        <RobotsEditor data={data} onSave={handleSave} />
        <SitemapSettings data={data} onSave={handleSave} />
      </div>
    </>
  );
}
