import { Button } from "@/components/ui/button";

export default function SitemapSettings() {
  return (
    <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
      <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">Sitemap Settings</h3>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Enable dynamic sitemap generation for products, categories, static pages, and future blog routes.</p>
      <div className="mt-4">
        <Button variant="outline">Regenerate Sitemap</Button>
      </div>
    </section>
  );
}
