import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import PasswordSection from "@/components/account/PasswordSection";
import RecacheButton from "@/components/admin/settings/RecacheButton";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <PageHeader title="Settings" description="Admin-level settings, security controls, and operational defaults." />
      
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-300/70 p-6 shadow-xs dark:border-stone-800 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-1">
            System &amp; Cache Controls
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
            Manage server-side cache invalidation and operational database sync.
          </p>
          <RecacheButton />
        </div>

        <hr className="border-stone-200 dark:border-stone-800" />

        <div>
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Account Security
          </h3>
          <PasswordSection />
        </div>
      </div>
    </div>
  );
}
