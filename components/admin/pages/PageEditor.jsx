import { Button } from "@/components/ui/button";
import SeoEditor from "@/components/admin/pages/SeoEditor";

export default function PageEditor({ title = "Static Page" }) {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">{title} Content</h3>
        <div className="mt-3 min-h-64 rounded-xl border border-stone-300 bg-white/70 p-4 text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-400">
          TipTap editor placeholder for rich text content.
        </div>
      </section>

      <SeoEditor />

      <div className="flex justify-end">
        <Button>Save Page</Button>
      </div>
    </div>
  );
}
