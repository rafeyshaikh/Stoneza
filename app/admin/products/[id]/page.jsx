import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import ProductForm from "@/components/admin/products/ProductForm";

export default function EditProductPage() {
  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Edit Product" description="Update product details, stock, and SEO metadata." />
      <ProductForm />
    </>
  );
}
