"use client";

import { useMemo, useState } from "react";

import { PageSection } from "@/components/layout/page-section";

import { EventCard } from "@/components/marketing/event-card";
import type { CollegeEvent } from "@/lib/types/expansion";
import { formatShortDate } from "@/lib/utils/format";

type ViewMode = "list" | "calendar";

export function EventsListing({
  upcoming,
  past,
}: {
  upcoming: CollegeEvent[];
  past: CollegeEvent[];
}) {
  const [view, setView] = useState<ViewMode>("list");
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const calendarEvents = useMemo(() => {
    return upcoming.filter((e) => {
      const d = new Date(e.starts_at);
      return d.getFullYear() === month.year && d.getMonth() === month.month;
    });
  }, [upcoming, month]);

  const monthLabel = new Date(month.year, month.month).toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });

  function shiftMonth(delta: number) {
    setMonth((m) => {
      const d = new Date(m.year, m.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  return (
    <PageSection bordered={false} className="space-y-16">
      <section aria-labelledby="upcoming-events-heading">
        <div className="hairline-b flex flex-wrap items-end justify-between gap-4 pb-4">
          <div>
            <p className="section-eyebrow">Campus &amp; community</p>
            <h2 id="upcoming-events-heading" className="mt-2 font-serif text-display-md">
              Upcoming events
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`rounded px-3 py-1.5 text-sm ${
                view === "list"
                  ? "bg-primary text-white"
                  : "border border-line text-caption"
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setView("calendar")}
              className={`rounded px-3 py-1.5 text-sm ${
                view === "calendar"
                  ? "bg-primary text-white"
                  : "border border-line text-caption"
              }`}
            >
              Calendar
            </button>
          </div>
        </div>

        {view === "list" ? (
          upcoming.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-caption">No upcoming events scheduled.</p>
          )
        ) : (
          <div className="mt-8 rounded border border-line bg-surface p-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="text-sm text-primary hover:underline"
              >
                ← Previous
              </button>
              <p className="font-medium text-ink">{monthLabel}</p>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="text-sm text-primary hover:underline"
              >
                Next →
              </button>
            </div>
            {calendarEvents.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {calendarEvents.map((e) => (
                  <li
                    key={e.id}
                    className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3 last:border-0"
                  >
                    <span className="font-medium text-ink">{e.title}</span>
                    <span className="text-sm text-caption">
                      {formatShortDate(e.starts_at)} · {e.location}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-caption">
                No events in {monthLabel}.
              </p>
            )}
          </div>
        )}
      </section>

      {past.length > 0 ? (
        <section aria-labelledby="past-events-heading">
          <h2
            id="past-events-heading"
            className="hairline-b pb-4 font-serif text-display-md"
          >
            Past events archive
          </h2>
          <ul className="mt-8 divide-y divide-line rounded border border-line bg-surface">
            {past.map((e) => (
              <li key={e.id} className="px-5 py-4">
                <a href={`/events/${e.slug}`} className="group flex flex-wrap justify-between gap-2">
                  <span className="font-medium text-ink group-hover:text-primary">
                    {e.title}
                  </span>
                  <span className="text-sm text-caption">
                    {formatShortDate(e.starts_at)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </PageSection>
  );
}
