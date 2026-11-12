import Link from "next/link";

const UTILITY_LINKS = [
  { href: "/request/track", label: "Track request" },
  { href: "/verify", label: "Verify document" },
  { href: "/resources", label: "Student resources" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Staff login" },
] as const;

export function SiteUtilityBar() {
  // Utility links are now integrated directly into the Harvard-style header search & menu drawer
  return null;
}
