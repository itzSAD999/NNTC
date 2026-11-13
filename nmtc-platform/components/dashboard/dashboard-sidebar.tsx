"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck2,
  Receipt,
  Award,
  Inbox,
  GraduationCap,
  Building2,
  UserCheck,
  BookOpen,
  Newspaper,
  CalendarDays,
  Images,
  Compass,
  Info,
  BadgePercent,
  Users,
  UserCog,
  Sliders,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Clock,
  ExternalLink,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  Layers,
  Menu,
  X,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { signOutStaff } from "@/lib/auth/actions";
import { navGroupsForRole } from "@/lib/auth/navigation";
import type { Role } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  FileCheck2,
  Receipt,
  Award,
  Inbox,
  GraduationCap,
  Building2,
  UserCheck,
  BookOpen,
  Newspaper,
  CalendarDays,
  Images,
  Compass,
  Info,
  BadgePercent,
  Users,
  UserCog,
  Sliders,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Clock,
};

interface DashboardSidebarProps {
  role: Role;
  staffName: string;
  roleLabel: string;
  staffEmail?: string;
}

export function DashboardSidebar({
  role,
  staffName,
  roleLabel,
  staffEmail,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const groups = navGroupsForRole(role);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Restore collapsed preference from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nmtc_sidebar_collapsed");
      if (stored !== null) {
        setIsCollapsed(stored === "true");
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  function toggleCollapse() {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("nmtc_sidebar_collapsed", String(next));
      } catch {
        // LocalStorage unavailable
      }
      return next;
    });
  }

  function toggleGroup(groupId: string) {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }

  // Filter items by search query if user types in search bar
  const query = searchQuery.trim().toLowerCase();
  const filteredGroups = groups
    .map((group) => {
      if (!query) return group;
      const items = group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);

  const initials = staffName
    ? staffName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "ST";

  const homePath = role === "super_admin" || role === "principal" ? "/dashboard/admin" : "/dashboard";

  return (
    <>
      {/* Mobile Top Header Bar with Hamburger */}
      <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:hidden">
        <Link href={homePath} className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-white">
            <Shield className="h-4 w-4" />
          </div>
          <span className="font-serif font-bold text-sm text-ink">
            Nandom NMTC
          </span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.65rem] font-semibold text-primary">
            {roleLabel}
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-md border border-line p-2 text-ink hover:bg-bg"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Container */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform bg-surface shadow-2xl transition-transform duration-200 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col bg-surface text-ink">
          {/* Header */}
          <div className="border-b border-line px-5 py-5 flex items-center justify-between">
            <Link
              href={homePath}
              className="flex items-center gap-3"
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                <Shield className="h-5 w-5 fill-white/20" />
              </div>
              <div>
                <span className="font-serif font-bold text-sm text-ink">
                  Nandom NMTC
                </span>
                <p className="text-[0.7rem] text-caption">{roleLabel}</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded p-1.5 text-caption hover:bg-bg hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
            {groups.map((group) => (
              <div key={group.id} className="space-y-1">
                <span className="px-3 text-[0.65rem] font-bold uppercase tracking-wider text-caption">
                  {group.label}
                </span>
                <ul className="space-y-0.5 pt-0.5">
                  {group.items.map((item) => {
                    const IconComponent = ICON_MAP[item.iconName] || Layers;
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                            active
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-ink/80 hover:bg-bg hover:text-ink"
                          )}
                        >
                          <IconComponent className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-line p-4">
            <form action={signOutStaff}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-md border border-line p-2 text-xs text-caption hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Desktop Sticky & Collapsible Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:shrink-0 lg:flex-col lg:border-r lg:border-line lg:bg-surface lg:min-h-screen transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:w-[76px]" : "lg:w-64"
        )}
      >
        <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
          {/* Brand Header & Collapse Toggle */}
          <div
            className={cn(
              "border-b border-line py-4 transition-all duration-300",
              isCollapsed ? "px-3 text-center" : "px-5"
            )}
          >
            <div className="flex items-center justify-between">
              <Link
                href={homePath}
                className={cn(
                  "flex items-center gap-3 transition-opacity hover:opacity-90",
                  isCollapsed && "justify-center w-full"
                )}
                title="Nandom NMTC Portal"
              >
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white p-0.5 shadow-sm ring-1 ring-line/60 overflow-hidden">
                  <Image
                    src="/images/nmtc-crest.png"
                    alt="NMTC Crest"
                    width={36}
                    height={36}
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-sm tracking-tight text-ink truncate">
                        Nandom NMTC
                      </span>
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.65rem] font-semibold text-primary">
                        EMS
                      </span>
                    </div>
                    <p className="text-[0.7rem] text-caption truncate">
                      {roleLabel}
                    </p>
                  </div>
                )}
              </Link>

              {/* Collapse/Expand Toggle Button */}
              {!isCollapsed && (
                <button
                  type="button"
                  onClick={toggleCollapse}
                  className="rounded-lg p-1.5 text-caption hover:bg-bg hover:text-ink transition-colors"
                  title="Collapse sidebar"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* If collapsed, show re-expand button right beneath crest */}
            {isCollapsed && (
              <div className="mt-2 flex justify-center">
                <button
                  type="button"
                  onClick={toggleCollapse}
                  className="rounded-md p-1.5 text-caption hover:bg-bg hover:text-primary transition-colors"
                  title="Expand sidebar"
                  aria-label="Expand sidebar"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Quick Filter Search for Fast Access (Only when expanded) */}
            {!isCollapsed && groups.length > 2 && (
              <div className="mt-3.5 relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-caption" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter desk tools..."
                  className="w-full rounded-md border border-line bg-bg/60 pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-caption focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-caption hover:text-ink text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav
            aria-label="Staff Dashboard Navigation"
            className={cn(
              "flex-1 overflow-y-auto py-4 space-y-4",
              isCollapsed ? "px-2" : "px-3"
            )}
          >
            {filteredGroups.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-caption">
                No tools match &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              filteredGroups.map((group) => {
                const isGroupCollapsed = collapsedGroups[group.id] && !query;

                return (
                  <div key={group.id} className="space-y-1">
                    {/* Group Header */}
                    {!isCollapsed ? (
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className="flex w-full items-center justify-between px-3 py-1 text-left group"
                      >
                        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-caption/90 group-hover:text-primary transition-colors">
                          {group.label}
                        </span>
                        <span className="text-caption/60 group-hover:text-primary">
                          {isGroupCollapsed ? (
                            <ChevronRight className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </span>
                      </button>
                    ) : (
                      <div className="my-2 border-t border-line/60" />
                    )}

                    {/* Group Links */}
                    {(!isGroupCollapsed || isCollapsed) && (
                      <ul className="space-y-0.5 pt-0.5">
                        {group.items.map((item) => {
                          const IconComponent = ICON_MAP[item.iconName] || Layers;
                          const active =
                            pathname === item.href ||
                            (item.href !== "/dashboard/admin" &&
                              item.href !== "/dashboard" &&
                              pathname.startsWith(`${item.href}/`));

                          return (
                            <li key={item.href} className="relative group">
                              <Link
                                href={item.href}
                                className={cn(
                                  "flex items-center rounded-lg text-xs font-medium transition-all",
                                  isCollapsed
                                    ? "justify-center p-2.5"
                                    : "gap-3 px-3 py-2",
                                  active
                                    ? "bg-primary/10 text-primary font-semibold shadow-sm"
                                    : "text-ink/80 hover:bg-bg hover:text-ink"
                                )}
                              >
                                <IconComponent
                                  className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    active
                                      ? "text-primary"
                                      : "text-caption group-hover:text-ink"
                                  )}
                                />
                                {!isCollapsed && (
                                  <>
                                    <span className="truncate flex-1">
                                      {item.label}
                                    </span>
                                    {item.badge && (
                                      <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[0.65rem] font-semibold text-accent">
                                        {item.badge}
                                      </span>
                                    )}
                                  </>
                                )}
                              </Link>

                              {/* Floating Tooltip when Collapsed */}
                              {isCollapsed && (
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden rounded-lg border border-line bg-ink px-2.5 py-1 text-xs font-medium text-white shadow-xl group-hover:block z-50 whitespace-nowrap pointer-events-none">
                                  {item.label}
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })
            )}
          </nav>

          {/* User Profile & Actions Footer */}
          <div
            className={cn(
              "border-t border-line transition-all duration-300 bg-surface/50",
              isCollapsed ? "p-2 space-y-2 text-center" : "p-4 space-y-3"
            )}
          >
            {/* User Profile Card */}
            {!isCollapsed ? (
              <div className="flex items-center gap-3 rounded-lg border border-line/60 bg-bg/50 p-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 font-serif font-bold text-xs text-primary">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-ink leading-tight">
                    {staffName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[0.65rem] font-medium text-caption truncate">
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative group flex justify-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 font-serif font-bold text-xs text-primary cursor-default">
                  {initials}
                </div>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden rounded-lg border border-line bg-ink px-2.5 py-1 text-xs font-medium text-white shadow-xl group-hover:block z-50 whitespace-nowrap pointer-events-none">
                  {staffName} ({roleLabel})
                </div>
              </div>
            )}

            {/* Action Row */}
            {!isCollapsed ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1.5 text-[0.7rem] font-medium text-ink transition-colors hover:bg-bg hover:text-primary shadow-sm"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Public Site</span>
                </Link>

                <form action={signOutStaff} className="w-full">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1.5 text-[0.7rem] font-medium text-caption transition-colors hover:bg-red-50 hover:text-red-700 hover:border-red-200 shadow-sm"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Sign out</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Link
                  href="/"
                  target="_blank"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-caption hover:bg-bg hover:text-primary transition-colors"
                  title="Public Site"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <form action={signOutStaff}>
                  <button
                    type="submit"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-caption hover:bg-red-50 hover:text-red-700 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
