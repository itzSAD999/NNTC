import { DepartmentsEditor } from "@/components/admin/departments-editor";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireAcademicStaff } from "@/lib/auth/permissions";
import { listLooksPreviewed } from "@/lib/data/admin-preview";
import { listDepartments } from "@/lib/data/admin-programs";

export default async function AdminDepartmentsPage() {
  await requireAcademicStaff();
  const departments = await listDepartments();

  return (
    <AdminListShell section="departments" preview={listLooksPreviewed(departments)}>
      <DepartmentsEditor departments={departments} />
    </AdminListShell>
  );
}
