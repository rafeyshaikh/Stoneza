import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import PasswordSection from "@/components/account/PasswordSection";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <PageHeader title="Settings" description="Admin-level settings, security controls, and operational defaults." />
      
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-300/70 p-6 shadow-xs dark:border-stone-800">
        <PasswordSection />
      </div>
    </div>
  );
}
