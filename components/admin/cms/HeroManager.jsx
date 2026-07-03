import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/admin/products/ImageUploader";

export default function HeroManager() {
  return (
    <section className="space-y-4 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">Hero Slider CMS</h3>
        <Button size="sm">Add Banner</Button>
      </div>
      <ImageUploader hint="Upload hero banner directly to Cloudinary." />
      <div className="rounded-xl border border-stone-300 bg-white/80 p-4 text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-400">
        Banner list with drag-and-drop ordering should be rendered here.
      </div>
    </section>
  );
}
