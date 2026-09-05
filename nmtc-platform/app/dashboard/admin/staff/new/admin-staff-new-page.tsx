import { StaffForm } from "@/components/admin/staff-form";
import { AdminEditShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listDepartments } from "@/lib/data/admin-staff";

export default async function AdminStaffNewPage() {
  await requireContentStaff();
  const departments = await listDepartments();

  return (
    <AdminEditShell
      listHref="/dashboard/admin/staff"
      listLabel="Faculty & staff"
      title="New staff profile"
      subtitle="Create a public faculty or staff profile."
    >
      <StaffForm departments={departments} />
    </AdminEditShell>
  );
}
