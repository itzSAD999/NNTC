import { Clock, Mail, MapPin, Phone } from "lucide-react";

import type { Settings } from "@/types/database";

interface ContactDetailsProps {
  settings: Settings;
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
                className="rounded border border-line bg-surface p-4"
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
          <div className="mt-4 overflow-hidden rounded border border-line">
            <iframe
              title="NMTC location on Google Maps"
              src={settings.google_maps_url}
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
          <ul className="mt-4 space-y-2 text-sm">
            {settings.facebook_url ? (
              <li>
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
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
                  className="text-primary hover:underline"
                >
                  Instagram
                </a>
              </li>
            ) : null}
            {settings.x_url ? (
              <li>
                <a
                  href={settings.x_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  X (Twitter)
                </a>
              </li>
            ) : null}
            {settings.whatsapp ? (
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      )}
    </div>
  );
}
