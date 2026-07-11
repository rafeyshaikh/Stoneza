"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/admin/products/ImageUploader";
import { toast } from "sonner";

export default function FeaturedCollectionsManager({ data = {}, onChange, uploadImage }) {
  const updateField = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleImageSelect = async (file) => {
    try {
      const uploaded = await uploadImage(file, "homepage/featured");
      if (uploaded) {
        updateField("bannerImage", uploaded);
        toast.success("Featured banner uploaded successfully");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload featured banner");
    }
  };

  const handleImageRemove = () => {
    updateField("bannerImage", { url: "", publicId: "" });
    toast.success("Featured banner removed");
  };

  return (
    <section className="space-y-4 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
      <div>
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">
          Featured Products Section Header
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Manage header text and promotion banner rendered alongside featured items.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="featured-title">Section Title</Label>
            <Input
              id="featured-title"
              placeholder="Featured Products"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="featured-btn-text">Button Text</Label>
            <Input
              id="featured-btn-text"
              placeholder="Explore"
              value={data.buttonText || ""}
              onChange={(e) => updateField("buttonText", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="featured-caption">Section Description</Label>
            <Textarea
              id="featured-caption"
              rows={4}
              placeholder="Describe the collection details..."
              value={data.caption || ""}
              onChange={(e) => updateField("caption", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <ImageUploader
            existingImage={data.bannerImage?.url ? data.bannerImage : null}
            onFileSelect={handleImageSelect}
            onRemove={handleImageRemove}
            hint="Upload promotion sidebar image (approx. 1200x700 aspect recommendation)."
          />
        </div>
      </div>
    </section>
  );
}
