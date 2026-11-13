import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { MEDIA } from "@/lib/media";
import type { CollegeEvent } from "@/lib/types/expansion";
import { formatShortDate, getStoragePublicUrl } from "@/lib/utils/format";

export function EventCard({ event }: { event: CollegeEvent }) {
 const cover = getStoragePublicUrl(event.cover_image_url) ?? MEDIA.graduation;
 const dateStr = formatShortDate(event.starts_at);
 const dateObj = new Date(event.starts_at);
 const monthStr = isNaN(dateObj.getTime())
 ? "DATE"
 : dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
 const dayStr = isNaN(dateObj.getTime())
 ? "•"
 : String(dateObj.getDate()).padStart(2, "0");

 return (
 <article className="group flex flex-col overflow-hidden rounded-none border border-line bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
 <Link href={`/events/${event.slug}`} className="card-photo relative aspect-[16/10] block">
 <Image
 src={cover}
 alt=""
 fill
 className="object-cover transition-transform duration-700 group-hover:scale-105"
 sizes="(max-width: 768px) 100vw, 33vw"
 />
 <div className="absolute left-3 top-3 z-10 flex flex-col items-center rounded-none bg-white px-3 py-1.5 shadow-md">
 <span className="text-[0.62rem] font-bold uppercase tracking-widest text-primary">{monthStr}</span>
 <span className="font-serif text-lg font-bold leading-tight text-ink">{dayStr}</span>
 </div>
 </Link>

 <div className="flex flex-1 flex-col p-6">
 <p className="text-xs font-semibold uppercase tracking-wider text-primary">{dateStr}</p>
 <h3 className="mt-2 font-serif text-xl text-ink group-hover:text-primary">
 <Link href={`/events/${event.slug}`}>{event.title}</Link>
 </h3>
 {event.description ? (
 <p className="mt-2 line-clamp-2 flex-1 text-sm text-caption">{event.description}</p>
 ) : null}
 <div className="mt-5 flex items-center justify-between text-xs text-caption">
 <span className="flex max-w-[70%] items-center gap-1.5 truncate">
 <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
 <span className="truncate">{event.location || "NMTC campus"}</span>
 </span>
 <Link href={`/events/${event.slug}`} className="inline-flex items-center gap-1 font-semibold text-primary">
 Details
 <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
 </Link>
 </div>
 </div>
 </article>
 );
}
