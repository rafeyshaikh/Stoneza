"use client";

import SeoManager from "@/components/admin/seo/SeoManager";

/**
 * Backward-compatible wrapper around the unified SeoManager component.
 */
export default function ProductSeoForm({ seo = {}, onChange, entityContext = {} }) {
  return (
    <SeoManager
      seo={seo}
      onChange={onChange}
      entityContext={{
        type: "product",
        ...entityContext,
      }}
    />
  );
}