import { requireStaffRole } from "@/lib/auth/session";
import {
  getPrincipalStats,
  getRequestsByStatus,
} from "@/lib/data/dashboard-requests";
import { PrincipalSummaryStrip } from "@/components/dashboard/principal-summary-strip";
import { RequestQueue } from "@/components/dashboard/request-queue";

export default async function PrincipalDashboardPage() {
  await requireStaffRole(["principal"]);
  const [requests, stats] = await Promise.all([
    getRequestsByStatus(["payment_confirmed"]),
    getPrincipalStats(),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Principal</h1>
        <p className="mt-2 text-caption">
          Final approval for payment-verified document requests.
        </p>
      </header>

      <PrincipalSummaryStrip stats={stats} />

      <RequestQueue
        requests={requests}
        emptyMessage="No requests awaiting principal approval."
      />
    </div>
  );
}
