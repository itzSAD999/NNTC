import { AdminSettingsForm } from "@/components/admin/settings-form";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireSuperAdmin } from "@/lib/auth/permissions";
import { listLooksPreviewed } from "@/lib/data/admin-preview";
import { getAdminSettings } from "@/lib/data/admin-settings";

export default async function AdminSettingsPage() {
  await requireSuperAdmin();
  const { settings, documentTypes } = await getAdminSettings();

  return (
    <AdminListShell
      section="settings"
      preview={listLooksPreviewed(documentTypes)}
    >
      <AdminSettingsForm settings={settings} documentTypes={documentTypes} />
    </AdminListShell>
  );
}
