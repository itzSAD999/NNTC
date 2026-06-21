"use client";

import Link from "next/link";

import { toggleEventPastForm } from "@/lib/actions/events";
import type { CollegeEvent } from "@/lib/types/expansion";
import { formatShortDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function EventsList({ events }: { events: CollegeEvent[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/admin/events/new">New event</Link>
        </Button>
      </div>
      {events.length === 0 ? (
        <EmptyState message="No events yet." />
      ) : (
        <div className="overflow-x-auto rounded border border-line bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-widest text-caption">
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/admin/events/${e.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {e.title}
                    </Link>
                    <p className="text-xs text-caption">/{e.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-caption">
                    {formatShortDate(e.starts_at)}
                  </td>
                  <td className="px-4 py-3 text-caption">
                    {e.is_past ? "Past" : "Upcoming"}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleEventPastForm}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="is_past" value={String(e.is_past)} />
                      <Button type="submit" size="sm" variant="outline">
                        {e.is_past ? "Mark upcoming" : "Mark past"}
                      </Button>
                    </form>
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
