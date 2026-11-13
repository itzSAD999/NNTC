"use client";

import {
 ArrowRight,
 ChevronRight,
 Search,
 X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useNavTheme } from "@/components/layout/nav-theme";
import { cn } from "@/lib/utils";
import { getStoragePublicUrl } from "@/lib/utils/format";
import type { Settings } from "@/types/database";

interface SiteHeaderProps {
 settings: Settings;
}

interface MenuCategory {
 id: string;
 label: string;
 title: string;
 href: string;
 description: string;
 sublinks: { label: string; href: string; hasArrow?: boolean }[];
}

const HARVARD_MENU_CATEGORIES: MenuCategory[] = [
 {
 id: "academics",
 label: "Academics",
 title: "Academics",
 href: "/programs",
 description:
 "Learning at Nandom NMTC combines rigorous clinical discipline, modern skills simulation, and compassionate healthcare education for Ghana's next generation.",
 sublinks: [
 { label: "Degree & Diploma Programs", href: "/programs", hasArrow: true },
 {
 label: "Diploma in Registered General Nursing (RGN)",
 href: "/programs/diploma-in-registered-general-nursing",
 },
 {
 label: "Registered Midwifery (Post-Nurse)",
 href: "/programs/registered-midwifery-post-nurse",
 },
 { label: "Academic Calendar & Schedules", href: "/resources" },
 { label: "Clinical Practicum & Hospital Postings", href: "/campus-life" },
 ],
 },
 {
 id: "campus",
 label: "Campus",
 title: "Campus Life",
 href: "/campus-life",
 description:
 "A vibrant, disciplined academic and residential community situated in the historic Nandom district of the Upper West Region.",
 sublinks: [
 { label: "Campus Life & Hostels", href: "/campus-life", hasArrow: true },
 { label: "Faculty & Staff Directory", href: "/faculty" },
 { label: "Media & Event Gallery", href: "/gallery" },
 { label: "College Events & Ceremonies", href: "/events" },
 { label: "Student Handbook & Downloads", href: "/resources" },
 ],
 },
 {
 id: "in-focus",
 label: "In Focus",
 title: "In Focus",
 href: "/news",
 description:
 "The latest bulletins, healthcare achievements, clinical milestones, and community outreach published by the NMTC Gazette.",
 sublinks: [
 { label: "The NMTC Gazette", href: "/news", hasArrow: true },
 { label: "Upcoming Events & Ceremonies", href: "/events" },
 { label: "Community Health Outreach", href: "/news" },
 { label: "Principal's Termly Address", href: "/about" },
 ],
 },
 {
 id: "admissions",
 label: "Admissions",
 title: "Admissions & Aid",
 href: "/admissions",
 description:
 "Everything prospective students need to know — entry requirements, Ministry of Health guidelines, deadlines, and financial aid.",
 sublinks: [
 { label: "2026/2027 Admissions Guide", href: "/admissions", hasArrow: true },
 { label: "WASSCE & SSCCE Entry Requirements", href: "/admissions" },
 { label: "Tuition & Fee Schedules", href: "/financial-aid" },
 { label: "Scholarships & Financial Aid", href: "/financial-aid" },
 { label: "Admissions FAQs", href: "/admissions" },
 ],
 },
 {
 id: "services",
 label: "Services",
 title: "Document Services",
 href: "/request",
 description:
 "Direct digital services for current students, alumni, and partner healthcare institutions — certified transcripts, letters, and QR verification.",
 sublinks: [
 { label: "Request an Academic Document", href: "/request", hasArrow: true },
 { label: "Track Submitted Request", href: "/request/track" },
 { label: "Verify Credential via QR", href: "/verify" },
 { label: "Student Resources Library", href: "/resources" },
 { label: "Staff & Administration Portal", href: "/login" },
 ],
 },
];

const QUICK_LINKS = [
 { label: "Request Documents", href: "/request" },
 { label: "Track Request", href: "/request/track" },
 { label: "Verify QR Code", href: "/verify" },
 { label: "Admissions", href: "/admissions" },
 { label: "Events", href: "/events" },
 { label: "Media Gallery", href: "/gallery" },
 { label: "Staff Login", href: "/login" },
 { label: "Emergency & Contact", href: "/contact" },
];

