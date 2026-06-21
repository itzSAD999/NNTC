"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getStoragePublicUrl } from "@/lib/utils/format";
import type { Settings } from "@/types/database";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programmes" },
  { href: "/admissions", label: "Admissions" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
] as const;

interface SiteHeaderProps {
  settings: Settings;
}

export function SiteHeader({ settings }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const logoUrl = getStoragePublicUrl(settings.logo_url);
  const shortName = settings.college_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 4);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="section-grid flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 font-serif text-lg font-medium text-ink transition-colors hover:text-primary"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded border border-line bg-bg text-xs font-semibold text-primary"
            >
              {shortName}
            </span>
          )}
          <span className="hidden sm:inline">NMTC</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 lg:flex"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded text-sm text-caption transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/request">Request a Document</Link>
          </Button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-line text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-line bg-surface lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav aria-label="Mobile navigation" className="section-grid py-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block min-h-11 rounded px-3 py-2.5 text-sm text-ink hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-line pt-3">
              <Button asChild className="w-full">
                <Link href="/request" onClick={() => setOpen(false)}>
                  Request a Document
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
