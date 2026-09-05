import { CampusEditor } from "@/components/admin/campus-editor";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listCampusSections } from "@/lib/data/admin-campus";

export default async function AdminCampusLifePage() {
  await requireContentStaff();
  const sections = await listCampusSections();

  return (
    <AdminListShell section="campus-life">
      <CampusEditor sections={sections} />
    </AdminListShell>
  );
}
