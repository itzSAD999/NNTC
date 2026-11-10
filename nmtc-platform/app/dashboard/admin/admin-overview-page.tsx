import Link from "next/link";
import {
  FileCheck2,
  Receipt,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  GraduationCap,
  Newspaper,
  CalendarDays,
  Inbox,
  Users,
  QrCode,
  AlertCircle,
  FileText,
} from "lucide-react";

import { getAdminOverviewMetrics } from "@/lib/data/admin-overview";
import { formatShortDate } from "@/lib/utils/format";
import { StatusPill } from "@/components/ui/status-pill";
import { STATUS_LABELS } from "@/lib/requests/status-labels";
import type { RequestStatus } from "@/lib/constants";
import { ReferenceDisplay } from "@/components/requests/reference-display";

export default async function AdminOverviewPage() {
  const metrics = await getAdminOverviewMetrics();
  const { requests, content, recentRequests } = metrics;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-line bg-gradient-to-br from-surface via-surface to-bg p-6 sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                MiStarStudio Nursing EMS
              </span>
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                Command Center
              </span>
            </div>
            <h1 className="mt-3 font-serif text-display-lg text-ink">
              Institutional Executive Desk
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-caption">
              Flagship campus operations, document processing pipeline, academic governance, and public portal management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg hover:text-primary shadow-sm"
            >
              <ExternalLink className="h-4 w-4" />
              View Public Site
            </Link>
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-95 shadow-sm"
            >
              <QrCode className="h-4 w-4" />
              QR Verifier
            </Link>
          </div>
        </div>
      </div>

      {/* Document Pipeline Metrics */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">
              Document Processing Pipeline
            </h2>
            <p className="text-xs text-caption">
              Three-tier verification workflow for transcripts, attestations and certificates
            </p>
          </div>
          <span className="text-xs font-medium text-caption">
            Total Requests Tracked: <strong className="text-ink">{requests.total}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Academic Office Queue */}
          <Link
            href="/dashboard/academic"
            className="group relative flex flex-col justify-between rounded-xl border border-line bg-surface p-5 transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileCheck2 className="h-5 w-5" />
                </span>
                {requests.submitted > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                    Action Needed
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                    Clear
                  </span>
                )}
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-caption">
                Stage 1 · Academic Desk
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-ink">
                  {requests.submitted}
                </span>
                <span className="text-xs text-caption">pending review</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
              <span>Open Academic Queue</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* 2. Accounts / Bursary Queue */}
          <Link
            href="/dashboard/accounts"
            className="group relative flex flex-col justify-between rounded-xl border border-line bg-surface p-5 transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Receipt className="h-5 w-5" />
                </span>
                {requests.academicApproved > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                    Awaiting Verification
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                    Clear
                  </span>
                )}
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-caption">
                Stage 2 · Bursary & Finance
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-ink">
                  {requests.academicApproved}
                </span>
                <span className="text-xs text-caption">pending payment check</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
              <span>Open Accounts Queue</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* 3. Principal Desk */}
          <Link
            href="/dashboard/principal"
            className="group relative flex flex-col justify-between rounded-xl border border-line bg-surface p-5 transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                  <Award className="h-5 w-5" />
                </span>
                {requests.paymentConfirmed > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                    Ready to Sign
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                    Clear
                  </span>
                )}
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-caption">
                Stage 3 · Principal Desk
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-ink">
                  {requests.paymentConfirmed}
                </span>
                <span className="text-xs text-caption">awaiting signature</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
              <span>Open Principal Desk</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* 4. Issued & Completed */}
          <div className="relative flex flex-col justify-between rounded-xl border border-line bg-surface p-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                  Verified
                </span>
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-caption">
                Completed & Issued
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-ink">
                  {requests.approved}
                </span>
                <span className="text-xs text-caption">documents issued</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-caption">
              Includes transcripts, attestations & proficiency letters
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Activity & Quick Workspaces */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Recent Requests Table (2 cols) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink">
                Recent Document Requests
              </h2>
              <p className="text-xs text-caption">
                Latest student requests submitted via the portal
              </p>
            </div>
            <Link
              href="/dashboard/academic"
              className="text-xs font-medium text-primary hover:underline"
            >
              View Full Queue →
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
            {recentRequests.length === 0 ? (
              <div className="p-8 text-center text-sm text-caption">
                No document requests found in the database.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line bg-bg/50 text-[0.7rem] uppercase tracking-wider text-caption">
                      <th className="px-4 py-3 font-semibold">Reference</th>
                      <th className="px-4 py-3 font-semibold">Student</th>
                      <th className="px-4 py-3 font-semibold">Document</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {recentRequests.map((req) => (
                      <tr
                        key={req.id}
                        className="transition-colors hover:bg-bg/40"
                      >
                        <td className="px-4 py-3">
                          <ReferenceDisplay referenceNo={req.reference_no} size="md" />
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-ink">{req.student_name}</p>
                          <p className="text-xs text-caption">{req.student_id}</p>
                        </td>
                        <td className="px-4 py-3 text-caption">{req.docName}</td>
                        <td className="px-4 py-3">
                          <StatusPill
                            status={req.status as RequestStatus}
                            label={STATUS_LABELS[req.status as RequestStatus]}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/dashboard/requests/${req.id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          >
                            <span>Open</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Platform Gateways & Security Status */}
          <div className="rounded-xl border border-line bg-surface p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-caption">
              Infrastructure & Gateway Status
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 rounded-lg border border-line/60 bg-bg/60 p-3">
                <Smartphone className="h-5 w-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink truncate">Paystack MoMo</p>
                  <p className="text-[0.7rem] text-emerald-600 font-medium">MTN / Telecel / AT Ready</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-line/60 bg-bg/60 p-3">
                <FileText className="h-5 w-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink truncate">Arkesel Ghana SMS</p>
                  <p className="text-[0.7rem] text-emerald-600 font-medium">Gateway Active</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-line/60 bg-bg/60 p-3">
                <QrCode className="h-5 w-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink truncate">QR Public Verifier</p>
                  <p className="text-[0.7rem] text-emerald-600 font-medium">Anti-Fraud Online</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-line/60 bg-bg/60 p-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink truncate">Supabase SSR RLS</p>
                  <p className="text-[0.7rem] text-emerald-600 font-medium">Role Policies Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Portal Content & Academic Overview (1 col) */}
        <div className="space-y-6">
          {/* Institutional Content Metrics */}
          <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-ink">
              Portal Content & Records
            </h3>
            <p className="mt-0.5 text-xs text-caption">
              Published information managed across the platform
            </p>

            <div className="mt-4 divide-y divide-line">
              <Link
                href="/dashboard/admin/programs"
                className="flex items-center justify-between py-3 transition-colors hover:text-primary"
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="h-4 w-4 text-caption" />
                  <span className="text-sm font-medium">Academic Programmes</span>
                </div>
                <span className="rounded bg-bg px-2 py-0.5 text-xs font-semibold text-ink">
                  {content.programsCount}
                </span>
              </Link>

              <Link
                href="/dashboard/admin/news"
                className="flex items-center justify-between py-3 transition-colors hover:text-primary"
              >
                <div className="flex items-center gap-2.5">
                  <Newspaper className="h-4 w-4 text-caption" />
                  <span className="text-sm font-medium">News & Bulletins</span>
                </div>
                <span className="rounded bg-bg px-2 py-0.5 text-xs font-semibold text-ink">
                  {content.postsCount}
                </span>
              </Link>

              <Link
                href="/dashboard/admin/events"
                className="flex items-center justify-between py-3 transition-colors hover:text-primary"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="h-4 w-4 text-caption" />
                  <span className="text-sm font-medium">Calendar Events</span>
                </div>
                <span className="rounded bg-bg px-2 py-0.5 text-xs font-semibold text-ink">
                  {content.eventsCount}
                </span>
              </Link>

              <Link
                href="/dashboard/admin/inbox"
                className="flex items-center justify-between py-3 transition-colors hover:text-primary"
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="h-4 w-4 text-caption" />
                  <span className="text-sm font-medium">Contact Inquiries</span>
                </div>
                <span className="rounded bg-bg px-2 py-0.5 text-xs font-semibold text-ink">
                  {content.messagesCount}
                </span>
              </Link>

              <Link
                href="/dashboard/admin/staff"
                className="flex items-center justify-between py-3 transition-colors hover:text-primary"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-caption" />
                  <span className="text-sm font-medium">Faculty Profiles</span>
                </div>
                <span className="rounded bg-bg px-2 py-0.5 text-xs font-semibold text-ink">
                  {content.staffCount}
                </span>
              </Link>
            </div>
          </div>

          {/* Quick Administration Actions */}
          <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-ink">
              System Administration
            </h3>
            <p className="mt-0.5 text-xs text-caption">
              Configuration, governance & access controls
            </p>

            <div className="mt-4 space-y-2">
              <Link
                href="/dashboard/admin/users"
                className="flex items-center justify-between rounded-lg border border-line p-3 text-xs font-medium text-ink transition-colors hover:border-primary hover:bg-bg"
              >
                <span>Manage Staff Accounts & Roles</span>
                <ArrowRight className="h-3.5 w-3.5 text-caption" />
              </Link>
              <Link
                href="/dashboard/admin/settings"
                className="flex items-center justify-between rounded-lg border border-line p-3 text-xs font-medium text-ink transition-colors hover:border-primary hover:bg-bg"
              >
                <span>Institution Identity & Contacts</span>
                <ArrowRight className="h-3.5 w-3.5 text-caption" />
              </Link>
              <Link
                href="/dashboard/admin/audit"
                className="flex items-center justify-between rounded-lg border border-line p-3 text-xs font-medium text-ink transition-colors hover:border-primary hover:bg-bg"
              >
                <span>Review Audit & Security Trail</span>
                <ArrowRight className="h-3.5 w-3.5 text-caption" />
              </Link>
              <Link
                href="/dashboard/admin/fees"
                className="flex items-center justify-between rounded-lg border border-line p-3 text-xs font-medium text-ink transition-colors hover:border-primary hover:bg-bg"
              >
                <span>Fee Schedules & Bank Details</span>
                <ArrowRight className="h-3.5 w-3.5 text-caption" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
