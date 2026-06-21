import Image from "next/image";
import Link from "next/link";

import type { RequestDetail } from "@/lib/data/dashboard-requests";
import { ReferenceDisplay } from "@/components/requests/reference-display";
import { StatusPill } from "@/components/ui/status-pill";
import { STATUS_LABELS } from "@/lib/requests/status-labels";
import { StaffTimeline } from "@/components/dashboard/staff-timeline";
import { WorkflowActions } from "@/components/dashboard/workflow-actions";
import type { RequestStatus, Role } from "@/lib/constants";

interface RequestDetailViewProps {
  request: RequestDetail;
  role: Role;
  backHref: string;
  backLabel: string;
}

export function RequestDetailView({
  request,
  role,
  backHref,
  backLabel,
}: RequestDetailViewProps) {
  const docRel = request.document_types as
    | { name: string; fee_amount: number }
    | { name: string; fee_amount: number }[]
    | null;
  const doc = Array.isArray(docRel) ? docRel[0] : docRel;

  const isPdf = request.receipt_url?.toLowerCase().endsWith(".pdf") ?? false;

  return (
    <div className="space-y-8">
      <Link href={backHref} className="text-sm text-primary hover:underline">
        ← {backLabel}
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ReferenceDisplay referenceNo={request.reference_no} size="lg" />
          <p className="mt-2 text-sm text-caption">{doc?.name ?? "Document"}</p>
        </div>
        <StatusPill
          status={request.status as RequestStatus}
          label={STATUS_LABELS[request.status as RequestStatus]}
        />
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded border border-line bg-surface p-5">
          <h2 className="font-serif text-display-sm">Student details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-caption">Name</dt>
              <dd className="font-medium text-ink">{request.student_name}</dd>
            </div>
            <div>
              <dt className="text-caption">Student ID</dt>
              <dd className="ref-mono">{request.student_id}</dd>
            </div>
            <div>
              <dt className="text-caption">Email</dt>
              <dd>{request.student_email}</dd>
            </div>
            {request.student_phone ? (
              <div>
                <dt className="text-caption">Phone</dt>
                <dd>{request.student_phone}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-caption">Programme</dt>
              <dd>{request.program}</dd>
            </div>
            <div>
              <dt className="text-caption">Year completed</dt>
              <dd>{request.year_completed}</dd>
            </div>
            <div>
              <dt className="text-caption">Purpose</dt>
              <dd className="text-caption">{request.purpose}</dd>
            </div>
            <div>
              <dt className="text-caption">Delivery</dt>
              <dd className="capitalize">{request.delivery_method}</dd>
            </div>
            <div>
              <dt className="text-caption">Amount expected</dt>
              <dd className="ref-mono">
                GHS {(doc?.fee_amount ?? request.amount_expected).toFixed(2)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded border border-line bg-surface p-5">
          <h2 className="font-serif text-display-sm">Payment receipt</h2>
          {request.receiptSignedUrl ? (
            <div className="mt-4">
              {isPdf ? (
                <iframe
                  title="Payment receipt"
                  src={request.receiptSignedUrl}
                  className="aspect-[4/3] w-full rounded border border-line"
                />
              ) : (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded border border-line">
                  <Image
                    src={request.receiptSignedUrl}
                    alt="Payment receipt"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
              <a
                href={request.receiptSignedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-primary hover:underline"
              >
                Open full size
              </a>
            </div>
          ) : (
            <p className="mt-4 text-sm text-caption">Receipt unavailable.</p>
          )}
        </section>
      </div>

      <WorkflowActions
        requestId={request.id}
        status={request.status as RequestStatus}
        role={role}
      />

      <section className="rounded border border-line bg-surface p-5 md:p-6">
        <h2 className="font-serif text-display-sm">Full history</h2>
        <div className="mt-6">
          <StaffTimeline items={request.events} />
        </div>
      </section>
    </div>
  );
}
