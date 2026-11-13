import Image from "next/image";
import Link from "next/link";
import { Calendar, ExternalLink, MapPin } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import type { CollegeEvent } from "@/lib/types/expansion";
import { formatDate, getStoragePublicUrl } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";

export function EventDetailView({ event }: { event: CollegeEvent }) {
 const cover = getStoragePublicUrl(event.cover_image_url);

 return (
 <Reveal className="section-grid py-12 md:py-16">
 <div className="max-w-3xl">
 <p className="text-xs font-medium uppercase tracking-widest text-primary">
 {event.is_past ? "Past event" : "Upcoming event"}
 </p>
 <h1 className="mt-2 font-serif text-display-lg">{event.title}</h1>
 <dl className="mt-6 space-y-3 text-sm text-caption">
 <div className="flex items-start gap-2">
 <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
 <div>
 <dt className="sr-only">Date</dt>
 <dd>{formatDate(event.starts_at)}</dd>
 {event.ends_at ? (
 <dd className="text-xs">Until {formatDate(event.ends_at)}</dd>
 ) : null}
 </div>
 </div>
 <div className="flex items-start gap-2">
 <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
 <div>
 <dt className="sr-only">Location</dt>
 <dd>{event.location}</dd>
 </div>
 </div>
 </dl>
 </div>

 {cover ? (
 <div className="relative mt-10 aspect-[21/9] max-w-4xl overflow-hidden rounded border border-line">
 <Image src={cover} alt="" fill className="object-cover" sizes="80vw" priority />
 </div>
 ) : null}

 <div className="prose-nmtc mt-10 max-w-3xl whitespace-pre-wrap text-caption">
 {event.description}
 </div>

 {event.registration_url ? (
 <div className="mt-8">
 <Button asChild>
 <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
 Register
 <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
 </a>
 </Button>
 </div>
 ) : null}

 <p className="mt-12">
 <Link href="/events" className="text-sm font-medium text-primary hover:underline">
 ← All events
 </Link>
 </p>
 </Reveal>
 );
}
