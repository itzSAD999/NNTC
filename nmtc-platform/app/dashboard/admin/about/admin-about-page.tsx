import { AboutEditor } from "@/components/admin/about-editor";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getAboutForEdit } from "@/lib/data/admin-about";

export default async function AdminAboutPage() {
  await requireContentStaff();
  const data = await getAboutForEdit();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">About CMS</h1>
        <p className="mt-2 text-caption">
          Edit about content, accreditations, and organisation structure.
        </p>
      </header>
      <AboutEditor data={data} />
    </div>
  );
}
