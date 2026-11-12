"use client";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  FileCheck2,
  FileText,
  GraduationCap,
  HelpCircle,
  Image as ImageIcon,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getStoragePublicUrl } from "@/lib/utils/format";
import type { Settings } from "@/types/database";

interface SiteHeaderProps {
  settings: Settings;
}

const SEARCH_QUICK_LINKS = [
  { href: "/programs", label: "All Programmes & Curricula", category: "Academics" },
  { href: "/programs/diploma-in-registered-general-nursing", label: "Diploma in General Nursing (RGN)", category: "Programmes" },
  { href: "/programs/registered-midwifery-post-nurse", label: "Registered Midwifery (Post-Nurse)", category: "Programmes" },
  { href: "/admissions", label: "2026/2027 Admissions Guide", category: "Admissions" },
  { href: "/request", label: "Request an Academic Document", category: "Services" },
  { href: "/request/track", label: "Track Document Request Status", category: "Services" },
  { href: "/verify", label: "Verify Credential via QR / Code", category: "Verification" },
  { href: "/financial-aid", label: "Fee Schedules & Payment Info", category: "Finance" },
  { href: "/faculty", label: "Faculty & Staff Directory", category: "Campus" },
  { href: "/resources", label: "Student Handbook & Logbooks", category: "Resources" },
  { href: "/news", label: "News & College Bulletins", category: "Gazette" },
  { href: "/contact", label: "Campus Contacts & Directions", category: "Contact" },
];

