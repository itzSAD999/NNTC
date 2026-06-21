import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

import type { CollegeEvent } from "@/lib/types/expansion";
import { formatShortDate, getStoragePublicUrl } from "@/lib/utils/format";

export function EventCard({ event }: { event: CollegeEvent }) {
  const cover = getStoragePublicUrl(event.cover_image_url);
  const date = formatShortDate(event.starts_at);

  return (
    <article className="flex flex-col overflow-hidden rounded border border-line bg-surface transition-shadow hover:shadow-sm">
      <Link href={`/events/${event.slug}`} className="relative block aspect-[16/9] bg-bg">
        {cover ? (
          <Image src={cover} alt="" fill className="object-cover" sizes="33vw" />
        ) : (
          <div className="flex h-full items-end p-4">
            <Calendar className="h-8 w-8 text-primary/40" aria-hidden />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <time dateTime={event.starts_at} className="text-xs font-medium uppercase tracking-wider text-primary">
          {date}
        </time>
        <h2 className="mt-2 font-serif text-lg">
          <Link href={`/events/${event.slug}`} className="text-ink hover:text-primary">
            {event.title}
          </Link>
        </h2>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-caption">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          {event.location}
        </p>
      </div>
    </article>
  );
}
