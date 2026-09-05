import Link from "next/link";
import type { ReactNode } from "react";

import type { AdminSectionKey } from "@/lib/admin/page-guides";
import { ADMIN_SECTION_GUIDES, CMS_SCOPE_NOTE } from "@/lib/admin/page-guides";
import { cn } from "@/lib/utils";

/** List page shell: title + action on one row, collapsed guide, content. */
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-display-lg">{guide.title}</h1>
          <p className="mt-2 text-caption">{guide.description}</p>
          {guide.publicPath ? (
            <p className="mt-1 text-xs text-caption">
              Public page:{" "}
              <span className="ref-mono text-ink">{guide.publicPath}</span>
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <CollapsibleGuide section={section} />
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
      <nav aria-label="Breadcrumb" className="text-sm text-caption">
        <Link href={listHref} className="text-primary hover:underline">
          {listLabel}
        </Link>
        <span className="mx-2 text-line" aria-hidden="true">
          /
        </span>
        <span className="text-ink">{title}</span>
      </nav>

      <Link
        href={listHref}
        className="inline-block text-sm font-medium text-primary hover:underline"
      >
        ← Back to {listLabel}
      </Link>

      <header>
        <h1 className="font-serif text-display-lg">{title}</h1>
        {subtitle ? <p className="mt-2 text-caption">{subtitle}</p> : null}
      </header>

      <div className={cn(maxWidth === "full" ? "" : maxWidth)}>{children}</div>
    </div>
  );
}

export function CollapsibleGuide({ section }: { section: AdminSectionKey }) {
  const guide = ADMIN_SECTION_GUIDES[section];

  return (
    <details className="group rounded border border-line bg-bg">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="text-primary group-open:text-ink">Page guide</span>
        <span className="ml-2 font-normal text-caption">
          — what you edit & how it works
        </span>
      </summary>
      <div className="space-y-4 border-t border-line px-4 py-4 text-sm leading-relaxed text-caption">
        <div>
          <p className="font-medium text-ink">What you edit here</p>
          <p className="mt-1">{CMS_SCOPE_NOTE}</p>
        </div>
        <div>
          <p className="font-medium text-ink">How this works</p>
          <p className="mt-1">{guide.howItWorks}</p>
        </div>
      </div>
    </details>
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
        "institutional-card space-y-6 p-6",
        className
      )}
    >
      <div>
        <h2 className="font-serif text-display-sm">{title}</h2>
        {description ? (
          <div className="mt-2 text-sm text-caption">{description}</div>
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
      <p role="alert" className="text-sm text-danger">
        {error}
      </p>
    );
  }
  if (success) {
    return (
      <p role="status" className="text-sm text-success">
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
    <div className="overflow-x-auto rounded border border-line bg-surface">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function AdminTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-line text-xs uppercase tracking-widest text-caption">
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
    <th className={cn("px-4 py-3 font-medium", className)}>{children}</th>
  );
}
