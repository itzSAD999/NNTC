import { notFound } from "next/navigation";

import { ProgramForm } from "@/components/admin/program-form";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getProgramForEdit, listDepartments } from "@/lib/data/admin-programs";

type PageProps = { params: { id: string } };

export default async function AdminProgramEditPage({ params }: PageProps) {
  await requireContentStaff();
  const [program, departments] = await Promise.all([
    getProgramForEdit(params.id),
    listDepartments(),
  ]);

  if (!program) notFound();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Edit programme</h1>
        <p className="mt-2 text-caption">{program.name}</p>
      </header>
      <ProgramForm departments={departments} program={program} />
    </div>
  );
}
