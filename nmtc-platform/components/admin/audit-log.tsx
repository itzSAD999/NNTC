"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Filter } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");

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
    setSearchTerm("");
    router.push("/dashboard/admin/audit");
  }

  // Real-time client filter on loaded events
  const filteredEvents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return events;

    return events.filter((e) => {
      const matchRef = e.reference_no.toLowerCase().includes(q);
      const matchActor = e.actor_label.toLowerCase().includes(q);
      const actionLabel = (STAFF_EVENT_LABELS[e.action] ?? e.action).toLowerCase();
      const matchAction = actionLabel.includes(q);
      const matchNote = e.note ? e.note.toLowerCase().includes(q) : false;
      return matchRef || matchActor || matchAction || matchNote;
    });
  }, [events, searchTerm]);

  const hasServerFilters = Boolean(filters.month || filters.status || filters.actor);
  const hasAnyFilters = hasServerFilters || searchTerm.trim() !== "";

  return (
    <div className="space-y-4">
      {/* Search and Server Filter Bar */}
      <div className="rounded-xl border border-line bg-surface p-4 shadow-2xs space-y-4">
        {/* Instant Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-caption" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Quick search loaded logs by NMTC reference, actor name, action, or note..."
            className="pl-9 text-xs sm:text-sm bg-bg/50 focus:bg-surface"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-caption hover:text-ink text-xs"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Database Query Filters Form */}
        <form
          action={applyFilters}
          className="grid gap-3 pt-3 border-t border-line/60 sm:grid-cols-4"
        >
          <div className="space-y-1">
            <Label htmlFor="month" className="text-xs text-caption">Month</Label>
            <Input
              id="month"
              name="month"
              type="month"
              defaultValue={filters.month ?? ""}
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="status" className="text-xs text-caption">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={filters.status ?? ""}
              className="flex h-9 w-full rounded-md border border-line bg-surface px-3 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
            >
              <option value="">All statuses</option>
              {REQUEST_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="actor" className="text-xs text-caption">Actor</Label>
            <Input
              id="actor"
              name="actor"
              list="audit-actors"
              defaultValue={filters.actor ?? ""}
              placeholder="Filter by officer"
              className="h-9 text-xs"
            />
            <datalist id="audit-actors">
              {actors.map((actor) => (
                <option key={actor} value={actor} />
              ))}
            </datalist>
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" size="sm" className="h-9 text-xs">
              Apply Filters
            </Button>
            {hasAnyFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9 text-xs"
              >
                Reset
              </Button>
            )}
          </div>
        </form>

        {/* Result Counter */}
        <div className="flex items-center justify-between text-xs text-caption pt-1 border-t border-line/40">
          <p>
            Showing <strong className="text-ink">{filteredEvents.length}</strong> of{" "}
            <strong>{events.length}</strong> recorded audit events
          </p>
        </div>
      </div>

      {/* Events Table */}
      {events.length === 0 ? (
        <EmptyState message="No audit events match your filters." />
      ) : filteredEvents.length === 0 ? (
        <EmptyState message="No audit events match your search term." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-2xs">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-bg/50 text-[0.7rem] uppercase tracking-wider text-caption font-semibold">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Audit Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="transition-colors hover:bg-bg/40">
                  <td className="px-4 py-3 ref-mono text-caption text-xs whitespace-nowrap">
                    {formatShortDate(event.created_at)}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-ink">
                    {STAFF_EVENT_LABELS[event.action] ?? event.action}
                  </td>
                  <td className="px-4 py-3 text-xs text-caption">{event.actor_label}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/requests/${event.request_id}`}
                      className="ref-mono text-xs font-semibold text-primary hover:underline"
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
                  <td className="max-w-xs px-4 py-3 text-xs text-caption truncate">
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
