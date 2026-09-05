"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  flattenSiteNav,
  isGroupActive,
  isNavActive,
  isNavGroup,
  SITE_NAV,
} from "@/components/layout/site-nav";
import { cn } from "@/lib/utils";
import { getStoragePublicUrl } from "@/lib/utils/format";
import type { Settings } from "@/types/database";

interface SiteHeaderProps {
  settings: Settings;
}

export function SiteHeader({ settings }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [campusOpen, setCampusOpen] = useState(false);
  const pathname = usePathname();
  const logoUrl = getStoragePublicUrl(settings.logo_url);
  const shortName = settings.college_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 4);

  const mobileLinks = flattenSiteNav();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setCampusOpen(false);
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/98 backdrop-blur-md">
      <div className="section-grid flex h-[4.25rem] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 text-ink transition-colors hover:text-primary"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 object-contain"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-line bg-bg text-xs font-semibold text-primary"
            >
              {shortName}
            </span>
          )}
          <span className="min-w-0 leading-tight">
            <span className="block font-serif text-base font-medium md:text-lg">
              NMTC
            </span>
            <span className="hidden text-[0.65rem] uppercase tracking-[0.14em] text-caption lg:block">
              Nursing &amp; Midwifery Training College
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {SITE_NAV.map((item) => {
            if (isNavGroup(item)) {
              const active = isGroupActive(pathname, item.items);
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setCampusOpen(true)}
                  onMouseLeave={() => setCampusOpen(false)}
                >
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1 rounded px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      active
                        ? "bg-bg text-ink"
                        : "text-caption hover:bg-bg hover:text-ink"
                    )}
                    aria-expanded={campusOpen}
                    aria-haspopup="true"
                    onClick={() => setCampusOpen((v) => !v)}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  </button>
                  {campusOpen ? (
                    <div className="absolute left-0 top-full z-50 min-w-[15rem] border border-line bg-surface py-2 shadow-md">
                      {item.items.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "block px-4 py-2.5 text-sm transition-colors hover:bg-bg",
                            isNavActive(pathname, link.href)
                              ? "font-medium text-ink"
                              : "text-caption"
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }

            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  active
                    ? "bg-bg text-ink"
                    : "text-caption hover:bg-bg hover:text-ink"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
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
            {mobileLinks.map(({ href, label }) => {
              const active = isNavActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "block min-h-11 rounded px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "bg-bg font-medium text-ink"
                        : "text-caption hover:bg-bg hover:text-ink"
                    )}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
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
