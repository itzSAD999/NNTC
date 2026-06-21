import { requireStaffRole } from "@/lib/auth/session";
import { getRequestsByStatus } from "@/lib/data/dashboard-requests";
import { RequestQueue } from "@/components/dashboard/request-queue";

export default async function AccountsDashboardPage() {
  await requireStaffRole(["accounts"]);
  const requests = await getRequestsByStatus(["academic_approved"]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Accounts Office</h1>
        <p className="mt-2 text-caption">
          Verify payment receipts and forward confirmed requests to the
          Principal.
        </p>
      </header>

      <RequestQueue
        requests={requests}
        emptyMessage="No requests awaiting payment verification."
      />
    </div>
  );
}
