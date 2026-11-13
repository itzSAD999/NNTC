"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { CollegeEvent } from "@/lib/types/expansion";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function EventsHomeStrip({ events }: { events: CollegeEvent[] }) {
  const parsed = useMemo(() => {
    return events
      .map((evt) => {
        const start = new Date(evt.starts_at);
        if (Number.isNaN(start.getTime())) return null;
        return { evt, start };
      })
      .filter((row): row is { evt: CollegeEvent; start: Date } => row !== null)
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [events]);

  const initial = parsed[0]?.start ?? new Date();
  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, typeof parsed>();
    for (const row of parsed) {
      const key = dateKey(row.start);
      const list = map.get(key) ?? [];
      list.push(row);
      map.set(key, list);
    }
    return map;
  }, [parsed]);

  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(d);
    return out;
  }, [year, month]);

  const list = useMemo(() => {
    if (!selectedKey) return parsed.slice(0, 4);
    return parsed.filter((row) => dateKey(row.start) === selectedKey);
  }, [parsed, selectedKey]);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  function shiftMonth(delta: number) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
    setSelectedKey(null);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Dominant horizontal swipe (>40px and >1.3x dy)
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        // Swiped left -> advance to next month
        shiftMonth(1);
      } else {
        // Swiped right -> go to previous month
        shiftMonth(-1);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }

  return (
    <section aria-labelledby="events-heading" data-nav="light" className="border-t border-line bg-white">
      <div className="section-grid py-16 md:py-20">
        <Reveal variant="fade">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Events</p>
              <h2
                id="events-heading"
                className="mt-4 font-serif text-display-md md:text-display-lg"
              >
                Upcoming on campus
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 border border-line px-4 py-2 text-sm font-medium text-ink hover:border-primary hover:text-primary transition-colors"
            >
              All events
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start">
          <Reveal variant="up">
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="select-none touch-pan-y"
            >
              <div className="flex items-center justify-between border-b border-line pb-3">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  className="px-2 py-1 text-sm text-caption hover:text-ink transition-colors"
                  aria-label="Previous month"
                >
                  ←
                </button>
                <p className="font-serif text-lg text-ink">
                  {MONTHS[month]} {year}
                </p>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  className="px-2 py-1 text-sm text-caption hover:text-ink transition-colors"
                  aria-label="Next month"
                >
                  →
                </button>
              </div>

              <div className="mt-4 grid grid-cols-7 text-center text-[0.7rem] uppercase tracking-wider text-caption">
                {WEEKDAYS.map((day) => (
                  <span key={day} className="py-2 font-medium">
                    {day}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 text-center">
                {cells.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="h-10" aria-hidden />;
                  }
                  const key = `${year}-${month}-${day}`;
                  const hasEvent = eventsByDay.has(key);
                  const selected = selectedKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={!hasEvent}
                      onClick={() => setSelectedKey(selected ? null : key)}
                      className={cn(
                        "h-10 text-sm transition-colors",
                        hasEvent
                          ? selected
                            ? "bg-primary font-semibold text-white"
                            : "font-medium text-ink hover:bg-primary hover:text-white cursor-pointer"
                          : "text-caption/80"
                      )}
                      aria-label={
                        hasEvent
                          ? `${MONTHS[month]} ${day}, event scheduled`
                          : `${MONTHS[month]} ${day}`
                      }
                      aria-pressed={hasEvent ? selected : undefined}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-center text-[0.68rem] text-caption lg:hidden select-none">
                Swipe left or right to switch months
              </p>
            </div>
          </Reveal>

          <Reveal variant="up" delay={80} className="border-t border-line lg:border-t-0 lg:border-l lg:pl-10">
            <div>
              {list.length > 0 ? (
                <ul className="divide-y divide-line">
                  {list.map(({ evt, start }) => (
                    <li key={evt.id}>
                      <Link
                        href={`/events/${evt.slug}`}
                        className="group flex gap-5 py-5 transition-colors hover:bg-primary/5 hover:px-4"
                      >
                        <div className="w-12 shrink-0 text-center">
                          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
                            {MONTHS[start.getMonth()].slice(0, 3)}
                          </p>
                          <p className="font-serif text-2xl leading-none text-ink group-hover:text-primary transition-colors">
                            {start.getDate()}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif text-lg text-ink group-hover:text-primary transition-colors">
                            {evt.title}
                          </p>
                          {evt.location ? (
                            <p className="mt-1 text-sm text-caption">
                              {evt.location}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-8 text-sm text-caption">
                  {selectedKey
                    ? "No events on this date."
                    : "No upcoming events posted yet."}{" "}
                  <Link href="/events" className="text-primary underline-offset-2 hover:underline">
                    View the events page
                  </Link>
                </p>
              )}
              {selectedKey ? (
                <button
                  type="button"
                  onClick={() => setSelectedKey(null)}
                  className="mt-4 text-sm font-medium text-primary hover:underline"
                >
                  Show all upcoming
                </button>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
