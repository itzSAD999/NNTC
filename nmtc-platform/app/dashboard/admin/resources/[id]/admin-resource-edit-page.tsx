import { notFound } from "next/navigation";

import { ResourceForm } from "@/components/admin/resource-form";
import { AdminEditShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getResourceForEdit } from "@/lib/data/admin-resources";

export default async function AdminResourceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireContentStaff();
  const { id } = await params;
  const resource = await getResourceForEdit(id);

  if (!resource) notFound();

  return (
    <AdminEditShell
      listHref="/dashboard/admin/resources"
      listLabel="Resources"
      title="Edit resource"
      subtitle={resource.title}
    >
      <ResourceForm resource={resource} />
    </AdminEditShell>
  );
}
