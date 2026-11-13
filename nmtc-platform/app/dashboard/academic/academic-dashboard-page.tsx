import { FileCheck2, RotateCcw, CheckCircle2 } from "lucide-react";

import { RequestQueue } from "@/components/dashboard/request-queue";
import { RequestWorkflowGuide } from "@/components/dashboard/request-workflow-guide";
import { requireStaffRole } from "@/lib/auth/session";
import { getRequestsByStatus } from "@/lib/data/dashboard-requests";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { isPreviewId } from "@/lib/data/admin-preview";

export default async function AcademicDashboardPage() {
  await requireStaffRole(["academic"]);
  const [pending, returned, done] = await Promise.all([
    getRequestsByStatus(["submitted"]),
    getRequestsByStatus(["returned"]),
    getRequestsByStatus(["academic_approved", "payment_confirmed", "approved", "collected"]),
  ]);
  const preview = pending.some((r) => isPreviewId(r.id));

  const cards = [
    { label: "Pending review", count: pending.length, hint: "Your step", href: "#queue" },
    { label: "Returned", count: returned.length, hint: "Waiting on student", href: "#returned" },
    { label: "Moved on", count: done.length, hint: "Already forwarded", href: "#moved" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-display-md">Academic Office</h1>
          <p className="mt-1 text-sm text-caption">
            Review records, then send them to Accounts. You only act on pending requests.
          </p>
        </div>
        <RequestWorkflowGuide highlight="academic" />
      </header>

      {preview ? <PreviewBanner /> : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <a key={card.label} href={card.href} className="border border-line bg-white p-5 hover:border-primary">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-caption">
              <FileCheck2 className="h-4 w-4 text-primary" />
              {card.label}
            </p>
            <p className="mt-4 font-serif text-3xl font-bold text-ink">{card.count}</p>
            <p className="mt-1 text-xs text-caption">{card.hint}</p>
          </a>
        ))}
      </div>

      <section id="queue" className="space-y-3">
        <h2 className="text-sm font-semibold text-ink">Pending</h2>
        <RequestQueue
          requests={pending}
          stage="pending"
          emptyMessage="No requests awaiting academic review."
        />
      </section>

      <section id="returned" className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <RotateCcw className="h-4 w-4 text-caption" />
          Returned to students
        </h2>
        <RequestQueue
          requests={returned}
          emptyMessage="No returned requests."
        />
      </section>

      <section id="moved" className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <CheckCircle2 className="h-4 w-4 text-caption" />
          Processed
        </h2>
        <RequestQueue
          requests={done}
          stage="processed"
          emptyMessage="Nothing forwarded yet."
        />
      </section>
    </div>
  );
}
