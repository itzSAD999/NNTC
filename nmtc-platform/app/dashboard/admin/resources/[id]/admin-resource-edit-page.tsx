import { notFound } from "next/navigation";

import { ResourceForm } from "@/components/admin/resource-form";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getResourceForEdit } from "@/lib/data/admin-resources";

export default async function AdminResourceEditPage({
  params,
}: {
  params: { id: string };
}) {
  await requireContentStaff();
  const resource = await getResourceForEdit(params.id);

  if (!resource) notFound();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Edit resource</h1>
        <p className="mt-2 text-caption">{resource.title}</p>
      </header>
      <ResourceForm resource={resource} />
    </div>
  );
}
