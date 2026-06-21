import { StaffList } from "@/components/admin/staff-list";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listAllStaff } from "@/lib/data/admin-staff";

export default async function AdminStaffPage() {
  await requireContentStaff();
  const staff = await listAllStaff();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Staff CMS</h1>
        <p className="mt-2 text-caption">
          Manage public staff and lecturer profiles for the faculty directory.
        </p>
      </header>
      <StaffList staff={staff} />
    </div>
  );
}
