import Link from "next/link";
import { FileCheck2, ArrowLeft, Clock } from "lucide-react";

import { RequestQueue } from "@/components/dashboard/request-queue";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { isPreviewId } from "@/lib/data/admin-preview";
import { requireStaffRole } from "@/lib/auth/session";
import { getRequestsByStatus } from "@/lib/data/dashboard-requests";
import { Button } from "@/components/ui/button";

export default async function AcademicPendingPage() {
  await requireStaffRole(["academic"]);
  const pending = await getRequestsByStatus(["submitted"]);
  const preview = pending.some((r) => isPreviewId(r.id));

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button asChild variant="ghost" size="sm" className="h-7 px-2 -ml-2 text-caption hover:text-ink">
              <Link href="/dashboard/academic">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Academic Overview
              </Link>
            </Button>
            <span className="text-line">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Pending Review</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
            Pending Academic Verification
          </h1>
          <p className="mt-1 text-sm text-caption">
            Review student transcripts, admission cohorts, index numbers, and programmes before endorsing to the Accounts Office.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
            <Clock className="h-3.5 w-3.5" />
            {pending.length} pending review{pending.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {preview ? <PreviewBanner /> : null}

      {/* Main Request Queue */}
      <section className="space-y-4">
        <RequestQueue
          requests={pending}
          stage="pending"
          emptyMessage="No requests currently awaiting academic review."
        />
      </section>
    </div>
  );
}
