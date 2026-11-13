import { notFound } from "next/navigation";

import { StaffForm } from "@/components/admin/staff-form";
import { AdminEditShell } from "@/components/admin/admin-layout";
import { requireStaffDirectoryStaff } from "@/lib/auth/permissions";
import { getStaffForEdit, listDepartments } from "@/lib/data/admin-staff";

export default async function AdminStaffEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaffDirectoryStaff();
  const { id } = await params;
  const [profile, departments] = await Promise.all([
    getStaffForEdit(id),
    listDepartments(),
  ]);

  if (!profile) notFound();

  return (
    <AdminEditShell
      listHref="/dashboard/admin/staff"
      listLabel="Faculty & staff"
      title="Edit staff profile"
      subtitle={profile.full_name}
    >
      <StaffForm departments={departments} profile={profile} />
    </AdminEditShell>
  );
}
