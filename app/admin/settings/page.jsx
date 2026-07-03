import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";

export default function SettingsPage() {
  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Settings" description="Admin-level settings, integrations, and future operational controls." />
      <div className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 text-sm text-stone-500 dark:border-stone-800 dark:bg-stone-950/70 dark:text-stone-400">
        Configure integrations like Razorpay keys, notification channels, and operational defaults.
      </div>
    </>
  );
}
