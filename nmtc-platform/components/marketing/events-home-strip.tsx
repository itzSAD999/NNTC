import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Download,
  CalendarDays,
  Sparkles,
} from "lucide-react";

import { EventCard } from "@/components/marketing/event-card";
import { Button } from "@/components/ui/button";
import { ACADEMIC_CALENDAR_MILESTONES } from "@/lib/data/academic-calendar";
import { PREVIEW_EVENTS } from "@/lib/data/preview-expansion";
import type { CollegeEvent } from "@/lib/types/expansion";

export function EventsHomeStrip({ events }: { events: CollegeEvent[] }) {
  // If events in DB are empty, use preview events so the section always looks rich and helpful
  const displayEvents = events.length > 0 ? events.slice(0, 2) : PREVIEW_EVENTS.slice(0, 2);
  const keyMilestones = ACADEMIC_CALENDAR_MILESTONES.slice(0, 5);

  return (
    <section
      aria-labelledby="events-heading"
      className="section-grid border-b border-line py-16 md:py-20"
    >
      {/* SECTION HEADER */}
      <div className="hairline-b flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span>Campus Schedule &amp; Milestones</span>
          </p>
          <h2
            id="events-heading"
            className="mt-3 font-serif text-display-md md:text-display-lg"
          >
            Upcoming Events &amp; Academic Calendar
          </h2>
          <p className="mt-2 text-caption max-w-2xl">
            Stay informed with clinical ward rotations, examination timetables,
            matriculation dates, and campus gatherings for Nandom NMTC.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/events" className="flex items-center gap-1.5">
              <span>View full schedule</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 2-COLUMN GRID: UPCOMING EVENTS (LEFT) & ACADEMIC CALENDAR (RIGHT) */}
      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN: CAMPUS EVENTS (7 COLS) */}
        <div className="space-y-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-line/60 pb-3">
            <h3 className="font-serif text-lg font-bold text-ink">
              Featured Campus Events
            </h3>
            <span className="text-xs text-caption">Public &amp; Student Events</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {displayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="rounded-xl border border-dashed border-line bg-bg/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-caption">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>
                Want to register for upcoming health screening or open days?
              </span>
            </div>
            <Link
              href="/events"
              className="font-medium text-primary hover:underline shrink-0"
            >
              Check event details &rarr;
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: ACADEMIC CALENDAR KEY DATES (5 COLS) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-line bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-ink">
                    2025/2026 Academic Calendar
                  </h3>
                  <p className="text-[11px] text-caption">
                    Key Semester Dates &amp; Deadlines
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                Active Term
              </span>
            </div>

            {/* Milestones List */}
            <div className="mt-4 divide-y divide-line/70">
              {keyMilestones.map((item) => (
                <div key={item.id} className="flex items-start gap-3.5 py-3 first:pt-1 last:pb-1">
                  {/* Date Badge */}
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-line bg-bg text-center shadow-sm">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary leading-none">
                      {item.month}
                    </span>
                    <span className="font-serif text-sm font-bold text-ink leading-tight mt-0.5">
                      {item.day}
                    </span>
                  </div>

                  {/* Milestone Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-bg px-1.5 py-0.5 text-[10px] font-semibold text-caption border border-line">
                        {item.cohort}
                      </span>
                      <span className="text-[10px] font-medium text-caption">
                        {item.semester}
                      </span>
                    </div>
                    <h4 className="mt-1 font-serif text-xs font-semibold text-ink leading-snug">
                      {item.title}
                    </h4>
                    <p className="mt-0.5 text-[11px] text-caption line-clamp-1">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions Footer */}
            <div className="mt-5 border-t border-line pt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <span>Full semester calendar</span>
                <ArrowRight className="h-3 w-3" />
              </Link>

              <Link
                href="/resources"
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-bg px-2.5 py-1 text-xs font-medium text-ink hover:border-primary hover:text-primary transition-colors"
              >
                <Download className="h-3 w-3" />
                <span>PDF Handbook</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
