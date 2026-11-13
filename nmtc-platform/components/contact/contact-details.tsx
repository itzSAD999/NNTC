import { Clock, Mail, MapPin, Phone } from "lucide-react";

import {
  FacebookMark,
  InstagramMark,
  WhatsAppMark,
  XMark,
} from "@/components/layout/social-icons";
import type { Settings } from "@/types/database";

interface ContactDetailsProps {
 settings: Settings;
}

function toEmbedMapUrl(raw: string): string {
 try {
 const parsed = new URL(raw);
 if (
 (parsed.hostname.includes("google.com") || parsed.hostname.includes("maps.google.")) &&
 !parsed.pathname.includes("/maps/embed") &&
 !parsed.searchParams.has("output")
 ) {
 if (parsed.pathname === "/" || parsed.pathname === "") {
 parsed.pathname = "/maps";
 }
 parsed.searchParams.set("output", "embed");
 return parsed.toString();
 }
 } catch {
 // Keep original string if not a valid URL
 }
 return raw;
}

export function ContactDetails({ settings }: ContactDetailsProps) {
 const offices = [
 {
 label: "Main office",
 phone: settings.phone_main,
 email: settings.email_main,
 },
 {
 label: "Admissions",
 phone: settings.phone_admissions,
 email: settings.email_admissions,
 },
 {
 label: "Finance",
 phone: settings.phone_finance,
 email: settings.email_finance,
 },
 ].filter((o) => o.phone || o.email);

 return (
 <div className="space-y-8">
 {settings.address ? (
 <div>
 <h2 className="font-serif text-display-sm">Visit us</h2>
 <p className="mt-3 flex gap-2 text-sm text-caption">
 <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
 {settings.address}
 </p>
 </div>
 ) : null}

 {offices.length > 0 ? (
 <div>
 <h2 className="font-serif text-display-sm">Contact by office</h2>
 <ul className="mt-4 space-y-4">
 {offices.map((office) => (
 <li
 key={office.label}
 className="rounded-none border border-line bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
 >
 <p className="text-xs font-medium uppercase tracking-widest text-primary">
 {office.label}
 </p>
 <div className="mt-2 space-y-1 text-sm text-caption">
 {office.phone ? (
 <p className="flex gap-2">
 <Phone className="h-4 w-4 shrink-0" aria-hidden />
 <a href={`tel:${office.phone}`} className="hover:text-ink">
 {office.phone}
 </a>
 </p>
 ) : null}
 {office.email ? (
 <p className="flex gap-2">
 <Mail className="h-4 w-4 shrink-0" aria-hidden />
 <a
 href={`mailto:${office.email}`}
 className="hover:text-ink"
 >
 {office.email}
 </a>
 </p>
 ) : null}
 </div>
 </li>
 ))}
 </ul>
 </div>
 ) : null}

 {settings.office_hours ? (
 <div>
 <h2 className="font-serif text-display-sm">Office hours</h2>
 <p className="mt-3 flex gap-2 text-sm text-caption">
 <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
 {settings.office_hours}
 </p>
 </div>
 ) : null}

 {settings.google_maps_url ? (
 <div>
 <h2 className="font-serif text-display-sm">Location</h2>
 <div className="mt-4 overflow-hidden rounded-none border border-line shadow-sm">
 <iframe
 title="NMTC location on Google Maps"
 src={toEmbedMapUrl(settings.google_maps_url)}
 className="aspect-[4/3] w-full"
 loading="lazy"
 referrerPolicy="no-referrer-when-downgrade"
 allowFullScreen
 />
 </div>
 </div>
 ) : null}

 {(settings.facebook_url ||
 settings.instagram_url ||
 settings.x_url ||
 settings.whatsapp) && (
 <div>
 <h2 className="font-serif text-display-sm">Follow us</h2>
 <ul className="mt-4 grid gap-2 sm:grid-cols-2">
 {settings.facebook_url ? (
 <li>
 <a
 href={settings.facebook_url}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-3 border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink hover:border-primary"
 >
 <span className="flex h-9 w-9 items-center justify-center bg-[#1877F2] text-white" aria-hidden>
 <FacebookMark className="h-4 w-4" />
 </span>
 Facebook
 </a>
 </li>
 ) : null}
 {settings.instagram_url ? (
 <li>
 <a
 href={settings.instagram_url}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-3 border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink hover:border-primary"
 >
 <span className="flex h-9 w-9 items-center justify-center bg-[#E4405F] text-white" aria-hidden>
 <InstagramMark className="h-4 w-4" />
 </span>
 Instagram
 </a>
 </li>
 ) : null}
 {settings.whatsapp ? (
 <li>
 <a
 href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-3 border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink hover:border-primary"
 >
 <span className="flex h-9 w-9 items-center justify-center bg-[#25D366] text-white" aria-hidden>
 <WhatsAppMark className="h-4 w-4" />
 </span>
 WhatsApp
 </a>
 </li>
 ) : null}
 {settings.x_url ? (
 <li>
 <a
 href={settings.x_url}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-3 border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink hover:border-primary"
 >
 <span className="flex h-9 w-9 items-center justify-center bg-ink text-white" aria-hidden>
 <XMark className="h-4 w-4" />
 </span>
 X
 </a>
 </li>
 ) : null}
 </ul>
 </div>
 )}
 </div>
 );
}
