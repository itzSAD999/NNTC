"use client";

import { ChevronDown, ChevronRight, FileText, Menu, Search, Shield, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
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
  const logoUrl = getStoragePublicUrl(settings.logo_url) ?? "/images/nmtc-crest.svg";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    setCampusOpen(false);
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-md">
      <div className="section-grid flex h-[4.25rem] items-center justify-between gap-4 xl:gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 text-ink transition-colors hover:text-primary"
        >
          <Image
            src={logoUrl}
            alt={`${settings.college_name} crest`}
            width={40}
            height={40}
            unoptimized={logoUrl.endsWith(".svg")}
            className="h-10 w-10 shrink-0 rounded object-contain"
          />
          <span className="leading-tight">
            <span className="block font-serif text-base font-medium md:text-lg">
              NMTC
            </span>
            <span className="hidden whitespace-nowrap text-[0.6rem] uppercase tracking-[0.1em] text-caption 2xl:block">
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
                      "inline-flex whitespace-nowrap items-center gap-1 rounded px-2.5 py-2 text-sm font-medium transition-colors xl:px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
                  "whitespace-nowrap rounded px-2.5 py-2 text-sm font-medium transition-colors xl:px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
            className="hamburger-button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Backdrop Overlay */}
      {open ? (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      {/* Mobile Navigation Panel */}
      <div
        id="mobile-nav"
        className={cn(
          "mobile-nav-panel",
          open ? "block" : "hidden"
        )}
      >
        <nav aria-label="Mobile navigation" className="section-grid py-4 space-y-4">
          {/* Primary Institutional Links */}
          <div className="space-y-1">
            <p className="mobile-nav-group-title">Academics &amp; Admissions</p>
            <ul className="flex flex-col gap-0.5">
              {SITE_NAV.filter((item) => !isNavGroup(item)).map((item) => {
                if (isNavGroup(item)) return null;
                const active = isNavActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "mobile-nav-link",
                        active && "mobile-nav-link-active"
                      )}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-line shrink-0" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Campus & Community Group */}
          {SITE_NAV.filter(isNavGroup).map((group) => (
            <div key={group.label} className="border-t border-line/70 pt-3 space-y-1">
              <p className="mobile-nav-group-title">Campus &amp; Community</p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((subItem) => {
                  const active = isNavActive(pathname, subItem.href);
                  return (
                    <li key={subItem.href}>
                      <Link
                        href={subItem.href}
                        className={cn(
                          "mobile-nav-link",
                          active && "mobile-nav-link-active"
                        )}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                      >
                        <span>{subItem.label}</span>
                        <ChevronRight className="h-4 w-4 text-line shrink-0" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Document Services & Action Card */}
          <div className="border-t border-line/70 pt-3 space-y-2">
            <p className="mobile-nav-group-title">Document &amp; Student Services</p>
            <Button asChild className="w-full justify-center">
              <Link href="/request" onClick={() => setOpen(false)}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Request an Academic Document</span>
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/request/track"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded border border-line bg-surface px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-bg hover:text-primary"
              >
                <Search className="h-3.5 w-3.5 text-caption shrink-0" />
                <span>Track Request</span>
              </Link>
              <Link
                href="/verify"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded border border-line bg-surface px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-bg hover:text-primary"
              >
                <Shield className="h-3.5 w-3.5 text-caption shrink-0" />
                <span>Verify Credential</span>
              </Link>
            </div>
          </div>

          {/* Quick Contact & Portal Footer */}
          <div className="border-t border-line/70 pt-3 text-xs text-caption">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {settings.phone_main ? (
                <a
                  href={`tel:${settings.phone_main}`}
                  className="hover:text-primary transition-colors"
                >
                  {settings.phone_main}
                </a>
              ) : null}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="font-medium text-primary hover:text-primary-deep transition-colors ml-auto"
              >
                Staff Portal &rarr;
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
