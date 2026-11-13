"use client";

import Link from "next/link";

import { useNavTheme } from "@/components/layout/nav-theme";
import { cn } from "@/lib/utils";

const UTILITY_LINKS = [
  { href: "/request", label: "Request a document" },
  { href: "/request/track", label: "Track request" },
  { href: "/verify", label: "Verify" },
  { href: "/resources", label: "Student resources" },
  { href: "/login", label: "Staff login" },
] as const;

export function SiteUtilityBar() {
  const theme = useNavTheme();
  const onDark = theme !== "light";

  return (
    <div
      className={cn(
        "border-b text-[0.7rem] font-medium transition-colors duration-300",
        theme === "hero" && "border-white/15 bg-black/35 text-white",
        theme === "dark" && "border-white/10 bg-[#111] text-white",
        theme === "light" && "border-line bg-white text-ink"
      )}
    >
      <div className="section-grid flex flex-wrap items-center justify-end gap-x-4 gap-y-1 py-1.5">
        {UTILITY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              onDark ? "text-white/80 hover:text-white" : "text-caption hover:text-ink"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
