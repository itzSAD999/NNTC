import { requireStaffRole } from "@/lib/auth/session";
import { getRequestsByStatus } from "@/lib/data/dashboard-requests";
import { RequestQueue } from "@/components/dashboard/request-queue";
import { RequestWorkflowGuide } from "@/components/dashboard/request-workflow-guide";

export default async function AcademicDashboardPage() {
  await requireStaffRole(["academic"]);
  const requests = await getRequestsByStatus(["submitted"]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Academic Office</h1>
        <p className="mt-2 text-caption">
          Review new document requests and forward approved applications to
          Accounts.
        </p>
      </header>

      <RequestWorkflowGuide highlight="academic" />

      <RequestQueue
        requests={requests}
        emptyMessage="No requests awaiting academic review."
      />
    </div>
  );
}
