import { FeesEditor } from "@/components/admin/fees-editor";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listLooksPreviewed } from "@/lib/data/admin-preview";
import { getFinancialAidForEdit } from "@/lib/data/admin-fees";

export default async function AdminFeesPage() {
  await requireContentStaff();
  const data = await getFinancialAidForEdit();

  return (
    <AdminListShell section="fees" preview={listLooksPreviewed(data.fees)}>
      <FeesEditor
        fees={data.fees}
        paymentMethods={data.paymentMethods}
        scholarships={data.scholarships}
        content={data.content}
        programs={data.programs}
      />
    </AdminListShell>
  );
}
