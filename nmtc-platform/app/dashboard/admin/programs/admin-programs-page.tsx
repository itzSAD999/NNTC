import { ProgramsList } from "@/components/admin/programs-list";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listAllPrograms } from "@/lib/data/admin-programs";

export default async function AdminProgramsPage() {
  await requireContentStaff();
  const programs = await listAllPrograms();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Programmes CMS</h1>
        <p className="mt-2 text-caption">
          Create and publish nursing and midwifery programmes.
        </p>
      </header>
      <ProgramsList programs={programs} />
    </div>
  );
}
