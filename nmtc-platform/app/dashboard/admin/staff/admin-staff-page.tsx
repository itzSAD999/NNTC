import Link from "next/link";

import { StaffList } from "@/components/admin/staff-list";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireStaffDirectoryStaff } from "@/lib/auth/permissions";
import { listLooksPreviewed } from "@/lib/data/admin-preview";
import { listAllStaff } from "@/lib/data/admin-staff";
import { Button } from "@/components/ui/button";

export default async function AdminStaffPage() {
  await requireStaffDirectoryStaff();
  const staff = await listAllStaff();

  return (
    <AdminListShell
      section="staff"
      preview={listLooksPreviewed(staff)}
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
