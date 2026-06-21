import { FeesEditor } from "@/components/admin/fees-editor";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getFinancialAidForEdit } from "@/lib/data/admin-fees";

export default async function AdminFeesPage() {
  await requireContentStaff();
  const data = await getFinancialAidForEdit();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Fees & financial aid CMS</h1>
        <p className="mt-2 text-caption">
          Fee schedules, payment methods, scholarships, SLTF, and hardship policy.
        </p>
      </header>
      <FeesEditor
        fees={data.fees}
        paymentMethods={data.paymentMethods}
        scholarships={data.scholarships}
        content={data.content}
        programs={data.programs}
      />
    </div>
  );
}
