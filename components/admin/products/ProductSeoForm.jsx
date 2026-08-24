import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProductSeoForm({ seo, onChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Input
        placeholder="Meta title"
        value={seo.metaTitle}
        onChange={(e) => onChange("metaTitle", e.target.value)}
      />

      <Input
        placeholder="Canonical URL"
        value={seo.canonicalUrl}
        onChange={(e) => onChange("canonicalUrl", e.target.value)}
      />

      <Input
        placeholder="OG Image URL"
        value={seo.ogImage}
        onChange={(e) => onChange("ogImage", e.target.value)}
      />

      <Input
        placeholder="Keywords (comma separated)"
        value={seo.keywords}
        onChange={(e) => onChange("keywords", e.target.value)}
      />

      <Textarea
        placeholder="Meta description"
        rows={3}
        className="md:col-span-2"
        value={seo.metaDescription}
        onChange={(e) => onChange("metaDescription", e.target.value)}
      />
    </div>
  );
}