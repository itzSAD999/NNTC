"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { AuditEventRow } from "@/lib/data/admin-audit";
import { REQUEST_STATUSES } from "@/lib/constants";
import {
  STAFF_EVENT_LABELS,
  STATUS_LABELS,
} from "@/lib/requests/status-labels";
import { formatShortDate } from "@/lib/utils/format";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuditLogTable({
  events,
  actors,
  filters,
}: {
  events: AuditEventRow[];
  actors: string[];
  filters: { month?: string; status?: string; actor?: string };
}) {
  const router = useRouter();

  function applyFilters(formData: FormData) {
    const params = new URLSearchParams();
    const month = formData.get("month")?.toString();
    const status = formData.get("status")?.toString();
    const actor = formData.get("actor")?.toString();

    if (month) params.set("month", month);
    if (status) params.set("status", status);
    if (actor) params.set("actor", actor);

    router.push(`/dashboard/admin/audit?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/dashboard/admin/audit");
  }

  return (
    <div className="space-y-6">
      <form
        action={applyFilters}
        className="grid gap-4 rounded border border-line bg-surface p-4 sm:grid-cols-4"
      >
        <div className="space-y-2">
          <Label htmlFor="month">Month</Label>
          <Input
            id="month"
            name="month"
            type="month"
            defaultValue={filters.month ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Request status</Label>
          <select
            id="status"
            name="status"
            defaultValue={filters.status ?? ""}
            className="flex h-9 w-full rounded border border-line bg-bg px-3 text-sm"
          >
            <option value="">All statuses</option>
            {REQUEST_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="actor">Actor</Label>
          <Input
            id="actor"
            name="actor"
            list="audit-actors"
            defaultValue={filters.actor ?? ""}
            placeholder="Search by name"
          />
          <datalist id="audit-actors">
            {actors.map((actor) => (
              <option key={actor} value={actor} />
            ))}
          </datalist>
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit">Filter</Button>
          <Button type="button" variant="ghost" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </form>

      {events.length === 0 ? (
        <EmptyState message="No audit events match your filters." />
      ) : (
        <div className="overflow-x-auto rounded border border-line bg-surface">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-widest text-caption">
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 ref-mono text-caption whitespace-nowrap">
                    {formatShortDate(event.created_at)}
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {STAFF_EVENT_LABELS[event.action] ?? event.action}
                  </td>
                  <td className="px-4 py-3 text-caption">{event.actor_label}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/requests/${event.request_id}`}
                      className="ref-mono text-primary hover:underline"
                    >
                      {event.reference_no}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      status={event.request_status}
                      label={STATUS_LABELS[event.request_status]}
                    />
                  </td>
                  <td className="max-w-xs px-4 py-3 text-caption">
                    {event.note ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
