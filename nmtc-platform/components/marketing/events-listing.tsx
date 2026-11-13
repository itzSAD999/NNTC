"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
 Calendar,
 CalendarDays,
 Clock,
 Download,
 GraduationCap,
 List,
 Sparkles,
} from "lucide-react";

import { PageSection } from "@/components/layout/page-section";
import { EventCard } from "@/components/marketing/event-card";
import { Reveal } from "@/components/motion/reveal";
import { ACADEMIC_CALENDAR_MILESTONES } from "@/lib/data/academic-calendar";
import type { CollegeEvent } from "@/lib/types/expansion";
import { formatShortDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";

type ViewMode = "list" | "academic" | "calendar";

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

 const touchStartX = useRef<number | null>(null);
 const touchStartY = useRef<number | null>(null);

 function shiftMonth(delta: number) {
 setMonth((m) => {
 const d = new Date(m.year, m.month + delta, 1);
 return { year: d.getFullYear(), month: d.getMonth() };
 });
 }

 function handleTouchStart(e: React.TouchEvent) {
 touchStartX.current = e.touches[0].clientX;
 touchStartY.current = e.touches[0].clientY;
 }

 function handleTouchEnd(e: React.TouchEvent) {
 if (touchStartX.current === null || touchStartY.current === null) return;
 const deltaX = e.changedTouches[0].clientX - touchStartX.current;
 const deltaY = e.changedTouches[0].clientY - touchStartY.current;

 if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
 if (deltaX < 0) {
 shiftMonth(1);
 } else {
 shiftMonth(-1);
 }
 }
 touchStartX.current = null;
 touchStartY.current = null;
 }

 return (
 <PageSection bordered={false} className="space-y-16">
 <section aria-labelledby="events-heading">
 <div className="hairline-b flex flex-wrap items-end justify-between gap-4 pb-4">
 <div>
 <p className="section-eyebrow">Campus &amp; community</p>
 <h2 id="events-heading" className="mt-2 font-serif text-display-md">
 {view === "academic"
 ? "Academic Calendar 2025/2026"
 : view === "calendar"
 ? "Monthly Activity Schedule"
 : "Upcoming Events"}
 </h2>
 </div>

 {/* VIEW SWITCHER PILLS */}
 <div className="flex flex-wrap gap-1.5 rounded-full border border-line bg-surface p-1 shadow-sm">
 <button
 type="button"
 onClick={() => setView("list")}
 className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
 view === "list"
 ? "bg-primary text-white shadow-sm font-semibold"
 : "text-caption hover:text-ink"
 }`}
 >
 Upcoming Events ({upcoming.length})
 </button>
 <button
 type="button"
 onClick={() => setView("academic")}
 className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
 view === "academic"
 ? "bg-primary text-white shadow-sm font-semibold"
 : "text-caption hover:text-ink"
 }`}
 >
 Academic Calendar ({ACADEMIC_CALENDAR_MILESTONES.length})
 </button>
 <button
 type="button"
 onClick={() => setView("calendar")}
 className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
 view === "calendar"
 ? "bg-primary text-white shadow-sm font-semibold"
 : "text-caption hover:text-ink"
 }`}
 >
 Monthly Grid
 </button>
 </div>
 </div>

 {/* VIEW 1: UPCOMING EVENTS CARDS */}
 {view === "list" && (
 <div className="mt-8 space-y-12 animate-in fade-in duration-200">
 {upcoming.length > 0 ? (
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
 {upcoming.map((e) => (
 <Reveal key={e.id}>
 <EventCard event={e} />
 </Reveal>
 ))}
 </div>
 ) : (
 <div className="rounded-none border border-line bg-surface p-8 text-center text-caption">
 <CalendarDays className="mx-auto h-8 w-8 text-caption/50" />
 <p className="mt-2 font-medium text-ink">
 No upcoming public events scheduled currently.
 </p>
 <p className="mt-1 text-xs">
 Review the Academic Calendar tab above for semester dates.
 </p>
 </div>
 )}
 </div>
 )}

 {/* VIEW 2: ACADEMIC CALENDAR KEY DATES */}
 {view === "academic" && (
 <div className="mt-8 space-y-8 animate-in fade-in duration-200">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none border border-primary/20 bg-primary/5 p-5">
 <div>
 <div className="flex items-center gap-2">
 <GraduationCap className="h-5 w-5 text-primary" />
 <h3 className="font-serif text-lg font-bold text-ink">
 Official Nursing &amp; Midwifery Academic Timeline
 </h3>
 </div>
 <p className="mt-1 text-xs text-caption">
 Approved by the Academic Board and affiliated health training regulatory councils.
 </p>
 </div>
 <Button asChild size="sm" variant="outline" className="shrink-0 bg-white shadow-sm rounded-none">
 <Link href="/resources" className="flex items-center gap-1.5 text-xs">
 <Download className="h-3.5 w-3.5" />
 <span>Download PDF Schedule</span>
 </Link>
 </Button>
 </div>

 {/* Milestones Timeline */}
 <div className="rounded-none border border-line bg-surface divide-y divide-line shadow-sm">
 {ACADEMIC_CALENDAR_MILESTONES.map((milestone) => (
 <div
 key={milestone.id}
 className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-bg/40 transition-colors"
 >
 {/* Date Badge */}
 <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-none border border-line bg-bg text-center shadow-sm">
 <span className="text-[10px] font-bold uppercase tracking-wider text-primary leading-none">
 {milestone.month}
 </span>
 <span className="font-serif text-lg font-bold text-ink leading-tight mt-0.5">
 {milestone.day}
 </span>
 <span className="text-[9px] text-caption font-mono leading-none">
 {milestone.year}
 </span>
 </div>

 {/* Milestone Details */}
 <div className="min-w-0 flex-1">
 <div className="flex flex-wrap items-center gap-2">
 <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
 {milestone.cohort}
 </span>
 <span className="rounded-full border border-line bg-bg px-2 py-0.5 text-[11px] font-medium text-caption">
 {milestone.semester}
 </span>
 </div>
 <h4 className="mt-1.5 font-serif text-base font-bold text-ink">
 {milestone.title}
 </h4>
 <p className="mt-1 text-xs text-caption leading-relaxed">
 {milestone.details}
 </p>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* VIEW 3: MONTHLY ACTIVITY GRID */}
 {view === "calendar" && (
 <div
 onTouchStart={handleTouchStart}
 onTouchEnd={handleTouchEnd}
 className="mt-8 rounded-none border border-line bg-surface p-6 shadow-sm animate-in fade-in duration-200 select-none touch-pan-y"
 >
 <div className="flex items-center justify-between border-b border-line pb-4">
 <button
 type="button"
 onClick={() => shiftMonth(-1)}
 className="text-xs font-semibold text-primary hover:underline px-2 py-1"
 >
 &larr; Previous Month
 </button>
 <h3 className="font-serif text-base font-bold text-ink">
 {monthLabel}
 </h3>
 <button
 type="button"
 onClick={() => shiftMonth(1)}
 className="text-xs font-semibold text-primary hover:underline px-2 py-1"
 >
 Next Month &rarr;
 </button>
 </div>

 <div className="mt-6">
 {calendarEvents.length === 0 ? (
 <p className="text-center text-xs text-caption py-8">
 No public events scheduled for {monthLabel}.
 </p>
 ) : (
 <ul className="divide-y divide-line">
 {calendarEvents.map((e) => (
 <li key={e.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div>
 <Link
 href={`/events/${e.slug}`}
 className="font-serif font-bold text-ink hover:text-primary transition-colors text-sm"
 >
 {e.title}
 </Link>
 {e.location && (
 <p className="text-xs text-caption mt-0.5">{e.location}</p>
 )}
 </div>
 <time
 dateTime={e.starts_at}
 className="font-mono text-xs text-caption shrink-0"
 >
 {formatShortDate(e.starts_at)}
 </time>
 </li>
 ))}
 </ul>
 )}
 </div>
 <p className="mt-3 text-center text-[0.68rem] text-caption sm:hidden select-none">
 Swipe left or right across the calendar to switch months
 </p>
 </div>
 )}
 </section>

 {/* PAST EVENTS SECTION */}
 {past.length > 0 && view === "list" && (
 <section aria-labelledby="past-events-heading">
 <div className="hairline-b pb-4">
 <h2 id="past-events-heading" className="font-serif text-display-sm text-caption">
 Past events &amp; ceremonies
 </h2>
 </div>
 <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-80">
 {past.slice(0, 3).map((e) => (
 <Reveal key={e.id}>
 <EventCard event={e} />
 </Reveal>
 ))}
 </div>
 </section>
 )}
 </PageSection>
 );
}
