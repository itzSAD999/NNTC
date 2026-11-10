"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  Phone,
  ShieldCheck,
  Truck,
  User,
  AlertCircle,
  FileCheck,
} from "lucide-react";

import type { RequestDetail } from "@/lib/data/dashboard-requests";
import { ReferenceDisplay } from "@/components/requests/reference-display";
import { StatusPill } from "@/components/ui/status-pill";
import { STATUS_LABELS } from "@/lib/requests/status-labels";
import { StaffTimeline } from "@/components/dashboard/staff-timeline";
import { WorkflowActions } from "@/components/dashboard/workflow-actions";
import { formatShortDate } from "@/lib/utils/format";
import type { RequestStatus, Role } from "@/lib/constants";

interface RequestDetailViewProps {
  request: RequestDetail;
  role: Role;
  backHref: string;
  backLabel: string;
}

// Stage progress milestones
const WORKFLOW_STAGES = [
  { key: "submitted", label: "Submitted & Paid" },
  { key: "academic", label: "Academic Audit" },
  { key: "accounts", label: "Accounts Clearance" },
  { key: "principal", label: "Principal Sign" },
  { key: "issued", label: "Ready / Issued" },
];

function getStageState(stageKey: string, status: RequestStatus) {
  const order: Record<RequestStatus, number> = {
    submitted: 1,         // At Academic Desk
    academic_approved: 2, // At Accounts Desk
    payment_confirmed: 3, // At Principal Desk
    approved: 4,          // Endorsed by Principal, ready for collection
    collected: 5,         // Handed over / complete
    returned: 0,          // Returned to student for correction
  };

  const currentLevel = order[status] ?? 0;

  switch (stageKey) {
    case "submitted":
      return currentLevel >= 1 ? "completed" : "active";
    case "academic":
      if (currentLevel > 1) return "completed";
      if (currentLevel === 1) return "active";
      if (status === "returned") return "alert";
      return "upcoming";
    case "accounts":
      if (currentLevel > 2) return "completed";
      if (currentLevel === 2) return "active";
      return "upcoming";
    case "principal":
      if (currentLevel > 3) return "completed";
      if (currentLevel === 3) return "active";
      return "upcoming";
    case "issued":
      if (currentLevel === 5) return "completed";
      if (currentLevel === 4) return "active";
      return "upcoming";
    default:
      return "upcoming";
  }
}

