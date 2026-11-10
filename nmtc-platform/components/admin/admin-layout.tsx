"use client";

import { useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink, HelpCircle, X } from "lucide-react";

import type { AdminSectionKey } from "@/lib/admin/page-guides";
import { ADMIN_SECTION_GUIDES } from "@/lib/admin/page-guides";
import { cn } from "@/lib/utils";

/** Compact Guide Tip: Unobtrusive help trigger taking zero extra vertical space by default */
export function CollapsibleGuide({ section }: { section: AdminSectionKey }) {
  const guide = ADMIN_SECTION_GUIDES[section];
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-caption hover:border-primary hover:text-primary transition-colors shadow-2xs"
        title="Page tips"
      >
        <HelpCircle className="h-3.5 w-3.5 text-primary" />
        <span>{open ? "Hide tips" : "Page tips"}</span>
      </button>

      {open && (
        <div className="mt-3 flex items-start justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-ink shadow-sm">
          <p className="leading-relaxed">{guide.howItWorks}</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-caption hover:text-ink shrink-0 p-0.5"
            aria-label="Close tips"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/** List page shell: Clean header + action button, zero visual clutter */
export function AdminListShell({
  section,
  action,
  children,
}: {
  section: AdminSectionKey;
  action?: ReactNode;
  children: ReactNode;
}) {
  const guide = ADMIN_SECTION_GUIDES[section];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-serif text-display-md text-ink">{guide.title}</h1>
            {guide.publicPath ? (
              <Link
                href={guide.publicPath}
                target="_blank"
                className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-0.5 text-[0.7rem] font-medium text-caption hover:border-primary hover:text-primary transition-colors shadow-2xs"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Live page</span>
              </Link>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-caption max-w-2xl">{guide.description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <CollapsibleGuide section={section} />
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </div>

      {children}
    </div>
  );
}

/** Edit/create page shell with breadcrumb and back link. */
export function AdminEditShell({
  listHref,
  listLabel,
  title,
  subtitle,
  children,
  maxWidth = "max-w-3xl",
}: {
  listHref: string;
  listLabel: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-xs text-caption">
        <Link href={listHref} className="text-primary hover:underline">
          {listLabel}
        </Link>
        <span className="mx-2 text-line" aria-hidden="true">
          /
        </span>
        <span className="text-ink font-medium">{title}</span>
      </nav>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={listHref}
            className="inline-block text-xs font-medium text-primary hover:underline mb-1"
          >
            ← Back to {listLabel}
          </Link>
          <h1 className="font-serif text-display-md text-ink">{title}</h1>
          {subtitle ? <p className="mt-1 text-xs text-caption">{subtitle}</p> : null}
        </div>
      </div>

      <div className={cn(maxWidth === "full" ? "" : maxWidth)}>{children}</div>
    </div>
  );
}

export function AdminSectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-line bg-surface p-5 sm:p-6 shadow-2xs space-y-5",
        className
      )}
    >
      <div>
        <h2 className="font-serif text-lg font-semibold text-ink">{title}</h2>
        {description ? (
          <div className="mt-1 text-xs text-caption">{description}</div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function FormMessage({
  error,
  success,
  successLabel = "Saved successfully.",
}: {
  error?: string;
  success?: boolean;
  successLabel?: string;
}) {
  if (error) {
    return (
      <p role="alert" className="text-xs font-medium text-red-600">
        {error}
      </p>
    );
  }
  if (success) {
    return (
      <p role="status" className="text-xs font-medium text-emerald-600">
        {successLabel}
      </p>
    );
  }
  return null;
}

export function AdminTable({
  children,
  minWidth = "720px",
}: {
  children: ReactNode;
  minWidth?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-2xs">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function AdminTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-line bg-bg/50 text-[0.7rem] uppercase tracking-wider text-caption font-semibold">
        {children}
      </tr>
    </thead>
  );
}

export function AdminTableTh({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("px-4 py-3 font-semibold", className)}>{children}</th>
  );
}
