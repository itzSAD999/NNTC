import { notFound } from "next/navigation";

import { StaffForm } from "@/components/admin/staff-form";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getStaffForEdit, listDepartments } from "@/lib/data/admin-staff";

export default async function AdminStaffEditPage({
  params,
}: {
  params: { id: string };
}) {
  await requireContentStaff();
  const [profile, departments] = await Promise.all([
    getStaffForEdit(params.id),
    listDepartments(),
  ]);

  if (!profile) notFound();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Edit staff profile</h1>
        <p className="mt-2 text-caption">{profile.full_name}</p>
      </header>
      <StaffForm departments={departments} profile={profile} />
    </div>
  );
}
