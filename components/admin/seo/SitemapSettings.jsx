"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";

export default function SitemapSettings({ data, onSave }) {
  const [formData, setFormData] = useState({
    sitemapEnabled: true,
    sitemapExcludePaths: "",
    sitemapChangeFrequency: "weekly",
    sitemapPriority: 0.8,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        sitemapEnabled: data.sitemapEnabled !== false,
        sitemapExcludePaths: data.sitemapExcludePaths || "",
        sitemapChangeFrequency: data.sitemapChangeFrequency || "weekly",
        sitemapPriority: data.sitemapPriority || 0.8,
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70"
    >
      <div>
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">
          Sitemap Configurations
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Control parameters for the dynamic sitemap generation served at `/sitemap.xml`.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 py-1">
            <input
              id="sitemap-enabled"
              type="checkbox"
              checked={formData.sitemapEnabled}
              onChange={(e) => handleChange("sitemapEnabled", e.target.checked)}
              className="size-4 rounded border-stone-300 text-stone-950 focus:ring-stone-950"
            />
            <Label htmlFor="sitemap-enabled" className="text-sm font-semibold cursor-pointer select-none">
              Generate & Publish sitemap.xml
            </Label>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sitemap-freq">Crawl Change Frequency</Label>
            <select
              id="sitemap-freq"
              value={formData.sitemapChangeFrequency}
              onChange={(e) => handleChange("sitemapChangeFrequency", e.target.value)}
              className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-950 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            >
              <option value="always">Always (Real-time updates)</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="never">Never (Static contents)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sitemap-priority">Default Path Priority (0.0 - 1.0)</Label>
            <Input
              id="sitemap-priority"
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={formData.sitemapPriority}
              onChange={(e) => handleChange("sitemapPriority", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-1.5 flex flex-col justify-end">
          <Label htmlFor="sitemap-exclude">Exclude Patterns (Comma-separated paths)</Label>
          <textarea
            id="sitemap-exclude"
            rows={5}
            placeholder="e.g. /admin, /api, /profile"
            value={formData.sitemapExcludePaths}
            onChange={(e) => handleChange("sitemapExcludePaths", e.target.value)}
            className="flex w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-950 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
        </div>
      </div>

      <div className="flex justify-end border-t pt-4">
        <Button type="submit" disabled={saving} className="shadow-sm cursor-pointer border border-black bg-white hover:bg-gray-100 text-stone-900">
          {saving ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" /> Save Sitemap Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