export function RequestDetailView({
  request,
  role,
  backHref,
  backLabel,
}: RequestDetailViewProps) {
  const [copiedId, setCopiedId] = useState(false);

  const docRel = request.document_types as
    | { name: string; fee_amount: number }
    | { name: string; fee_amount: number }[]
    | null;
  const doc = Array.isArray(docRel) ? docRel[0] : docRel;

  const isPdf = request.receipt_url?.toLowerCase().endsWith(".pdf") ?? false;
  const feeAmount = (doc?.fee_amount ?? request.amount_expected).toFixed(2);

  const copyStudentId = () => {
    navigator.clipboard.writeText(request.student_id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Get student initials for avatar
  const initials = request.student_name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isDeliveryPickup =
    request.delivery_method?.toLowerCase() === "pickup" ||
    request.delivery_method?.toLowerCase() === "in_person";

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-caption hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{backLabel}</span>
        </Link>
      </div>

      {/* HEADER CARD */}
      <header className="rounded-xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <ReferenceDisplay referenceNo={request.reference_no} size="lg" />
              <StatusPill
                status={request.status as RequestStatus}
                label={STATUS_LABELS[request.status as RequestStatus]}
              />
            </div>
            <h1 className="font-serif text-2xl font-bold text-ink">
              {doc?.name ?? "Official Document Request"}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-caption">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Submitted on {formatShortDate(request.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                {isDeliveryPickup ? (
                  <>
                    <Building2 className="h-3.5 w-3.5" /> Campus Pickup (Nandom Registry)
                  </>
                ) : (
                  <>
                    <Truck className="h-3.5 w-3.5" /> Dispatch / Courier Delivery
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-line bg-bg px-3 py-1.5 font-mono text-sm font-semibold text-ink">
              GHS {feeAmount}
            </span>
          </div>
        </div>

        {/* WORKFLOW PIPELINE STEPPER */}
        <div className="mt-8 border-t border-line pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-caption mb-3">
            Processing Pipeline & Audit Milestones
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {WORKFLOW_STAGES.map((stage, idx) => {
              const state = getStageState(stage.key, request.status as RequestStatus);
              return (
                <div
                  key={stage.key}
                  className={`relative flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors ${
                    state === "completed"
                      ? "border-primary/30 bg-primary/5 text-primary"
                      : state === "active"
                      ? "border-primary bg-primary text-white shadow-xs font-medium"
                      : state === "alert"
                      ? "border-danger/30 bg-danger/5 text-danger"
                      : "border-line bg-bg/50 text-caption opacity-70"
                  }`}
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                    {state === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : state === "active" ? (
                      <span className="text-[11px] font-bold">{idx + 1}</span>
                    ) : state === "alert" ? (
                      <AlertCircle className="h-4 w-4 text-danger" />
                    ) : (
                      <span className="text-[11px]">{idx + 1}</span>
                    )}
                  </div>
                  <span className="truncate text-xs font-medium">
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* TWO-COLUMN CLINICAL DOSSIER & VERIFICATION DESK */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* COLUMN 1: STUDENT ACADEMIC DOSSIER (7 COLS) */}
        <section className="space-y-6 lg:col-span-7">
          <div className="rounded-xl border border-line bg-surface p-6 shadow-sm">
            {/* Student Header */}
            <div className="flex items-start gap-4 border-b border-line pb-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-serif text-lg font-bold">
                {initials || <User className="h-6 w-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-xl font-bold text-ink">
                    {request.student_name}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <ShieldCheck className="h-3 w-3" /> Enrolled / Alumni
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-xs text-caption">Student / Index ID:</span>
                  <span className="rounded bg-bg px-2 py-0.5 font-mono text-xs font-bold text-ink border border-line">
                    {request.student_id}
                  </span>
                  <button
                    type="button"
                    onClick={copyStudentId}
                    className="inline-flex items-center gap-1 text-xs text-caption hover:text-primary"
                    title="Copy student index number"
                  >
                    <Copy className="h-3 w-3" />
                    {copiedId ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            {/* Academic Information Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
              <div className="space-y-1 rounded-lg border border-line bg-bg/40 p-3.5">
                <div className="flex items-center gap-2 text-caption">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium uppercase tracking-wider">Programme</span>
                </div>
                <p className="font-semibold text-ink">{request.program}</p>
              </div>

              <div className="space-y-1 rounded-lg border border-line bg-bg/40 p-3.5">
                <div className="flex items-center gap-2 text-caption">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium uppercase tracking-wider">Class / Cohort</span>
                </div>
                <p className="font-semibold text-ink">Year {request.year_completed}</p>
              </div>

              <div className="space-y-1 rounded-lg border border-line bg-bg/40 p-3.5">
                <div className="flex items-center gap-2 text-caption">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium uppercase tracking-wider">Email Address</span>
                </div>
                <a
                  href={`mailto:${request.student_email}`}
                  className="block font-medium text-primary hover:underline truncate"
                >
                  {request.student_email}
                </a>
              </div>

              <div className="space-y-1 rounded-lg border border-line bg-bg/40 p-3.5">
                <div className="flex items-center gap-2 text-caption">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium uppercase tracking-wider">Phone Number</span>
                </div>
                {request.student_phone ? (
                  <a
                    href={`tel:${request.student_phone}`}
                    className="block font-medium text-primary hover:underline"
                  >
                    {request.student_phone}
                  </a>
                ) : (
                  <span className="text-caption italic">Not provided</span>
                )}
              </div>
            </div>

            {/* Statement of Purpose */}
            <div className="mt-6 space-y-2 border-t border-line pt-5">
              <div className="flex items-center gap-2 text-caption">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Declared Purpose / Endorsement Objective
                </span>
              </div>
              <div className="rounded-lg border border-line/80 bg-bg p-4 text-sm text-ink leading-relaxed italic">
                &ldquo;{request.purpose || "Official records requirement for professional accreditation."}&rdquo;
              </div>
            </div>
          </div>

          {/* WORKFLOW ACTION DESK */}
          <div className="space-y-4">
            <WorkflowActions
              requestId={request.id}
              status={request.status as RequestStatus}
              role={role}
            />
          </div>
        </section>

        {/* COLUMN 2: DOCUMENT & PAYMENT AUDIT DESK (5 COLS) */}
        <section className="space-y-6 lg:col-span-5">
          {/* Payment Verification Card */}
          <div className="rounded-xl border border-line bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-serif text-lg font-bold text-ink">
                  Payment Verification
                </h3>
              </div>
              <span className="font-mono text-sm font-bold text-primary">
                GHS {feeAmount}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-caption">Statutory Fee:</span>
                <span className="font-mono font-medium text-ink">GHS {feeAmount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-caption">Collection Channel:</span>
                <span className="font-medium text-ink">Paystack MoMo / Cash Receipt</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-caption">Delivery Mode:</span>
                <span className="font-medium capitalize text-ink">{request.delivery_method}</span>
              </div>
            </div>

            {/* Receipt Preview */}
            <div className="mt-6 border-t border-line pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-caption">
                  Submitted Proof of Payment
                </span>
                {request.receiptSignedUrl ? (
                  <a
                    href={request.receiptSignedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <span>Full size</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null}
              </div>

              {request.receiptSignedUrl ? (
                <div className="space-y-2">
                  {isPdf ? (
                    <iframe
                      title="Payment receipt"
                      src={request.receiptSignedUrl}
                      className="aspect-[4/3] w-full rounded-lg border border-line bg-bg"
                    />
                  ) : (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-line bg-bg/50">
                      <Image
                        src={request.receiptSignedUrl}
                        alt="Payment receipt"
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    </div>
                  )}
                  <p className="text-[11px] text-caption flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Security link expires in 60s. Refresh to re-authenticate.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-line bg-bg/50 p-6 text-center">
                  <CreditCard className="mx-auto h-8 w-8 text-caption/60" />
                  <p className="mt-2 text-xs font-medium text-ink">
                    No physical receipt uploaded
                  </p>
                  <p className="mt-1 text-[11px] text-caption">
                    Direct automated MoMo settlement or fee exemption.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AUDIT TIMELINE CARD */}
          <div className="rounded-xl border border-line bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-line pb-4">
              <FileCheck className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-lg font-bold text-ink">
                Audit Trail & History
              </h3>
            </div>
            <div className="mt-5">
              <StaffTimeline items={request.events} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