export function SiteHeader({ settings }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const logoUrl = getStoragePublicUrl(settings.logo_url) ?? "/images/nmtc-crest.svg";

  // Prevent background scroll when modal or menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  // Handle ESC key to dismiss
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }
    if (menuOpen || searchOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, searchOpen]);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const filteredLinks = searchQuery.trim()
    ? SEARCH_QUICK_LINKS.filter(
        (link) =>
          link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          link.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_QUICK_LINKS;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink text-white backdrop-blur-md shadow-md">
        <div className="section-grid flex h-[4.5rem] items-center justify-between gap-4">
          {/* Brand — Institutional Crest & Editorial Title */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 text-white transition-opacity hover:opacity-90"
          >
            <Image
              src={logoUrl}
              alt={`${settings.college_name} crest`}
              width={40}
              height={40}
              unoptimized={logoUrl.endsWith(".svg")}
              className="h-10 w-10 shrink-0 rounded object-contain drop-shadow"
            />
            <span className="leading-tight">
              <span className="block font-serif text-base sm:text-lg font-bold tracking-tight text-white">
                NANDOM NMTC
              </span>
              <span className="block whitespace-nowrap text-[0.62rem] uppercase tracking-[0.14em] text-white/70">
                Nursing &amp; Midwifery College
              </span>
            </span>
          </Link>

          {/* Harvard Center Announcement Ticker */}
          <div className="hidden lg:flex items-center gap-2 text-xs xl:text-sm text-white/90 truncate max-w-xl">
            <span className="h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse" />
            <Link
              href="/admissions"
              className="truncate hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Admissions Open: 2026/2027 Academic Year Nursing &amp; Midwifery Intake
            </Link>
          </div>

          {/* Harvard Right Action Buttons: Search + Menu */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setMenuOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-all hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Search NMTC"
            >
              <Search className="h-4 w-4 text-white/80" />
              <span>Search</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v);
                setSearchOpen(false);
              }}
              className="inline-flex items-center gap-2.5 rounded border border-white/20 bg-white/5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-all hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-expanded={menuOpen}
              aria-controls="mega-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <>
                  <X className="h-4 w-4" />
                  <span>Close</span>
                </>
              ) : (
                <>
                  {/* Two clean horizontal lines matching Harvard style */}
                  <span className="flex flex-col gap-1 w-4" aria-hidden>
                    <span className="h-0.5 w-full bg-white rounded-full"></span>
                    <span className="h-0.5 w-full bg-white rounded-full"></span>
                  </span>
                  <span>Menu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          Harvard-Style Institutional Mega-Menu Drawer
          ========================================================================= */}
      {menuOpen ? (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 top-[4.5rem] z-40 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Mega-Menu Panel */}
          <div
            id="mega-menu"
            className="fixed inset-x-0 top-[4.5rem] z-50 max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-line bg-surface text-ink shadow-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="section-grid py-8 sm:py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
                {/* Column 1: Academics & Admissions */}
                <div className="space-y-4">
                  <div className="hairline-b pb-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      Academics &amp; Admissions
                    </p>
                  </div>
                  <ul className="space-y-1 text-sm font-medium">
                    <li>
                      <Link
                        href="/programs"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span>Programmes &amp; Curricula</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admissions"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span>Admissions 2026/2027</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/financial-aid"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <FileCheck2 className="h-4 w-4 text-primary" />
                          <span>Fees &amp; Financial Aid</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Shield className="h-4 w-4 text-primary" />
                          <span>About NMTC Leadership &amp; History</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Campus Life & Community */}
                <div className="space-y-4">
                  <div className="hairline-b pb-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      Campus Life &amp; Faculty
                    </p>
                  </div>
                  <ul className="space-y-1 text-sm font-medium">
                    <li>
                      <Link
                        href="/faculty"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Users className="h-4 w-4 text-primary" />
                          <span>Faculty &amp; Lecturers</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/campus-life"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <UserCheck className="h-4 w-4 text-primary" />
                          <span>Campus Life &amp; Facilities</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/gallery"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <ImageIcon className="h-4 w-4 text-primary" />
                          <span>Photo &amp; Media Gallery</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/events"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>College Events &amp; Ceremonies</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/news"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Newspaper className="h-4 w-4 text-primary" />
                          <span>The NMTC Gazette (News)</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Student Services & Verification */}
                <div className="space-y-4">
                  <div className="hairline-b pb-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      Student Services &amp; Documents
                    </p>
                  </div>
                  <ul className="space-y-1 text-sm font-medium">
                    <li>
                      <Link
                        href="/request"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>Request an Academic Document</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/request/track"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Search className="h-4 w-4 text-primary" />
                          <span>Track Submitted Request</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/verify"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          <span>Verify Official Credential (QR)</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/resources"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <HelpCircle className="h-4 w-4 text-primary" />
                          <span>Student Handbook &amp; Downloads</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded p-2 text-ink hover:bg-bg hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>Contact NMTC Administration</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-caption" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Banner inside Mega Menu */}
              <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs text-caption">
                  {settings.phone_main ? (
                    <a
                      href={`tel:${settings.phone_main}`}
                      className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>{settings.phone_main}</span>
                    </a>
                  ) : null}
                  {settings.email_main ? (
                    <a
                      href={`mailto:${settings.email_main}`}
                      className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>{settings.email_main}</span>
                    </a>
                  ) : null}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/request" onClick={() => setMenuOpen(false)}>
                      Request a Document
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link href="/login" onClick={() => setMenuOpen(false)}>
                      Staff Portal
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* =========================================================================
          Harvard-Style Search Modal Dialog
          ========================================================================= */}
      {searchOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setSearchOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-2xl rounded-xl border border-line bg-surface p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5 text-ink">
                <Search className="h-5 w-5 text-primary" />
                <span className="font-serif font-bold text-lg">Search NMTC</span>
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded p-1 text-caption hover:bg-bg hover:text-ink transition-colors"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search programmes, admissions, tracking ID, resources..."
                className="w-full rounded border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-caption focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>

            <div className="mt-4 max-h-72 overflow-y-auto divide-y divide-line/60">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between py-2.5 px-3 rounded hover:bg-bg transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink group-hover:text-primary transition-colors">
                        {item.label}
                      </p>
                      <p className="text-[0.7rem] text-caption uppercase tracking-wider">
                        {item.category}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-caption group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-caption">
                  No matching pages found for &ldquo;{searchQuery}&rdquo;.
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs text-caption">
              <span>Press <kbd className="rounded bg-bg border border-line px-1.5 py-0.5 font-mono">ESC</kbd> to exit</span>
              <Link
                href="/request/track"
                onClick={() => setSearchOpen(false)}
                className="text-primary hover:underline"
              >
                Track a Document Request &rarr;
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
