import { notFound } from "next/navigation";

import { ProgramForm } from "@/components/admin/program-form";
import { AdminEditShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getProgramForEdit, listDepartments } from "@/lib/data/admin-programs";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminProgramEditPage({ params }: PageProps) {
  await requireContentStaff();
  const { id } = await params;
  const [program, departments] = await Promise.all([
    getProgramForEdit(id),
    listDepartments(),
  ]);

  if (!program) notFound();

  return (
    <AdminEditShell
      listHref="/dashboard/admin/programs"
      listLabel="Programmes"
      title="Edit programme"
      subtitle={program.name}
    >
      <ProgramForm departments={departments} program={program} />
    </AdminEditShell>
  );
}
