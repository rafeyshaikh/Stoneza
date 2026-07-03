import { Input } from "@/components/ui/input";

export default function SeoEditor() {
  return (
    <section className="space-y-3 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
      <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">Page SEO</h3>
      <Input placeholder="Meta title" />
      <Input placeholder="Meta description" />
      <Input placeholder="Keywords" />
      <Input placeholder="Canonical URL" />
      <Input placeholder="OG image URL" />
    </section>
  );
}
