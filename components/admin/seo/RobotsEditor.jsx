"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";

export default function RobotsEditor({ data, onSave }) {
  const [robotsTxt, setRobotsTxt] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setRobotsTxt(data.robotsTxt || "");
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ robotsTxt });
    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70"
    >
      <div>
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">
          robots.txt Editor
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Control which parts of the site search engines are allowed to crawl.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="robots-content">robots.txt Direct Content</Label>
        <Textarea
          id="robots-content"
          rows={6}
          placeholder="User-agent: *..."
          value={robotsTxt}
          onChange={(e) => setRobotsTxt(e.target.value)}
          className="font-mono text-xs leading-relaxed"
        />
      </div>

      <div className="flex justify-end border-t pt-4">
        <Button type="submit" disabled={saving} className="shadow-sm cursor-pointer border border-black bg-white hover:bg-gray-100 text-stone-900">
          {saving ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" /> Save Robots.txt
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
