"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Download,
  Filter,
  MapPin,
  Sparkles,
  Tag,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { CollegeEvent } from "@/lib/types/expansion";

interface IntegratedEvent {
  id: string;
  year: number;
  month: number; // 0-indexed (10 = November)
  monthLabel: string; // e.g. "NOV"
  day: number;
  time: string;
  title: string;
  location?: string;
  category?: string;
  href?: string;
  isMilestone?: boolean;
}

const DEFAULT_SCHEDULE_EVENTS: IntegratedEvent[] = [
  {
    id: "evt-nov-13",
    year: 2026,
    month: 10,
    monthLabel: "NOV",
    day: 13,
    time: "6:00 pm – 9:00 pm",
    category: "Alumni & Induction",
    title: "Alumni Gathering & Healthcare Leadership Induction",
    location: "NMTC Great Hall & Virtual Stream",
    href: "/events",
  },
  {
    id: "evt-nov-18",
    year: 2026,
    month: 10,
    monthLabel: "NOV",
    day: 18,
    time: "10:00 am – 12:00 pm",
    category: "Clinical Mentorship",
    title: "Executive-in-Residence (EIR) Clinical Mentorship Launch",
    location: "St. Theresa's Hospital Training Annex",
    href: "/events",
  },
  {
    id: "evt-nov-19",
    year: 2026,
    month: 10,
    monthLabel: "NOV",
    day: 19,
    time: "4:30 pm – 6:30 pm",
    category: "Public Lecture",
    title: "Public Lecture: Maternal Health, Midwifery & Community Rights",
    location: "Main Lecture Theatre",
    href: "/events",
  },
  {
    id: "evt-nov-20",
    year: 2026,
    month: 10,
    monthLabel: "NOV",
    day: 20,
    time: "4:00 pm – 5:30 pm",
    category: "Ethics & Integrity",
    title: "Integrity Talk: Leadership and Ethics in the Health Service",
    location: "Demonstration Skills Auditorium",
    href: "/events",
  },
  {
    id: "evt-nov-25",
    year: 2026,
    month: 10,
    monthLabel: "NOV",
    day: 25,
    time: "8:00 am – 2:00 pm",
    category: "Community Outreach",
    title: "Community Health Outreach & Preventative Care Screening",
    location: "Nandom District Poly-Clinic",
    href: "/events",
  },
  {
    id: "evt-nov-27",
    year: 2026,
    month: 10,
    monthLabel: "NOV",
    day: 27,
    time: "9:00 am – 1:00 pm",
    category: "NMC Licensure",
    title: "NMC Ghana Licensure Revision & Mock Simulation",
    location: "Skills Demonstration Lab",
    href: "/events",
  },
  {
    id: "evt-nov-28",
    year: 2026,
    month: 10,
    monthLabel: "NOV",
    day: 28,
    time: "10:00 am – 4:00 pm",
    category: "Student Life",
    title: "Student Nurses & Midwives Association General Assembly",
    location: "College Campus Quadrangle",
    href: "/events",
  },
];

