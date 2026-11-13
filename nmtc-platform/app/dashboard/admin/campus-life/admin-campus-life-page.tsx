import { CampusEditor } from "@/components/admin/campus-editor";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listLooksPreviewed } from "@/lib/data/admin-preview";
import { listCampusSections } from "@/lib/data/admin-campus";

export default async function AdminCampusLifePage() {
  await requireContentStaff();
  const sections = await listCampusSections();

  return (
    <AdminListShell section="campus-life" preview={listLooksPreviewed(sections)}>
      <CampusEditor sections={sections} />
    </AdminListShell>
  );
}
