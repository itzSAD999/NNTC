import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Inbox,
  Newspaper,
  QrCode,
  Receipt,
  Users,
} from "lucide-react";

import { PreviewBanner } from "@/components/admin/preview-banner";
import { ReferenceDisplay } from "@/components/requests/reference-display";
import { StatusPill } from "@/components/ui/status-pill";
import type { RequestStatus } from "@/lib/constants";
import { getAdminOverviewMetrics } from "@/lib/data/admin-overview";
import { STATUS_LABELS } from "@/lib/requests/status-labels";

export default async function AdminOverviewPage() {
  const metrics = await getAdminOverviewMetrics();
  const { requests, content, recentRequests, isPreview } = metrics;

  const queues = [
    {
      href: "/dashboard/academic",
      icon: FileCheck2,
      label: "Academic",
      count: requests.submitted,
      hint: "Need review",
    },
    {
      href: "/dashboard/accounts",
      icon: Receipt,
      label: "Accounts",
      count: requests.academicApproved,
      hint: "Payment check",
    },
    {
      href: "/dashboard/principal",
      icon: Award,
      label: "Principal",
      count: requests.paymentConfirmed,
      hint: "Ready to sign",
    },
    {
      href: "/dashboard/academic",
      icon: CheckCircle2,
      label: "Issued",
      count: requests.approved,
      hint: "Completed",
    },
  ];

  const contentLinks = [
    { href: "/dashboard/admin/programs", icon: GraduationCap, label: "Programmes", count: content.programsCount },
    { href: "/dashboard/admin/news", icon: Newspaper, label: "News", count: content.postsCount },
    { href: "/dashboard/admin/events", icon: CalendarDays, label: "Events", count: content.eventsCount },
    { href: "/dashboard/admin/inbox", icon: Inbox, label: "Inbox", count: content.messagesCount },
    { href: "/dashboard/admin/staff", icon: Users, label: "Faculty", count: content.staffCount },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-display-md text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-caption">
            {requests.total} document requests · {content.messagesCount} inbox items
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-primary hover:text-primary"
          >
            <ExternalLink className="h-4 w-4" />
            Public site
          </Link>
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-deep"
          >
            <QrCode className="h-4 w-4" />
            Verify
          </Link>
        </div>
      </div>

      {isPreview ? <PreviewBanner /> : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {queues.map((q) => {
          const Icon = q.icon;
          return (
            <Link
              key={q.label}
              href={q.href}
              className="group border border-line bg-white p-5 transition hover:border-primary"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-primary" />
                {q.count > 0 && q.label !== "Issued" ? (
                  <span className="bg-accent/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-accent">
                    Action
                  </span>
                ) : null}
              </div>
              <p className="mt-6 font-serif text-3xl font-bold text-ink">{q.count}</p>
              <p className="mt-1 text-sm font-medium text-ink">{q.label}</p>
              <p className="text-xs text-caption">{q.hint}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Open
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Recent requests</h2>
            <Link href="/dashboard/academic" className="text-xs font-medium text-primary hover:underline">
              Queue
            </Link>
          </div>
          <div className="overflow-hidden border border-line bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-[#f7f7f7] text-[0.7rem] uppercase tracking-wider text-caption">
                    <th className="px-4 py-3 font-semibold">Reference</th>
                    <th className="px-4 py-3 font-semibold">Student</th>
                    <th className="px-4 py-3 font-semibold">Document</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right"> </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-[#fafafa]">
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
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink">Content</h2>
          <div className="border border-line bg-white divide-y divide-line">
            {contentLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-[#fafafa]"
                >
                  <span className="flex items-center gap-2.5 font-medium text-ink">
                    <Icon className="h-4 w-4 text-caption" />
                    {item.label}
                  </span>
                  <span className="text-xs font-semibold text-caption">{item.count}</span>
                </Link>
              );
            })}
          </div>
          <div className="mt-4 space-y-2">
            <Link
              href="/dashboard/admin/users"
              className="flex items-center justify-between border border-line bg-white px-4 py-3 text-xs font-medium text-ink hover:border-primary"
            >
              Staff accounts
              <ArrowRight className="h-3.5 w-3.5 text-caption" />
            </Link>
            <Link
              href="/dashboard/admin/settings"
              className="flex items-center justify-between border border-line bg-white px-4 py-3 text-xs font-medium text-ink hover:border-primary"
            >
              College settings
              <ArrowRight className="h-3.5 w-3.5 text-caption" />
            </Link>
            <Link
              href="/dashboard/admin/audit"
              className="flex items-center justify-between border border-line bg-white px-4 py-3 text-xs font-medium text-ink hover:border-primary"
            >
              Audit log
              <ArrowRight className="h-3.5 w-3.5 text-caption" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
