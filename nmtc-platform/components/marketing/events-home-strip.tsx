import Link from "next/link";

import { EventCard } from "@/components/marketing/event-card";
import { Button } from "@/components/ui/button";
import type { CollegeEvent } from "@/lib/types/expansion";

export function EventsHomeStrip({ events }: { events: CollegeEvent[] }) {
  if (events.length === 0) return null;

  return (
    <section aria-labelledby="events-heading" className="section-grid border-b border-line py-16 md:py-20">
      <div className="hairline-b flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Campus &amp; community</p>
          <h2 id="events-heading" className="mt-3 font-serif text-display-md md:text-display-lg">
            Upcoming events
          </h2>
          <p className="mt-2 text-caption">Open days, ceremonies, and college activities.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/events">View all events</Link>
        </Button>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
