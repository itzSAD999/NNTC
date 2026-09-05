"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";

import { eventStatusLabel } from "@/lib/events/dates";
import type { CollegeEvent } from "@/lib/types/expansion";
import { formatShortDate } from "@/lib/utils/format";
import { matchesSearch } from "@/lib/admin/list-filters";
import {
  AdminListFilterBar,
  useAdminListFilters,
} from "@/components/admin/admin-list-filters";
import { AdminListToast } from "@/components/admin/admin-list-toast";
import {
  AdminListResults,
  AdminMobileCard,
} from "@/components/admin/admin-responsive-list";
import {
  AdminTable,
  AdminTableHead,
  AdminTableTh,
} from "@/components/admin/admin-layout";
import { PublicLinkPreview } from "@/components/admin/admin-help";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

type EventTiming = "all" | "upcoming" | "past";

function EventsListContent({ events }: { events: CollegeEvent[] }) {
  const filters = useAdminListFilters();
  const [timing, setTiming] = useState<EventTiming>("all");

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (!matchesSearch(filters.search, [e.title, e.slug, e.location])) {
        return false;
      }
      const status = eventStatusLabel(e.starts_at, e.ends_at);
      if (timing === "upcoming" && status !== "Upcoming") return false;
      if (timing === "past" && status !== "Past") return false;
      return true;
    });
  }, [events, filters.search, timing]);

  if (events.length === 0) {
    return <EmptyState message="No events yet." />;
  }

  return (
    <div className="space-y-4">
      <AdminListFilterBar
        search={filters.search}
        onSearchChange={filters.setSearch}
        showStatus={false}
        searchPlaceholder="Search events…"
        total={events.length}
        filtered={filtered.length}
        extraFilters={
          <div className="space-y-1 sm:w-44">
            <label
              htmlFor="event-timing"
              className="text-xs font-medium text-caption"
            >
              Timing
            </label>
            <select
              id="event-timing"
              value={timing}
              onChange={(e) => setTiming(e.target.value as EventTiming)}
              className="flex h-9 w-full rounded border border-line bg-surface px-3 text-sm sm:w-auto"
            >
              <option value="all">All events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        }
      />

      {filtered.length === 0 ? (
        <EmptyState message="No events match your filters." />
      ) : (
        <AdminListResults
          table={
            <AdminTable minWidth="720px">
              <AdminTableHead>
                <AdminTableTh>Event</AdminTableTh>
                <AdminTableTh>Date</AdminTableTh>
                <AdminTableTh>Status</AdminTableTh>
                <AdminTableTh>Actions</AdminTableTh>
              </AdminTableHead>
              <tbody>
                {filtered.map((e) => {
                  const status = eventStatusLabel(e.starts_at, e.ends_at);
                  return (
                    <tr
                      key={e.id}
                      className="border-b border-line last:border-0"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/admin/events/${e.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {e.title}
                        </Link>
                        <PublicLinkPreview basePath="/events" slug={e.slug} />
                      </td>
                      <td className="px-4 py-3 text-caption">
                        {formatShortDate(e.starts_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            status === "Upcoming"
                              ? "text-primary"
                              : "text-caption"
                          }
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/dashboard/admin/events/${e.id}`}>
                            Edit
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </AdminTable>
          }
          cards={filtered.map((e) => {
            const status = eventStatusLabel(e.starts_at, e.ends_at);
            return (
              <AdminMobileCard key={e.id}>
                <div className="space-y-3">
                  <div>
                    <Link
                      href={`/dashboard/admin/events/${e.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {e.title}
                    </Link>
                    <PublicLinkPreview basePath="/events" slug={e.slug} />
                  </div>
                  <p className="text-xs text-caption">
                    {formatShortDate(e.starts_at)} ·{" "}
                    <span
                      className={
                        status === "Upcoming" ? "text-primary" : undefined
                      }
                    >
                      {status}
                    </span>
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/admin/events/${e.id}`}>Edit</Link>
                  </Button>
                </div>
              </AdminMobileCard>
            );
          })}
        />
      )}
    </div>
  );
}

export function EventsList({ events }: { events: CollegeEvent[] }) {
  return (
    <>
      <Suspense fallback={null}>
        <AdminListToast />
      </Suspense>
      <EventsListContent events={events} />
    </>
  );
}
