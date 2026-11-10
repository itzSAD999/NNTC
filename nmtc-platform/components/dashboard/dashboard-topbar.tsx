"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { QrCode, Search, ExternalLink, Shield } from "lucide-react";
import type { Role } from "@/lib/constants";

interface DashboardTopBarProps {
  role: Role;
  roleLabel: string;
}

export function DashboardTopBar({ role, roleLabel }: DashboardTopBarProps) {
  const pathname = usePathname();

  // Generate breadcrumb from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbLabels: Record<string, string> = {
    dashboard: "Dashboard",
    admin: "Command Center",
    academic: "Academic Office",
    accounts: "Accounts Office",
    principal: "Principal Desk",
    news: "News & Bulletins",
    events: "Events & Calendar",
    programs: "Programmes",
    departments: "Departments",
    admissions: "Admissions",
    fees: "Fee Schedules",
    staff: "Faculty & Staff",
    "campus-life": "Campus Life",
    gallery: "Media Gallery",
    resources: "Student Resources",
    about: "About NMTC",
    inbox: "Inquiries & Inbox",
    settings: "Settings",
    users: "Staff Accounts",
    audit: "Security & Audit",
    requests: "Document Review",
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur-md sm:px-6 lg:px-10">
      {/* Breadcrumb path */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
        <Link
          href={role === "super_admin" ? "/dashboard/admin" : "/dashboard"}
          className="font-medium text-caption hover:text-primary transition-colors flex items-center gap-1"
        >
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span>NMTC Portal</span>
        </Link>
        {segments.slice(1).map((segment, index) => {
          const isLast = index === segments.length - 2;
          const label = breadcrumbLabels[segment] || segment;
          return (
            <span key={segment} className="flex items-center gap-1.5">
              <span className="text-line">/</span>
              <span
                className={
                  isLast
                    ? "font-semibold text-ink capitalize"
                    : "text-caption hover:text-ink capitalize"
                }
              >
                {label}
              </span>
            </span>
          );
        })}
      </nav>

      {/* Quick Utility Links */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/verify"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-ink transition-colors hover:border-primary hover:text-primary"
        >
          <QrCode className="h-3.5 w-3.5 text-primary" />
          <span>Verify QR</span>
        </Link>

        <Link
          href="/request/track"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-ink transition-colors hover:border-primary hover:text-primary"
        >
          <Search className="h-3.5 w-3.5 text-caption" />
          <span>Track Request</span>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-ink transition-colors hover:border-primary hover:text-primary"
        >
          <ExternalLink className="h-3.5 w-3.5 text-caption" />
          <span className="hidden sm:inline">Live Site</span>
        </Link>

        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {roleLabel}
        </span>
      </div>
    </header>
  );
}

