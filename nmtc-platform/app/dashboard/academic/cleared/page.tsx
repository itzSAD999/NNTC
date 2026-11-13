import Link from "next/link";
import { CheckCircle2, ArrowLeft, Archive } from "lucide-react";

import { RequestQueue } from "@/components/dashboard/request-queue";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { isPreviewId } from "@/lib/data/admin-preview";
import { requireStaffRole } from "@/lib/auth/session";
import { getRequestsByStatus } from "@/lib/data/dashboard-requests";
import { Button } from "@/components/ui/button";

export default async function AcademicClearedPage() {
  await requireStaffRole(["academic"]);
  const done = await getRequestsByStatus(["academic_approved", "payment_confirmed", "approved", "collected"]);
  const preview = done.some((r) => isPreviewId(r.id));

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
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Cleared Archive</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
            Academically Cleared &amp; Forwarded
          </h1>
          <p className="mt-1 text-sm text-caption">
            Archive of student requests successfully verified by Academic Affairs and forwarded downstream to Accounts and the Principal.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-line text-xs font-medium text-caption">
            <Archive className="h-3.5 w-3.5 text-primary" />
            {done.length} cleared request{done.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {preview ? <PreviewBanner /> : null}

      {/* Main Request Queue */}
      <section className="space-y-4">
        <RequestQueue
          requests={done}
          stage="processed"
          emptyMessage="No requests have been cleared yet."
        />
      </section>
    </div>
  );
}
