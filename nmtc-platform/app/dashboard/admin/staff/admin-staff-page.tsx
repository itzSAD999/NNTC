import Link from "next/link";

import { StaffList } from "@/components/admin/staff-list";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listAllStaff } from "@/lib/data/admin-staff";
import { Button } from "@/components/ui/button";

export default async function AdminStaffPage() {
  await requireContentStaff();
  const staff = await listAllStaff();

  return (
    <AdminListShell
      section="staff"
      action={
        <Button asChild>
          <Link href="/dashboard/admin/staff/new">New profile</Link>
        </Button>
      }
    >
      <StaffList staff={staff} />
    </AdminListShell>
  );
}
