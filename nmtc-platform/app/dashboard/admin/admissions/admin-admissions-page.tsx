import { AdmissionsEditor } from "@/components/admin/admissions-editor";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getAdmissionsForEdit } from "@/lib/data/admin-admissions";

export default async function AdminAdmissionsPage() {
  await requireContentStaff();
  const data = await getAdmissionsForEdit();

  return (
    <AdminListShell section="admissions">
      <AdmissionsEditor
        content={data.content}
        documents={data.documents}
        faqs={data.faqs}
      />
    </AdminListShell>
  );
}
