import { Suspense } from "react";

import { AuditLogTable } from "@/components/admin/audit-log";
import { AdminListShell } from "@/components/admin/admin-layout";
import { LoadingState } from "@/components/ui/loading-state";
import { requireSuperAdmin } from "@/lib/auth/permissions";
import {
  listAuditActors,
  listAuditEvents,
  type AuditFilters,
} from "@/lib/data/admin-audit";
import type { RequestStatus } from "@/lib/constants";

type PageProps = {
  searchParams: Promise<{
    month?: string;
    status?: string;
    actor?: string;
  }>;
};

export default async function AdminAuditPage({ searchParams }: PageProps) {
  await requireSuperAdmin();
  const params = await searchParams;

  const filters: AuditFilters = {
    month: params.month,
    status: (params.status as RequestStatus | undefined) ?? "",
    actor: params.actor,
  };

  const [events, actors] = await Promise.all([
    listAuditEvents(filters),
    listAuditActors(),
  ]);

  return (
    <AdminListShell section="audit">
      <Suspense fallback={<LoadingState label="Loading audit events…" />}>
        <AuditLogTable
          events={events}
          actors={actors}
          filters={{
            month: params.month,
            status: params.status,
            actor: params.actor,
          }}
        />
      </Suspense>
    </AdminListShell>
  );
}
