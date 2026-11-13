import { Receipt, CheckCircle2 } from "lucide-react";

import { PreviewBanner } from "@/components/admin/preview-banner";
import { RequestQueue } from "@/components/dashboard/request-queue";
import { RequestWorkflowGuide } from "@/components/dashboard/request-workflow-guide";
import { isPreviewId } from "@/lib/data/admin-preview";
import { requireStaffRole } from "@/lib/auth/session";
import { getRequestsByStatus } from "@/lib/data/dashboard-requests";

export default async function AccountsDashboardPage() {
  await requireStaffRole(["accounts"]);
  const [pending, signed, done] = await Promise.all([
    getRequestsByStatus(["academic_approved"]),
    getRequestsByStatus(["payment_confirmed", "approved"]),
    getRequestsByStatus(["collected"]),
  ]);
  const preview = pending.some((r) => isPreviewId(r.id));

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-display-md">Accounts Office</h1>
          <p className="mt-1 text-sm text-caption">
            Confirm payments, then send them to the Principal. You only act on payment checks.
          </p>
        </div>
        <RequestWorkflowGuide highlight="accounts" />
      </header>

      {preview ? <PreviewBanner /> : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="border border-line bg-white p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-caption">
            <Receipt className="h-4 w-4 text-primary" />
            Payment check
          </p>
          <p className="mt-4 font-serif text-3xl font-bold text-ink">{pending.length}</p>
          <p className="mt-1 text-xs text-caption">Your step</p>
        </div>
        <div className="border border-line bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-caption">With Principal</p>
          <p className="mt-4 font-serif text-3xl font-bold text-ink">{signed.length}</p>
        </div>
        <div className="border border-line bg-white p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-caption">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Collected
          </p>
          <p className="mt-4 font-serif text-3xl font-bold text-ink">{done.length}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-ink">Pending</h2>
        <RequestQueue
          requests={pending}
          stage="pending"
          emptyMessage="No requests awaiting payment verification."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-ink">Signed</h2>
        <RequestQueue
          requests={signed}
          stage="signed"
          emptyMessage="No payment-confirmed requests yet."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-ink">Processed</h2>
        <RequestQueue
          requests={done}
          stage="processed"
          emptyMessage="No collected requests yet."
        />
      </section>
    </div>
  );
}
