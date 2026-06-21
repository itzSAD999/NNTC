import { AdmissionsEditor } from "@/components/admin/admissions-editor";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getAdmissionsForEdit } from "@/lib/data/admin-admissions";

export default async function AdminAdmissionsPage() {
  await requireContentStaff();
  const data = await getAdmissionsForEdit();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Admissions CMS</h1>
        <p className="mt-2 text-caption">
          Application process, documents, fees, and FAQs for the public admissions page.
        </p>
      </header>
      <AdmissionsEditor
        content={data.content}
        documents={data.documents}
        faqs={data.faqs}
      />
    </div>
  );
}
