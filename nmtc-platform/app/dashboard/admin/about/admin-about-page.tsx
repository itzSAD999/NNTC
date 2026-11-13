import { AboutEditor } from "@/components/admin/about-editor";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listLooksPreviewed } from "@/lib/data/admin-preview";
import { getAboutForEdit } from "@/lib/data/admin-about";

export default async function AdminAboutPage() {
  await requireContentStaff();
  const data = await getAboutForEdit();

  return (
    <AdminListShell section="about" preview={listLooksPreviewed(data.accreditations)}>
      <AboutEditor data={data} />
    </AdminListShell>
  );
}
