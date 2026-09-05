import Link from "next/link";

import { ProgramsList } from "@/components/admin/programs-list";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listAllPrograms } from "@/lib/data/admin-programs";
import { Button } from "@/components/ui/button";

export default async function AdminProgramsPage() {
  await requireContentStaff();
  const programs = await listAllPrograms();

  return (
    <AdminListShell
      section="programs"
      action={
        <Button asChild>
          <Link href="/dashboard/admin/programs/new">New programme</Link>
        </Button>
      }
    >
      <ProgramsList programs={programs} />
    </AdminListShell>
  );
}
