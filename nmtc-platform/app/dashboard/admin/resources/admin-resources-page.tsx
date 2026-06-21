import { ResourcesList } from "@/components/admin/resources-list";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listAllResources } from "@/lib/data/admin-resources";

export default async function AdminResourcesPage() {
  await requireContentStaff();
  const resources = await listAllResources();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Student resources CMS</h1>
        <p className="mt-2 text-caption">
          Upload handbooks, timetables, forms, and academic calendars.
        </p>
      </header>
      <ResourcesList resources={resources} />
    </div>
  );
}
