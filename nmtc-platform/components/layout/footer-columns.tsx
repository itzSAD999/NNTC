"use client";

import { useState } from "react";
import Link from "next/link";

const COLUMNS = [
  {
    id: "explore",
    title: "Explore",
    links: [
      { href: "/about", label: "About" },
      { href: "/programs", label: "Programmes" },
      { href: "/campus-life", label: "Campus" },
      { href: "/news", label: "News" },
      { href: "/events", label: "Events" },
      { href: "/gallery", label: "Gallery" },
      { href: "/faculty", label: "Staff" },
    ],
  },
  {
    id: "apply",
    title: "Apply",
    links: [
      { href: "/admissions", label: "Admissions" },
      { href: "/financial-aid", label: "Fees" },
      { href: "/resources", label: "Resources" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    id: "support",
    title: "Support",
    links: [
      { href: "/request", label: "Request a document" },
      { href: "/request/track", label: "Track request" },
      { href: "/verify", label: "Verify" },
      { href: "/login", label: "Staff login" },
    ],
  },
] as const;

export function FooterColumns() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <div className="hidden gap-12 md:grid md:grid-cols-3">
        {COLUMNS.map((column) => (
          <div key={column.id}>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink">
              {column.title}
            </p>
            <ul className="mt-5 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink/80 hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="md:hidden">
        {COLUMNS.map((column) => {
          const open = openId === column.id;
          return (
            <div key={column.id} className="border-b border-ink/20">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : column.id)}
                className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold uppercase tracking-[0.16em] text-ink"
                aria-expanded={open}
              >
                {column.title}
                <span className="text-xl font-light leading-none" aria-hidden>
                  {open ? "–" : "+"}
                </span>
              </button>
              {open ? (
                <ul className="space-y-2.5 pb-4">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-ink/80">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
