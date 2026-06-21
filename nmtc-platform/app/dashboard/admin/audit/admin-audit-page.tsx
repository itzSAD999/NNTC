import { Suspense } from "react";

import { AuditLogTable } from "@/components/admin/audit-log";
import { LoadingState } from "@/components/ui/loading-state";
import { requireSuperAdmin } from "@/lib/auth/permissions";
import {
  listAuditActors,
  listAuditEvents,
  type AuditFilters,
} from "@/lib/data/admin-audit";
import type { RequestStatus } from "@/lib/constants";

type PageProps = {
  searchParams: {
    month?: string;
    status?: string;
    actor?: string;
  };
};

export default async function AdminAuditPage({ searchParams }: PageProps) {
  await requireSuperAdmin();
  const params = searchParams;

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
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Audit log</h1>
        <p className="mt-2 text-caption">
          Full request workflow history — read-only. Filter by month, status, or
          actor.
        </p>
      </header>

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
    </div>
  );
}