const MONTH_NAMES = [
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

const MONTH_ABBR = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export function EventsHomeStrip({ events }: { events: CollegeEvent[] }) {
  // Combine custom database events with default events and academic calendar
  const allEvents = useMemo(() => {
    const list: IntegratedEvent[] = [...DEFAULT_SCHEDULE_EVENTS];

    // Convert database events if any
    for (const evt of events) {
      if (!evt.starts_at) continue;
      const d = new Date(evt.starts_at);
      if (isNaN(d.getTime())) continue;

      const timeStr = d.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      list.push({
        id: evt.id,
        year: d.getFullYear(),
        month: d.getMonth(),
        monthLabel: MONTH_ABBR[d.getMonth()],
        day: d.getDate(),
        time: timeStr ? `${timeStr} GMT` : "All Day",
        category: "Campus Event",
        title: evt.title,
        location: evt.location || "NMTC Campus",
        href: `/events/${evt.slug}`,
      });
    }

    return list;
  }, [events]);

  // Calendar month state (default to November 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // November (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Month navigation
  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  }

  // Days in current month calculation (Monday is col 0, Sunday is col 6)
  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const jsDay = firstDayOfMonth.getDay();
    const startOffset = (jsDay + 6) % 7;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Map of days that have events in this month
    const eventDaysSet = new Set<number>();
    allEvents.forEach((evt) => {
      if (evt.year === currentYear && evt.month === currentMonth) {
        eventDaysSet.add(evt.day);
      }
    });

    const cells: {
      day: number | null;
      hasEvent: boolean;
    }[] = [];

    // Empty cells before day 1
    for (let i = 0; i < startOffset; i++) {
      cells.push({ day: null, hasEvent: false });
    }

    // Days 1 through daysInMonth
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, hasEvent: eventDaysSet.has(d) });
    }

    return cells;
  }, [currentYear, currentMonth, allEvents]);

  // Filter schedule by selected day or show month's events
  const visibleSchedule = useMemo(() => {
    let filtered = allEvents.filter(
      (evt) => evt.year === currentYear && evt.month === currentMonth
    );

    if (selectedDay !== null) {
      filtered = filtered.filter((evt) => evt.day === selectedDay);
    }

    // Sort chronologically
    return filtered.sort((a, b) => a.day - b.day);
  }, [allEvents, currentYear, currentMonth, selectedDay]);

  return (
    <section
      aria-labelledby="events-schedule-heading"
      className="section-grid py-14 sm:py-16 md:py-20 border-b border-line bg-surface"
    >
      {/* Refined Section Header */}
      <div className="pb-8 border-b border-line">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span>Collegiate Schedule &amp; Academic Dates</span>
            </p>
            <h2
              id="events-schedule-heading"
              className="mt-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink"
            >
              College Events &amp; Academic Calendar
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-caption max-w-2xl font-light">
              Interactive term schedule — click any highlighted date to filter events, examine examination deadlines, and browse ward postings.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-none border border-line bg-bg px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary hover:border-primary hover:bg-surface transition-all shrink-0 shadow-sm"
          >
            <span>Full Schedule Archive</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 2-Column Integrated Layout (Institutional Green Scheme) */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start rounded-none border border-line bg-surface p-6 sm:p-8 lg:p-10 shadow-sm">
        {/* =========================================================================
            LEFT COLUMN: SCHEDULE
            ========================================================================= */}
        <div className="lg:col-span-7">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-caption">
                SCHEDULE
              </span>
              <span className="rounded-none bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                {visibleSchedule.length} Events
              </span>
            </div>

            <Link
              href="/events"
              className="text-xs font-bold uppercase tracking-[0.14em] text-primary hover:text-primary-deep hover:underline flex items-center gap-1 transition-colors"
            >
              <span>ALL EVENTS</span>
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>

          {/* Filter notice if user selected a day */}
          {selectedDay !== null && (
            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 px-3.5 py-2.5 my-3 text-xs">
              <span className="text-ink flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-primary" />
                <span>
                  Filtering for:{" "}
                  <strong className="text-primary font-bold">
                    {MONTH_NAMES[currentMonth]} {selectedDay}, {currentYear}
                  </strong>
                </span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Show all events
              </button>
            </div>
          )}

          {/* Schedule Events List */}
          <div className="divide-y divide-line/80">
            {visibleSchedule.length > 0 ? (
              visibleSchedule.map((evt) => {
                const isSelected = selectedDay === evt.day;
                return (
                  <div
                    key={evt.id}
                    onClick={() =>
                      setSelectedDay(selectedDay === evt.day ? null : evt.day)
                    }
                    className={cn(
                      "group flex items-start gap-4 sm:gap-6 py-4 sm:py-5 transition-all cursor-pointer rounded-none",
                      isSelected
                        ? "bg-primary/[0.06] border-l-4 border-primary pl-3"
                        : "hover:bg-bg/60 hover:pl-2"
                    )}
                  >
                    {/* Stacked Green Date (NOV over 13) */}
                    <div className="flex flex-col items-center justify-center shrink-0 min-w-[3.5rem] rounded-none border border-line bg-bg p-2 text-center group-hover:border-primary/40 transition-colors shadow-sm">
                      <span className="font-bold text-[11px] tracking-wider uppercase text-primary leading-none">
                        {evt.monthLabel}
                      </span>
                      <span className="font-serif font-bold text-2xl sm:text-3xl text-ink group-hover:text-primary leading-none mt-1 transition-colors">
                        {evt.day}
                      </span>
                    </div>

                    {/* Event Details */}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        {evt.category && (
                          <span className="rounded-none bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                            {evt.category}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-caption font-medium">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          <span>{evt.time}</span>
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-ink leading-snug group-hover:text-primary transition-colors">
                        {evt.title}
                      </h3>

                      {evt.location && (
                        <p className="flex items-center gap-1.5 text-xs text-caption">
                          <MapPin className="h-3.5 w-3.5 text-caption/70 shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-caption space-y-2">
                <p>No events scheduled for this selected date.</p>
                <button
                  type="button"
                  onClick={() => setSelectedDay(null)}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <span>Reset to all events for {MONTH_NAMES[currentMonth]}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: CALENDAR
            ========================================================================= */}
        <div className="lg:col-span-5 lg:border-l lg:border-line lg:pl-10 space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-caption">
              ACADEMIC CALENDAR
            </span>
            {selectedDay !== null && (
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Clear Selection
              </button>
            )}
          </div>

          {/* Month Selector Bar: ← November 2026 → */}
          <div className="flex items-center justify-between rounded-none border border-line bg-bg p-2 shadow-sm">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="px-2.5 py-1 text-ink/70 hover:text-ink transition-colors hover:bg-surface rounded-none border border-transparent hover:border-line"
              aria-label="Previous month"
            >
              <span className="text-base font-bold leading-none">&larr;</span>
            </button>

            <div className="text-center">
              <h3 className="font-serif text-base sm:text-lg font-bold text-ink">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>
              <p className="text-[10px] uppercase tracking-wider text-caption">
                Semester Schedule
              </p>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="px-2.5 py-1 text-ink/70 hover:text-ink transition-colors hover:bg-surface rounded-none border border-transparent hover:border-line"
              aria-label="Next month"
            >
              <span className="text-base font-bold leading-none">&rarr;</span>
            </button>
          </div>

          {/* Weekday Labels (MO TU WE TH FR SA SU) */}
          <div className="grid grid-cols-7 text-center rounded-none bg-bg/80 border border-line/60 py-2">
            {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((dayName) => (
              <span
                key={dayName}
                className="text-[11px] font-bold text-caption uppercase tracking-wider"
              >
                {dayName}
              </span>
            ))}
          </div>

          {/* Calendar Month Grid */}
          <div className="grid grid-cols-7 text-center gap-1">
            {calendarGrid.map((cell, idx) => {
              if (cell.day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-10 sm:h-11 flex items-center justify-center opacity-0"
                    aria-hidden
                  />
                );
              }

              const isSelected = selectedDay === cell.day;

              return (
                <button
                  key={`day-${cell.day}`}
                  type="button"
                  onClick={() =>
                    setSelectedDay(selectedDay === cell.day ? null : cell.day)
                  }
                  className={cn(
                    "group relative h-10 sm:h-11 flex flex-col items-center justify-center text-xs sm:text-sm transition-all rounded-none border border-transparent",
                    isSelected
                      ? "bg-primary text-white font-bold border-primary shadow-sm"
                      : cell.hasEvent
                      ? "font-bold text-ink bg-bg/70 hover:border-primary/40 hover:bg-primary/10 cursor-pointer"
                      : "text-ink/80 hover:bg-bg cursor-pointer"
                  )}
                  aria-label={`${MONTH_NAMES[currentMonth]} ${cell.day}${
                    cell.hasEvent ? " (Event scheduled)" : ""
                  }`}
                >
                  <span className="leading-none">{cell.day}</span>

                  {/* Institutional Green dot underneath event days */}
                  {cell.hasEvent && (
                    <span
                      className={cn(
                        "mt-1 h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-125",
                        isSelected ? "bg-white" : "bg-primary"
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend and PDF Link */}
          <div className="pt-4 border-t border-line space-y-3">
            <div className="flex items-center justify-between text-xs text-caption">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                <span>Collegiate Events &amp; Milestones</span>
              </span>
              <span className="font-mono text-[11px]">2026/2027 Term</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link
                href="/resources"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Academic Calendar PDF</span>
              </Link>

              <Link
                href="/events"
                className="text-xs text-caption hover:text-ink transition-colors"
              >
                View all &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
