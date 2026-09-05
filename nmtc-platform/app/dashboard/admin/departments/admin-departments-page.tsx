import { DepartmentsEditor } from "@/components/admin/departments-editor";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listDepartments } from "@/lib/data/admin-programs";

export default async function AdminDepartmentsPage() {
  await requireContentStaff();
  const departments = await listDepartments();

  return (
    <AdminListShell section="departments">
      <DepartmentsEditor departments={departments} />
    </AdminListShell>
  );
}
