"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutStaff } from "@/lib/auth/actions";
import type { DashboardNavItem } from "@/lib/auth/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  items: DashboardNavItem[];
  staffName: string;
  roleLabel: string;
}

export function DashboardSidebar({
  items,
  staffName,
  roleLabel,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-r border-line bg-surface lg:w-64 lg:shrink-0">
      <div className="border-b border-line px-5 py-6">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          NMTC Staff
        </p>
        <p className="mt-2 text-sm font-medium text-ink">{staffName}</p>
        <p className="text-xs text-caption">{roleLabel}</p>
      </div>

      <nav aria-label="Dashboard" className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {items.map(({ href, label }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "block rounded px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-caption hover:bg-bg hover:text-ink"
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line p-4">
        <form action={signOutStaff}>
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
