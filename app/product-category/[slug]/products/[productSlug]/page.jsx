import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoryProductPage({ params }) {
  const { productSlug } = await params;
  redirect(`/product/${productSlug}`);
}

