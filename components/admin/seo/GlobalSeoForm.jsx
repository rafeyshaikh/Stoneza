import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GlobalSeoForm() {
  return (
    <form className="space-y-4 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
      <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">Global SEO</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <Input placeholder="Site title" />
        <Input placeholder="Default OG image URL" />
        <Input placeholder="Default meta description" className="md:col-span-2" />
        <Input placeholder="Google Analytics ID" />
        <Input placeholder="Search Console verification" />
      </div>
      <div className="flex justify-end">
        <Button>Save Global SEO</Button>
      </div>
    </form>
  );
}
