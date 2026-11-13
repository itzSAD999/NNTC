import Link from "next/link";
import { Award, ArrowLeft, CheckCircle2 } from "lucide-react";

import { RequestQueue } from "@/components/dashboard/request-queue";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { isPreviewId } from "@/lib/data/admin-preview";
import { requireStaffRole } from "@/lib/auth/session";
import { getRequestsByStatus } from "@/lib/data/dashboard-requests";
import { Button } from "@/components/ui/button";

export default async function AccountsClearedPage() {
  await requireStaffRole(["accounts"]);
  const signed = await getRequestsByStatus(["payment_confirmed", "approved"]);
  const preview = signed.some((r) => isPreviewId(r.id));

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
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">With Principal</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
            Payments Cleared — With Principal
          </h1>
          <p className="mt-1 text-sm text-caption">
            Requests where financial payment has been confirmed by Bursary and forwarded for executive signature or awaiting student pickup.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-line text-xs font-medium text-caption">
            <Award className="h-3.5 w-3.5 text-primary" />
            {signed.length} request{signed.length === 1 ? "" : "s"} cleared
          </span>
        </div>
      </div>

      {preview ? <PreviewBanner /> : null}

      {/* Main Request Queue */}
      <section className="space-y-4">
        <RequestQueue
          requests={signed}
          stage="processed"
          emptyMessage="No cleared requests currently with the Principal."
        />
      </section>
    </div>
  );
}
