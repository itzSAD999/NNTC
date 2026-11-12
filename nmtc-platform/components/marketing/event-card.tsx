import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

import type { CollegeEvent } from "@/lib/types/expansion";
import { formatShortDate, getStoragePublicUrl } from "@/lib/utils/format";

export function EventCard({ event }: { event: CollegeEvent }) {
  const cover = getStoragePublicUrl(event.cover_image_url) ?? "/images/graduation.jpg";
  const dateStr = formatShortDate(event.starts_at);

  const dateObj = new Date(event.starts_at);
  const monthStr = isNaN(dateObj.getTime())
    ? "DATE"
    : dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const dayStr = isNaN(dateObj.getTime())
    ? "•"
    : String(dateObj.getDate()).padStart(2, "0");

  return (
    <article className="group flex flex-col overflow-hidden rounded-none border border-line bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
      {/* Cover Image with Floating Square Date Box */}
      <Link href={`/events/${event.slug}`} className="relative aspect-[16/10] overflow-hidden bg-bg block rounded-none">
        <Image
          src={cover}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Floating Academic Calendar Square */}
        <div className="absolute top-3.5 left-3.5 flex flex-col items-center justify-center rounded-none bg-surface/95 px-3 py-1.5 shadow-md backdrop-blur-md border border-line/60">
          <span className="text-[0.62rem] font-bold tracking-widest text-primary uppercase leading-tight">
            {monthStr}
          </span>
          <span className="font-serif text-lg font-bold text-ink leading-tight">
            {dayStr}
          </span>
        </div>
      </Link>

      {/* Event Details Body */}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider">
          {dateStr}
        </p>

        <h3 className="mt-2 font-serif text-xl font-medium tracking-tight text-ink transition-colors group-hover:text-primary">
          <Link href={`/events/${event.slug}`}>{event.title}</Link>
        </h3>

        {event.description ? (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-caption line-clamp-2">
            {event.description}
          </p>
        ) : null}

        <div className="mt-5 pt-4 border-t border-line/60 flex items-center justify-between text-xs text-caption">
          <span className="flex items-center gap-1.5 truncate max-w-[70%]">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{event.location || "NMTC Great Hall"}</span>
          </span>

          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-deep shrink-0"
          >
            <span>Details</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
