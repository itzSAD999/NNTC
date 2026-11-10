import Link from "next/link";

const UTILITY_LINKS = [
  { href: "/request/track", label: "Track request" },
  { href: "/verify", label: "Verify document" },
  { href: "/resources", label: "Student resources" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Staff login" },
] as const;

export function SiteUtilityBar() {
  return (
    <div className="border-b border-line bg-primary-deep text-white">
      <div className="section-grid flex h-9 items-center justify-between gap-4 text-xs">
        <p className="hidden truncate font-medium tracking-wide sm:block">
          Nandom Nursing and Midwifery Training College
        </p>
        <nav aria-label="Utility navigation" className="ml-auto">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {UTILITY_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-deep"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
