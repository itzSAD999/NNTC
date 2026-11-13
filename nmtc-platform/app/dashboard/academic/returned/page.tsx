import Link from "next/link";
import { RotateCcw, ArrowLeft, AlertCircle } from "lucide-react";

import { RequestQueue } from "@/components/dashboard/request-queue";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { isPreviewId } from "@/lib/data/admin-preview";
import { requireStaffRole } from "@/lib/auth/session";
import { getRequestsByStatus } from "@/lib/data/dashboard-requests";
import { Button } from "@/components/ui/button";

export default async function AcademicReturnedPage() {
  await requireStaffRole(["academic"]);
  const returned = await getRequestsByStatus(["returned"]);
  const preview = returned.some((r) => isPreviewId(r.id));

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
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Returned Requests</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
            Requests Returned to Students
          </h1>
          <p className="mt-1 text-sm text-caption">
            Requests flagged for discrepancies (e.g., mismatch in graduation year, index number, or incomplete records).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
            <AlertCircle className="h-3.5 w-3.5" />
            {returned.length} returned request{returned.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {preview ? <PreviewBanner /> : null}

      {/* Main Request Queue */}
      <section className="space-y-4">
        <RequestQueue
          requests={returned}
          stage="processed"
          emptyMessage="No requests currently flagged or returned to students."
        />
      </section>
    </div>
  );
}
