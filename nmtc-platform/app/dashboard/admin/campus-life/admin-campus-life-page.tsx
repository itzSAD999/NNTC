import { CampusEditor } from "@/components/admin/campus-editor";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listCampusSections } from "@/lib/data/admin-campus";

export default async function AdminCampusLifePage() {
  await requireContentStaff();
  const sections = await listCampusSections();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Campus life CMS</h1>
        <p className="mt-2 text-caption">
          Edit campus life sections — overview, accommodation, dining, and more.
        </p>
      </header>
      <CampusEditor sections={sections} />
    </div>
  );
}
