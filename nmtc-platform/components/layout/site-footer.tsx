import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import type { Settings } from "@/types/database";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programmes" },
  { href: "/admissions", label: "Admissions" },
  { href: "/faculty", label: "Staff" },
  { href: "/campus-life", label: "Campus life" },
  { href: "/gallery", label: "Gallery" },
  { href: "/events", label: "Events" },
  { href: "/resources", label: "Resources" },
  { href: "/financial-aid", label: "Fees & Aid" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
  { href: "/request/track", label: "Track Request" },
  { href: "/login", label: "Staff Login" },
] as const;

interface SiteFooterProps {
  settings: Settings;
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="section-grid py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-serif text-display-sm text-ink">
              {settings.college_name}
            </p>
            {settings.motto ? (
              <p className="mt-3 max-w-md text-sm text-caption">
                {settings.motto}
              </p>
            ) : null}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-sm text-caption">
              {settings.address ? (
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>{settings.address}</span>
                </li>
              ) : null}
              {settings.phone_main ? (
                <li className="flex gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <a
                    href={`tel:${settings.phone_main}`}
                    className="hover:text-ink"
                  >
                    {settings.phone_main}
                  </a>
                </li>
              ) : null}
              {settings.email_main ? (
                <li className="flex gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <a
                    href={`mailto:${settings.email_main}`}
                    className="hover:text-ink"
                  >
                    {settings.email_main}
                  </a>
                </li>
              ) : null}
              {settings.office_hours ? (
                <li className="pt-1 text-xs">{settings.office_hours}</li>
              ) : null}
            </ul>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Quick links
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-caption transition-colors hover:text-ink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {(settings.facebook_url ||
          settings.instagram_url ||
          settings.x_url) && (
          <div className="mt-8 flex gap-4">
            {settings.facebook_url ? (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-caption hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </a>
            ) : null}
            {settings.instagram_url ? (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-caption hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </a>
            ) : null}
            {settings.x_url ? (
              <a
                href={settings.x_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="text-caption hover:text-primary"
              >
                <span className="text-sm font-semibold">𝕏</span>
              </a>
            ) : null}
          </div>
        )}

        <div className="hairline mt-10 pt-6">
          <p className="text-xs text-caption">
            © {year} {settings.college_name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
