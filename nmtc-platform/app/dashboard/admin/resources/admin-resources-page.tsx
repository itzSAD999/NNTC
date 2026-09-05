import Link from "next/link";

import { ResourcesList } from "@/components/admin/resources-list";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listAllResources } from "@/lib/data/admin-resources";
import { Button } from "@/components/ui/button";

export default async function AdminResourcesPage() {
  await requireContentStaff();
  const resources = await listAllResources();

  return (
    <AdminListShell
      section="resources"
      action={
        <Button asChild>
          <Link href="/dashboard/admin/resources/new">New resource</Link>
        </Button>
      }
    >
      <ResourcesList resources={resources} />
    </AdminListShell>
  );
}