const SEARCH_QUICK_LINKS = [
 { href: "/programs", label: "All Programmes & Curricula", category: "Academics" },
 {
 href: "/programs/diploma-in-registered-general-nursing",
 label: "Diploma in General Nursing (RGN)",
 category: "Programmes",
 },
 {
 href: "/programs/registered-midwifery-post-nurse",
 label: "Registered Midwifery (Post-Nurse)",
 category: "Programmes",
 },
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
 const [activeCategoryId, setActiveCategoryId] = useState<string>("academics");
 const [searchOpen, setSearchOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");
 const pathname = usePathname();
 const theme = useNavTheme();
 const onDark = theme !== "light";
 const logoUrl = getStoragePublicUrl(settings.logo_url) ?? "/images/nmtc-crest.svg";

 // Check URL params on client mount (e.g. ?menu=open or ?cat=campus)
 useEffect(() => {
 const params = new URLSearchParams(window.location.search);
 if (params.get("menu") === "open") {
 setMenuOpen(true);
 }
 const cat = params.get("cat");
 if (cat) {
 setActiveCategoryId(cat);
 }
 }, []);

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

 // Close menus only when navigating to a new route
 const [prevPath, setPrevPath] = useState(pathname);
 useEffect(() => {
 if (prevPath !== pathname) {
 setMenuOpen(false);
 setSearchOpen(false);
 setPrevPath(pathname);
 }
 }, [pathname, prevPath]);

 const activeCategory =
 HARVARD_MENU_CATEGORIES.find((c) => c.id === activeCategoryId) ??
 HARVARD_MENU_CATEGORIES[0];

 const filteredLinks = searchQuery.trim()
 ? SEARCH_QUICK_LINKS.filter(
 (link) =>
 link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
 link.category.toLowerCase().includes(searchQuery.toLowerCase())
 )
 : SEARCH_QUICK_LINKS.slice(0, 6);

 return (
 <>
 {/* =========================================================================
 Top Institutional Header Bar (Harvard Style)
 ========================================================================= */}
 <header
 className={cn(
 "sticky top-0 z-50 overflow-hidden border-b transition-colors duration-300",
 theme === "hero" && "border-white/10 bg-[#111] text-white",
 theme === "dark" && "border-white/10 bg-[#111] text-white",
 theme === "light" && "border-line bg-white text-ink"
 )}
 >
 <div className="mx-auto flex h-16 w-full max-w-content flex-nowrap items-center gap-3 px-4 sm:px-6 lg:px-8">
 <Link
 href="/"
 className={cn(
 "flex min-w-0 shrink-0 items-center gap-3 transition-opacity hover:opacity-90",
 onDark ? "text-white" : "text-ink"
 )}
 >
 <Image
 src={logoUrl}
 alt={`${settings.college_name} crest`}
 width={40}
 height={40}
 unoptimized={logoUrl.endsWith(".svg")}
 className="h-10 w-10 shrink-0 rounded-none object-contain"
 />
 <span className="leading-tight">
 <span className={cn("block font-serif text-base font-bold tracking-tight sm:text-lg", onDark ? "text-white" : "text-primary")}>
 NANDOM NMTC
 </span>
 <span className={cn("hidden whitespace-nowrap text-[0.62rem] uppercase tracking-[0.14em] sm:block", onDark ? "text-white/70" : "text-caption")}>
 Nursing &amp; Midwifery College
 </span>
 </span>
 </Link>

 <nav
 aria-label="Primary"
 className={cn(
 "ml-auto hidden min-w-0 items-center justify-end gap-x-5 overflow-hidden text-sm font-medium xl:flex",
 onDark ? "text-white/90" : "text-ink/80"
 )}
 >
 {[
 ["/about", "About"],
 ["/programs", "Programmes"],
 ["/admissions", "Admissions"],
 ["/financial-aid", "Fees"],
 ["/campus-life", "Campus"],
 ["/news", "News"],
 ["/contact", "Contact"],
 ].map(([href, label]) => (
 <Link
 key={href}
 href={href}
 className={cn(
 "whitespace-nowrap py-1 transition-colors",
 onDark ? "hover:text-white" : "hover:text-primary"
 )}
 >
 {label}
 </Link>
 ))}
 </nav>

 <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-0">
 <button
 type="button"
 onClick={() => {
 setSearchOpen(true);
 setMenuOpen(false);
 }}
 className={cn(
 "inline-flex h-10 w-10 items-center justify-center rounded-none border transition",
 onDark
 ? "border-white/25 text-white hover:border-white"
 : "border-line text-ink hover:border-primary hover:text-primary"
 )}
 aria-label="Search NMTC"
 >
 <Search className="h-4 w-4" />
 </button>

 <button
 type="button"
 onClick={() => {
 setMenuOpen((open) => !open);
 setSearchOpen(false);
 }}
 className="inline-flex items-center gap-2.5 rounded-none bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-deep sm:px-3.5 sm:py-2 sm:text-sm"
 aria-expanded={menuOpen}
 aria-controls="harvard-fullscreen-menu"
 aria-label={menuOpen ? "Close menu" : "Open menu"}
 >
 <span className="relative h-3.5 w-4" aria-hidden>
 <span className={`absolute left-0 h-0.5 w-full bg-white transition-transform duration-200 ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
 <span className={`absolute left-0 top-1.5 h-0.5 w-full bg-white transition-opacity duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
 <span className={`absolute left-0 h-0.5 w-full bg-white transition-transform duration-200 ${menuOpen ? "top-1.5 -rotate-45" : "top-3"}`} />
 </span>
 <span>{menuOpen ? "Close" : "Menu"}</span>
 </button>
 </div>
 </div>
 </header>

 {/* =========================================================================
 Exact Harvard Full-Screen Interactive Menu Drawer
 ========================================================================= */}
 {menuOpen ? (
 <div
 id="harvard-fullscreen-menu"
 className="fixed inset-0 z-[100] flex flex-col justify-between overflow-y-auto bg-primary-deep text-white animate-in fade-in duration-200"
 >
 {/* Top Bar inside Menu */}
 <div className="section-grid flex h-[4.5rem] items-center justify-between border-b border-white/10 shrink-0">
 <Link
 href="/"
 onClick={() => setMenuOpen(false)}
 className="flex items-center gap-3 text-white"
 >
 <Image
 src={logoUrl}
 alt={`${settings.college_name} crest`}
 width={36}
 height={36}
 unoptimized={logoUrl.endsWith(".svg")}
 className="h-9 w-9 object-contain"
 />
 <span className="leading-tight">
 <span className="block font-serif text-base font-bold tracking-tight">
 NANDOM NMTC
 </span>
 <span className="block text-[0.58rem] uppercase tracking-[0.15em] text-white/60">
 Nursing &amp; Midwifery College
 </span>
 </span>
 </Link>

 {/* Harvard Close Button: 'Close (X)' */}
 <button
 type="button"
 onClick={() => setMenuOpen(false)}
 className="flex items-center gap-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded p-1"
 aria-label="Close menu"
 >
 <span>Close</span>
 <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/40 text-white">
 <X className="h-4 w-4" />
 </span>
 </button>
 </div>

 {/* Middle Body Area: Split Panel Menu (Harvard Style) */}
 <div className="section-grid flex-1 py-10 sm:py-16">
 <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 min-h-[380px]">
 {/* Left Column: Massive Editorial Serif Category Links */}
 <div className="md:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-6 md:border-r md:border-white/15 md:pr-10">
 {HARVARD_MENU_CATEGORIES.map((category) => {
 const isSelected = activeCategoryId === category.id;
 return (
 <div key={category.id} className="relative">
 <button
 type="button"
 onClick={() => setActiveCategoryId(category.id)}
 onMouseEnter={() => setActiveCategoryId(category.id)}
 className={cn(
 "block text-left font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight transition-all duration-150 focus-visible:outline-none",
 isSelected
 ? "text-white underline decoration-white decoration-2 underline-offset-8"
 : "text-white/50 hover:text-white"
 )}
 >
 {category.label}
 </button>

 {/* Mobile Accordion Submenu (visible only on small screens) */}
 {isSelected ? (
 <div className="mt-4 pl-2 space-y-2.5 md:hidden border-l border-white/20">
 <p className="text-xs text-white/70 leading-relaxed">
 {category.description}
 </p>
 <ul className="space-y-2 pt-1 text-sm font-medium">
 {category.sublinks.map((sub) => (
 <li key={sub.href + sub.label}>
 <Link
 href={sub.href}
 onClick={() => setMenuOpen(false)}
 className="flex items-center justify-between text-white/90 hover:text-white py-1"
 >
 <span>{sub.label}</span>
 <ChevronRight className="h-4 w-4 opacity-70" />
 </Link>
 </li>
 ))}
 </ul>
 </div>
 ) : null}
 </div>
 );
 })}
 </div>

 {/* Right Column: Submenu Details (Desktop only) */}
 <div className="hidden md:col-span-7 md:flex flex-col justify-center pl-6 lg:pl-12 space-y-6 animate-in fade-in duration-150">
 <div>
 <Link
 href={activeCategory.href}
 onClick={() => setMenuOpen(false)}
 className="group inline-flex items-center gap-2 font-serif text-2xl lg:text-3xl font-medium text-white hover:underline underline-offset-4"
 >
 <span>{activeCategory.title}</span>
 <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
 </Link>
 <p className="mt-2.5 max-w-lg text-sm sm:text-base font-light leading-relaxed text-white/75">
 {activeCategory.description}
 </p>
 </div>

 <div className="pt-4 border-t border-white/10">
 <ul className="space-y-3.5">
 {activeCategory.sublinks.map((sub) => (
 <li key={sub.href + sub.label}>
 <Link
 href={sub.href}
 onClick={() => setMenuOpen(false)}
 className="group inline-flex items-center gap-2 text-base lg:text-lg font-medium text-white hover:text-white/80 transition-colors"
 >
 <span className="group-hover:underline underline-offset-4">
 {sub.label}
 </span>
 {sub.hasArrow ? (
 <ChevronRight className="h-4 w-4 text-white/70 transition-transform group-hover:translate-x-1" />
 ) : null}
 </Link>
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>
 </div>

 {/* Bottom Bar: Exact Harvard 'Quick Links >' Strip */}
 <div className="border-t border-white/10 bg-black/40 py-4 shrink-0">
 <div className="section-grid flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm">
 <span className="flex items-center gap-1.5 text-white/50 font-normal">
 <span>Quick Links</span>
 <ChevronRight className="h-3.5 w-3.5" />
 </span>

 {QUICK_LINKS.map((item) => (
 <Link
 key={item.href + item.label}
 href={item.href}
 onClick={() => setMenuOpen(false)}
 className="font-semibold text-white/90 hover:text-white hover:underline transition-colors whitespace-nowrap"
 >
 {item.label}
 </Link>
 ))}
 </div>
 </div>
 </div>
 ) : null}

 {/* =========================================================================
 Search Modal Dialog
 ========================================================================= */}
 {searchOpen ? (
 <div
 className="fixed inset-0 z-[80]"
 role="dialog"
 aria-modal="true"
 aria-label="Search"
 >
 <button
 type="button"
 className="absolute inset-0 bg-black/60"
 onClick={() => setSearchOpen(false)}
 aria-label="Close search"
 />
 <div className="relative mx-auto mt-[12vh] w-full max-w-lg px-4">
 <div className="overflow-hidden rounded-none border border-line bg-white text-ink shadow-2xl">
 <div className="flex items-center gap-2 border-b border-line px-3">
 <Search className="h-4 w-4 shrink-0 text-caption" aria-hidden />
 <input
 type="search"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search programmes, fees, news…"
 className="h-12 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-caption"
 autoFocus
 aria-label="Search the site"
 />
 <button
 type="button"
 onClick={() => setSearchOpen(false)}
 className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-caption hover:text-ink"
 aria-label="Close search"
 >
 <X className="h-4 w-4" />
 </button>
 </div>

 <ul className="max-h-[min(22rem,55vh)] overflow-y-auto py-1">
 {filteredLinks.length > 0 ? (
 filteredLinks.map((item) => (
 <li key={`${item.href}-${item.label}`}>
 <Link
 href={item.href}
 onClick={() => setSearchOpen(false)}
 className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-[#f7f7f7]"
 >
 <span>
 <span className="block text-sm font-medium text-ink">
 {item.label}
 </span>
 <span className="mt-0.5 block text-[0.7rem] uppercase tracking-wider text-caption">
 {item.category}
 </span>
 </span>
 <ArrowRight className="h-4 w-4 shrink-0 text-caption" />
 </Link>
 </li>
 ))
 ) : (
 <li className="px-4 py-8 text-center text-sm text-caption">
 No matches for “{searchQuery}”.
 </li>
 )}
 </ul>

 <p className="border-t border-line px-4 py-2 text-[0.7rem] text-caption">
 Esc to close
 </p>
 </div>
 </div>
 </div>
 ) : null}
 </>
 );
}
