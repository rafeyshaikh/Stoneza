import { notFound } from "next/navigation";
import { getCategoryDetails } from "@/lib/getCategoryDetails";
import CategoryPageClient from "./CategoryPageClient";
import { resolveEntityMetadata } from "@/lib/seo/resolveMetadata";
import { resolveStructuredData } from "@/lib/seo/schemaGenerator";
import JsonLd from "@/components/common/JsonLd";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getCategoryDetails(slug);

  if (!data || !data.category) {
    return {
      title: "Category Not Found",
      description: "The requested stone category could not be found.",
    };
  }

  return resolveEntityMetadata({
    entityType: "category",
    entity: data.category,
    path: `/product-category/${slug}`,
  });
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const data = await getCategoryDetails(slug);

  if (!data || !data.category) {
    notFound();
  }

  const safeData = JSON.parse(JSON.stringify(data));
  const category = safeData.category;
  const parentCategory = safeData.parentCategory;

  const structuredData = resolveStructuredData({
    entityType: "category",
    entity: category,
    options: {
      parentCategory,
    },
  });

  return (
    <>
      <JsonLd data={structuredData} id="category-ldjson" />
      <CategoryPageClient initialData={safeData} slug={slug} />
    </>
  );
}
