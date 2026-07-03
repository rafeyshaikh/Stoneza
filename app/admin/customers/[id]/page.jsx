import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";

export default function CustomerProfilePage() {
  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Customer Profile" description="Customer details, order history, and saved addresses." />
      <div className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 text-sm text-stone-500 dark:border-stone-800 dark:bg-stone-950/70 dark:text-stone-400">
        Customer profile view placeholder.
      </div>
    </>
  );
}
