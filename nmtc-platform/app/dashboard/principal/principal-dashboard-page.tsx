import Link from "next/link";
import { Award, CheckCircle2, ArrowRight, ShieldCheck, Inbox, Users, Clock, AlertCircle } from "lucide-react";

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
import { Button } from "@/components/ui/button";

export default async function PrincipalDashboardPage() {
  await requireStaffRole(["principal"]);
  const [pending, issued, stats] = await Promise.all([
    getRequestsByStatus(["payment_confirmed"]),
    getRequestsByStatus(["approved", "collected"]),
    getPrincipalStats(),
  ]);
  const preview = pending.some((r) => isPreviewId(r.id));

  // Top urgent items to show on the executive overview
  const urgentQueue = pending.slice(0, 5);
  const recentSigned = issued.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Executive Header */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest bg-primary text-white">
              Executive Desk
            </span>
            <span className="text-xs text-caption font-medium">Nandom NMTC Management</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink">
            Principal's Office
          </h1>
          <p className="mt-1 text-sm text-caption max-w-xl">
            Executive oversight, institutional clearances, and digital document endorsement for student transcripts and attestations.
          </p>
        </div>
        <RequestWorkflowGuide highlight="principal" />
      </header>

      {preview ? <PreviewBanner /> : null}

      <PrincipalSummaryStrip stats={stats} />

      {/* Primary KPI Action Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Awaiting Signature */}
        <div className="relative flex flex-col justify-between border border-primary/40 bg-white p-5 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Award className="h-4 w-4" />
                Awaiting Signature
              </span>
              {pending.length > 0 ? (
                <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              ) : null}
            </div>
            <p className="mt-3 font-serif text-3xl font-bold text-ink">{pending.length}</p>
            <p className="mt-1 text-xs text-caption">Cleared by Accounts &amp; Academic</p>
          </div>
          <div className="mt-4 pt-3 border-t border-line/60">
            <Button asChild size="sm" className="w-full justify-between rounded-none font-semibold">
              <Link href="/dashboard/principal/pending">
                <span>Open Signature Queue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Card 2: Signed Documents */}
        <div className="relative flex flex-col justify-between border border-line bg-white p-5 shadow-sm">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-caption">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Signed &amp; Issued
            </span>
            <p className="mt-3 font-serif text-3xl font-bold text-ink">{issued.length}</p>
            <p className="mt-1 text-xs text-caption">Officially released to students</p>
          </div>
          <div className="mt-4 pt-3 border-t border-line/60">
            <Button asChild variant="outline" size="sm" className="w-full justify-between rounded-none font-semibold">
              <Link href="/dashboard/principal/issued">
                <span>View Complete Archive</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Card 3: Student Inquiries */}
        <div className="relative flex flex-col justify-between border border-line bg-white p-5 shadow-sm">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-caption">
              <Inbox className="h-4 w-4 text-primary" />
              Inquiries &amp; Messages
            </span>
            <p className="mt-3 font-serif text-3xl font-bold text-ink">Inquiries</p>
            <p className="mt-1 text-xs text-caption">Student queries &amp; admissions inbox</p>
          </div>
          <div className="mt-4 pt-3 border-t border-line/60">
            <Button asChild variant="outline" size="sm" className="w-full justify-between rounded-none font-semibold">
              <Link href="/dashboard/admin/inbox">
                <span>Open Messages</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Card 4: Governance & Audit */}
        <div className="relative flex flex-col justify-between border border-line bg-white p-5 shadow-sm">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-caption">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Security Audit
            </span>
            <p className="mt-3 font-serif text-3xl font-bold text-ink">Audit Logs</p>
            <p className="mt-1 text-xs text-caption">Immutable timestamps &amp; approvals</p>
          </div>
          <div className="mt-4 pt-3 border-t border-line/60">
            <Button asChild variant="outline" size="sm" className="w-full justify-between rounded-none font-semibold">
              <Link href="/dashboard/admin/audit">
                <span>View Audit Trail</span>
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
              Action Required — Pending Signature
            </h2>
            {pending.length > 0 ? (
              <span className="px-2 py-0.5 text-xs font-bold bg-primary text-white">
                {pending.length}
              </span>
            ) : null}
          </div>
          {pending.length > 5 ? (
            <Button asChild variant="ghost" size="sm" className="text-primary font-semibold hover:underline">
              <Link href="/dashboard/principal/pending">
                View all {pending.length} requests in queue &rarr;
              </Link>
            </Button>
          ) : null}
        </div>

        {pending.length > 0 ? (
          <RequestQueue
            requests={urgentQueue}
            stage="pending"
            emptyMessage="No requests awaiting approval."
          />
        ) : (
          <div className="border border-line bg-white p-8 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
            <p className="font-serif text-lg font-medium text-ink">All Clear</p>
            <p className="text-xs text-caption max-w-sm mx-auto">
              There are no document requests currently waiting for your signature.
            </p>
          </div>
        )}
      </section>

      {/* Recent Activity: Recently Signed */}
      {recentSigned.length > 0 ? (
        <section className="space-y-4 pt-4 border-t border-line">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
            <h2 className="text-base font-semibold text-ink">
              Recently Signed &amp; Issued
            </h2>
            <Button asChild variant="ghost" size="sm" className="text-caption hover:text-ink font-semibold">
              <Link href="/dashboard/principal/issued">
                View complete signed archive ({issued.length}) &rarr;
              </Link>
            </Button>
          </div>

          <RequestQueue
            requests={recentSigned}
            stage="signed"
            emptyMessage="No documents have been signed yet."
          />
        </section>
      ) : null}
    </div>
  );
}
