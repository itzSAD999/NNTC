import { ProgramForm } from "@/components/admin/program-form";
import { AdminEditShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listDepartments } from "@/lib/data/admin-programs";

export default async function AdminProgramNewPage() {
  await requireContentStaff();
  const departments = await listDepartments();

  return (
    <AdminEditShell
      listHref="/dashboard/admin/programs"
      listLabel="Programmes"
      title="New programme"
      subtitle="Create a nursing or midwifery programme for the public site."
    >
      <ProgramForm departments={departments} />
    </AdminEditShell>
  );
}
