"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  Phone,
  Truck,
  User,
} from "lucide-react";

import type { RequestDetail } from "@/lib/data/dashboard-requests";
import { ReferenceDisplay } from "@/components/requests/reference-display";
import { StatusPill } from "@/components/ui/status-pill";
import { STATUS_LABELS } from "@/lib/requests/status-labels";
import { StaffTimeline } from "@/components/dashboard/staff-timeline";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { WorkflowActions } from "@/components/dashboard/workflow-actions";
import { RequestWorkflowGuide } from "@/components/dashboard/request-workflow-guide";
import { isPreviewId } from "@/lib/data/admin-preview";
import { formatShortDate } from "@/lib/utils/format";
import type { RequestStatus, Role } from "@/lib/constants";

interface RequestDetailViewProps {
  request: RequestDetail;
  role: Role;
  backHref: string;
  backLabel: string;
}

function documentName(request: RequestDetail) {
  const docRel = request.document_types as
    | { name: string; fee_amount: number }
    | { name: string; fee_amount: number }[]
    | null;
  const doc = Array.isArray(docRel) ? docRel[0] : docRel;
  return {
    name: doc?.name ?? "Official document",
    fee: (doc?.fee_amount ?? request.amount_expected).toFixed(2),
  };
}

export function RequestDetailView({
  request,
  role,
  backHref,
  backLabel,
}: RequestDetailViewProps) {
  const [copiedId, setCopiedId] = useState(false);
  const preview = isPreviewId(request.id);
  const [status, setStatus] = useState(request.status as RequestStatus);
  const { name: docName, fee: feeAmount } = documentName(request);
  const isPdf = request.receipt_url?.toLowerCase().endsWith(".pdf") ?? false;
  const pickup =
    request.delivery_method?.toLowerCase() === "collection" ||
    request.delivery_method?.toLowerCase() === "pickup" ||
    request.delivery_method?.toLowerCase() === "in_person";

  const showRecords = role === "academic" || role === "super_admin";
  const showPayment = role === "accounts" || role === "super_admin";
  const showAudit = role === "super_admin";
  const compactPrincipal = role === "principal";
  const deskHelp =
    role === "academic" || role === "accounts" || role === "principal"
      ? role
      : null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-caption hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
        {deskHelp ? <RequestWorkflowGuide highlight={deskHelp} /> : null}
      </div>

      {preview ? <PreviewBanner label="Sample request" /> : null}

      <header className="border border-line bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <ReferenceDisplay referenceNo={request.reference_no} size="lg" />
              <StatusPill status={status} label={STATUS_LABELS[status]} />
            </div>
            <h1 className="font-serif text-2xl font-bold text-ink">{docName}</h1>
            <p className="text-sm text-caption">
              {request.student_name} · {request.student_id}
            </p>
            <p className="flex flex-wrap items-center gap-3 text-xs text-caption">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatShortDate(request.created_at)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                {pickup ? (
                  <>
                    <Building2 className="h-3.5 w-3.5" /> Campus collection
                  </>
                ) : (
                  <>
                    <Truck className="h-3.5 w-3.5" /> {request.delivery_method}
                  </>
                )}
              </span>
            </p>
          </div>
          <p className="border border-line bg-[#f7f7f7] px-3 py-1.5 font-mono text-sm font-semibold">
            GHS {feeAmount}
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-7">
          {compactPrincipal ? (
            <div className="border border-line bg-white p-5 sm:p-6">
              <h2 className="font-serif text-lg">Document to sign</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-caption">
                    Student
                  </dt>
                  <dd className="mt-1 font-medium text-ink">
                    {request.student_name}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-caption">
                    Index
                  </dt>
                  <dd className="mt-1 font-mono text-ink">{request.student_id}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-caption">
                    Programme
                  </dt>
                  <dd className="mt-1 text-ink">{request.program}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-caption">
                    Document
                  </dt>
                  <dd className="mt-1 text-ink">{docName}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-caption">
                Accounts has verified payment. Sign to issue, or send back if
                the record still needs correction.
              </p>
            </div>
          ) : (
            <div className="border border-line bg-white p-5 sm:p-6">
              <div className="flex items-start gap-4 border-b border-line pb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary/10 font-serif font-bold text-primary">
                  {request.student_name
                    .split(" ")
                    .map((n) => n[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || <User className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <h2 className="font-serif text-xl font-bold text-ink">
                    {request.student_name}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono text-ink">{request.student_id}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(request.student_id);
                        setCopiedId(true);
                        setTimeout(() => setCopiedId(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 text-caption hover:text-primary"
                    >
                      <Copy className="h-3 w-3" />
                      {copiedId ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {showRecords || role === "accounts" ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 text-sm">
                  <div className="border border-line p-3">
                    <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-caption">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Programme
                    </p>
                    <p className="mt-1 font-medium text-ink">{request.program}</p>
                  </div>
                  <div className="border border-line p-3">
                    <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-caption">
                      <Calendar className="h-4 w-4 text-primary" />
                      Cohort
                    </p>
                    <p className="mt-1 font-medium text-ink">
                      Year {request.year_completed}
                    </p>
                  </div>
                  {showRecords ? (
                    <>
                      <div className="border border-line p-3">
                        <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-caption">
                          <Mail className="h-4 w-4 text-primary" />
                          Email
                        </p>
                        <a
                          href={`mailto:${request.student_email}`}
                          className="mt-1 block truncate text-primary hover:underline"
                        >
                          {request.student_email}
                        </a>
                      </div>
                      <div className="border border-line p-3">
                        <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-caption">
                          <Phone className="h-4 w-4 text-primary" />
                          Phone
                        </p>
                        {request.student_phone ? (
                          <a
                            href={`tel:${request.student_phone}`}
                            className="mt-1 block text-primary hover:underline"
                          >
                            {request.student_phone}
                          </a>
                        ) : (
                          <span className="mt-1 text-caption">Not provided</span>
                        )}
                      </div>
                    </>
                  ) : null}
                </div>
              ) : null}

              {showRecords ? (
                <div className="mt-5 border-t border-line pt-4">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-caption">
                    <FileText className="h-4 w-4 text-primary" />
                    Purpose
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink">
                    {request.purpose || "Official records request."}
                  </p>
                </div>
              ) : null}
            </div>
          )}

          <WorkflowActions
            requestId={request.id}
            status={status}
            role={role}
            preview={preview}
            onPreviewStatus={setStatus}
          />
        </section>

        <section className="space-y-6 lg:col-span-5">
          {showPayment ? (
            <div className="border border-line bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="font-serif text-lg">Payment / receipt</h3>
                </div>
                <span className="font-mono text-sm font-bold">GHS {feeAmount}</span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-caption">Amount</span>
                  <span>GHS {feeAmount}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-caption">Delivery</span>
                  <span className="capitalize">{request.delivery_method}</span>
                </p>
              </div>
              <div className="mt-4 border-t border-line pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-caption">
                    Proof of payment
                  </span>
                  {request.receiptSignedUrl ? (
                    <a
                      href={request.receiptSignedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Full size <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </div>
                {request.receiptSignedUrl ? (
                  isPdf ? (
                    <iframe
                      title="Payment receipt"
                      src={request.receiptSignedUrl}
                      className="aspect-[4/3] w-full border border-line"
                    />
                  ) : (
                    <div className="relative aspect-[4/3] w-full border border-line bg-[#f7f7f7]">
                      <Image
                        src={request.receiptSignedUrl}
                        alt="Payment receipt"
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    </div>
                  )
                ) : (
                  <p className="border border-dashed border-line p-4 text-sm text-caption">
                    {preview
                      ? "Sample request — no receipt file attached."
                      : "No receipt uploaded. Confirm only if payment is already on the college books."}
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {showAudit ? (
            <div className="border border-line bg-white p-5 sm:p-6">
              <h3 className="font-serif text-lg">Audit history</h3>
              <div className="mt-4">
                <StaffTimeline items={request.events} />
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
