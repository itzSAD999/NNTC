import { AdmissionsEditor } from "@/components/admin/admissions-editor";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireAcademicStaff } from "@/lib/auth/permissions";
import { listLooksPreviewed } from "@/lib/data/admin-preview";
import { getAdmissionsForEdit } from "@/lib/data/admin-admissions";

export default async function AdminAdmissionsPage() {
  await requireAcademicStaff();
  const data = await getAdmissionsForEdit();

  return (
    <AdminListShell section="admissions" preview={listLooksPreviewed(data.documents)}>
      <AdmissionsEditor
        content={data.content}
        documents={data.documents}
        faqs={data.faqs}
      />
    </AdminListShell>
  );
}
