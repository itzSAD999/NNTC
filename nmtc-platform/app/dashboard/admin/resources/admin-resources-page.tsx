import Link from "next/link";

import { ResourcesList } from "@/components/admin/resources-list";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireAcademicStaff } from "@/lib/auth/permissions";
import { listLooksPreviewed } from "@/lib/data/admin-preview";
import { listAllResources } from "@/lib/data/admin-resources";
import { Button } from "@/components/ui/button";

export default async function AdminResourcesPage() {
  await requireAcademicStaff();
  const resources = await listAllResources();

  return (
    <AdminListShell
      section="resources"
      preview={listLooksPreviewed(resources)}
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
