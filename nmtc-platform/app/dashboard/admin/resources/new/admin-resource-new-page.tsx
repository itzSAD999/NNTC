import { ResourceForm } from "@/components/admin/resource-form";
import { requireContentStaff } from "@/lib/auth/permissions";

export default async function AdminResourceNewPage() {
  await requireContentStaff();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">New resource</h1>
      </header>
      <ResourceForm />
    </div>
  );
}
