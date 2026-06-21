import { AdminSettingsForm } from "@/components/admin/settings-form";
import { requireSuperAdmin } from "@/lib/auth/permissions";
import { getAdminSettings } from "@/lib/data/admin-settings";

export default async function AdminSettingsPage() {
  await requireSuperAdmin();
  const { settings, documentTypes } = await getAdminSettings();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Settings</h1>
        <p className="mt-2 text-caption">
          College branding, document fees, and student notification templates.
        </p>
      </header>

      <AdminSettingsForm settings={settings} documentTypes={documentTypes} />
    </div>
  );
}
