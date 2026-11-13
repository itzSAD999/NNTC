import Link from "next/link";
import { Receipt, ArrowLeft, Clock } from "lucide-react";

import { RequestQueue } from "@/components/dashboard/request-queue";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { isPreviewId } from "@/lib/data/admin-preview";
import { requireStaffRole } from "@/lib/auth/session";
import { getRequestsByStatus } from "@/lib/data/dashboard-requests";
import { Button } from "@/components/ui/button";

export default async function AccountsPendingPage() {
  await requireStaffRole(["accounts"]);
  const pending = await getRequestsByStatus(["academic_approved"]);
  const preview = pending.some((r) => isPreviewId(r.id));

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button asChild variant="ghost" size="sm" className="h-7 px-2 -ml-2 text-caption hover:text-ink">
              <Link href="/dashboard/accounts">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Accounts Overview
              </Link>
            </Button>
            <span className="text-line">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Payment Verification</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
            Payment Verification Queue
          </h1>
          <p className="mt-1 text-sm text-caption">
            Reconcile Paystack digital receipts, mobile money transactions, and bank deposit slips for academic document orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
            <Clock className="h-3.5 w-3.5" />
            {pending.length} pending check{pending.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {preview ? <PreviewBanner /> : null}

      {/* Main Request Queue */}
      <section className="space-y-4">
        <RequestQueue
          requests={pending}
          stage="pending"
          emptyMessage="No payments currently waiting for bursary confirmation."
        />
      </section>
    </div>
  );
}
