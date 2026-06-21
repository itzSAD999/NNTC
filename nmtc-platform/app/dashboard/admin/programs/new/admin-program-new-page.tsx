import { ProgramForm } from "@/components/admin/program-form";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listDepartments } from "@/lib/data/admin-programs";

export default async function AdminProgramNewPage() {
  await requireContentStaff();
  const departments = await listDepartments();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">New programme</h1>
      </header>
      <ProgramForm departments={departments} />
    </div>
  );
}
