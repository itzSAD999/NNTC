import { ResourceForm } from "@/components/admin/resource-form";
import { AdminEditShell } from "@/components/admin/admin-layout";
import { requireAcademicStaff } from "@/lib/auth/permissions";

export default async function AdminResourceNewPage() {
  await requireAcademicStaff();

  return (
    <AdminEditShell
      listHref="/dashboard/admin/resources"
      listLabel="Resources"
      title="New resource"
      subtitle="Upload a document for the public Resources page."
    >
      <ResourceForm />
    </AdminEditShell>
  );
}
