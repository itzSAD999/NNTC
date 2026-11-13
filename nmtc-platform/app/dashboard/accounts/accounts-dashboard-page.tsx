import Link from "next/link";
import { Receipt, CheckCircle2, ArrowRight, Award, BadgePercent, Clock } from "lucide-react";

import { PreviewBanner } from "@/components/admin/preview-banner";
import { RequestQueue } from "@/components/dashboard/request-queue";
import { RequestWorkflowGuide } from "@/components/dashboard/request-workflow-guide";
import { isPreviewId } from "@/lib/data/admin-preview";
import { requireStaffRole } from "@/lib/auth/session";
import { getRequestsByStatus } from "@/lib/data/dashboard-requests";
import { Button } from "@/components/ui/button";

export default async function AccountsDashboardPage() {
  await requireStaffRole(["accounts"]);
  const [pending, signed, done] = await Promise.all([
    getRequestsByStatus(["academic_approved"]),
    getRequestsByStatus(["payment_confirmed", "approved"]),
    getRequestsByStatus(["collected"]),
  ]);
  const preview = pending.some((r) => isPreviewId(r.id));

  const urgentQueue = pending.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest bg-primary text-white">
              Bursary Desk
            </span>
            <span className="text-xs text-caption font-medium">Finance &amp; Accounts Division</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink">
            Accounts Office
          </h1>
          <p className="mt-1 text-sm text-caption max-w-xl">
            Confirm student document payments, audit digital transaction references, and manage institutional fee schedules.
          </p>
        </div>
        <RequestWorkflowGuide highlight="accounts" />
      </header>

      {preview ? <PreviewBanner /> : null}

      {/* KPI Action Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Payment Check */}
        <div className="relative flex flex-col justify-between border border-primary/40 bg-white p-5 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Receipt className="h-4 w-4" />
                Payment Checks
              </span>
              {pending.length > 0 ? (
                <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              ) : null}
            </div>
            <p className="mt-3 font-serif text-3xl font-bold text-ink">{pending.length}</p>
            <p className="mt-1 text-xs text-caption">Awaiting verification</p>
          </div>
          <div className="mt-4 pt-3 border-t border-line/60">
            <Button asChild size="sm" className="w-full justify-between rounded-none font-semibold">
              <Link href="/dashboard/accounts/pending">
                <span>Open Payment Queue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Card 2: With Principal */}
        <div className="relative flex flex-col justify-between border border-line bg-white p-5 shadow-sm">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-caption">
              <Award className="h-4 w-4 text-primary" />
              With Principal
            </span>
            <p className="mt-3 font-serif text-3xl font-bold text-ink">{signed.length}</p>
            <p className="mt-1 text-xs text-caption">Payment cleared by Bursary</p>
          </div>
          <div className="mt-4 pt-3 border-t border-line/60">
            <Button asChild variant="outline" size="sm" className="w-full justify-between rounded-none font-semibold">
              <Link href="/dashboard/accounts/cleared">
                <span>View Forwarded</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Card 3: Collected / Reconciled */}
        <div className="relative flex flex-col justify-between border border-line bg-white p-5 shadow-sm">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-caption">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Collected Archive
            </span>
            <p className="mt-3 font-serif text-3xl font-bold text-ink">{done.length}</p>
            <p className="mt-1 text-xs text-caption">Settled and dispatched</p>
          </div>
          <div className="mt-4 pt-3 border-t border-line/60">
            <Button asChild variant="outline" size="sm" className="w-full justify-between rounded-none font-semibold">
              <Link href="/dashboard/accounts/collected">
                <span>View Archive</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Card 4: Fee Schedules */}
        <div className="relative flex flex-col justify-between border border-line bg-white p-5 shadow-sm">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-caption">
              <BadgePercent className="h-4 w-4 text-primary" />
              Fee Schedules &amp; Aid
            </span>
            <p className="mt-3 font-serif text-3xl font-bold text-ink">Bursary</p>
            <p className="mt-1 text-xs text-caption">Tuition &amp; breakdown rates</p>
          </div>
          <div className="mt-4 pt-3 border-t border-line/60">
            <Button asChild variant="outline" size="sm" className="w-full justify-between rounded-none font-semibold">
              <Link href="/dashboard/admin/fees">
                <span>Manage Fee Rates</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Priority Action Required: Top Urgent Requests */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-ink">
              Action Required — Payment Verification Queue
            </h2>
            {pending.length > 0 ? (
              <span className="px-2 py-0.5 text-xs font-bold bg-primary text-white">
                {pending.length}
              </span>
            ) : null}
          </div>
          {pending.length > 5 ? (
            <Button asChild variant="ghost" size="sm" className="text-primary font-semibold hover:underline">
              <Link href="/dashboard/accounts/pending">
                View all {pending.length} requests in queue &rarr;
              </Link>
            </Button>
          ) : null}
        </div>

        {pending.length > 0 ? (
          <RequestQueue
            requests={urgentQueue}
            stage="pending"
            emptyMessage="No requests awaiting payment verification."
          />
        ) : (
          <div className="border border-line bg-white p-8 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
            <p className="font-serif text-lg font-medium text-ink">Queue is Empty</p>
            <p className="text-xs text-caption max-w-sm mx-auto">
              All academic-cleared requests have had their payments verified.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
