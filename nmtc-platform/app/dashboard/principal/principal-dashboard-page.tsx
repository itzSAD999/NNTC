import { Award, CheckCircle2 } from "lucide-react";

import { PreviewBanner } from "@/components/admin/preview-banner";
import { PrincipalSummaryStrip } from "@/components/dashboard/principal-summary-strip";
import { RequestQueue } from "@/components/dashboard/request-queue";
import { RequestWorkflowGuide } from "@/components/dashboard/request-workflow-guide";
import { isPreviewId } from "@/lib/data/admin-preview";
import { requireStaffRole } from "@/lib/auth/session";
import {
  getPrincipalStats,
  getRequestsByStatus,
} from "@/lib/data/dashboard-requests";

export default async function PrincipalDashboardPage() {
  await requireStaffRole(["principal"]);
  const [pending, issued, stats] = await Promise.all([
    getRequestsByStatus(["payment_confirmed"]),
    getRequestsByStatus(["approved", "collected"]),
    getPrincipalStats(),
  ]);
  const preview = pending.some((r) => isPreviewId(r.id));

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-display-md">Principal</h1>
          <p className="mt-1 text-sm text-caption">
            Sign payment-verified documents. You only see requests that Accounts has cleared.
          </p>
        </div>
        <RequestWorkflowGuide highlight="principal" />
      </header>

      {preview ? <PreviewBanner /> : null}

      <PrincipalSummaryStrip stats={stats} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="border border-line bg-white p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-caption">
            <Award className="h-4 w-4 text-primary" />
            Awaiting signature
          </p>
          <p className="mt-4 font-serif text-3xl font-bold text-ink">{pending.length}</p>
        </div>
        <div className="border border-line bg-white p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-caption">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Recently issued
          </p>
          <p className="mt-4 font-serif text-3xl font-bold text-ink">{issued.length}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-ink">Pending</h2>
        <RequestQueue
          requests={pending}
          stage="pending"
          emptyMessage="No requests awaiting principal approval."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-ink">Signed</h2>
        <RequestQueue
          requests={issued}
          stage="signed"
          emptyMessage="No issued documents yet."
        />
      </section>
    </div>
  );
}
