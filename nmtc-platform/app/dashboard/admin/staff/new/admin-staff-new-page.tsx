import { StaffForm } from "@/components/admin/staff-form";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listDepartments } from "@/lib/data/admin-staff";

export default async function AdminStaffNewPage() {
  await requireContentStaff();
  const departments = await listDepartments();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">New staff profile</h1>
      </header>
      <StaffForm departments={departments} />
    </div>
  );
}
