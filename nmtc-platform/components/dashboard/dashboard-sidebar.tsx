"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutStaff } from "@/lib/auth/actions";
import { navGroupsForRole } from "@/lib/auth/navigation";
import type { Role } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  role: Role;
  staffName: string;
  roleLabel: string;
}

export function DashboardSidebar({
  role,
  staffName,
  roleLabel,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const groups = navGroupsForRole(role);

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
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.id}>
              <p className="mb-2 px-3 text-[0.65rem] font-semibold uppercase tracking-widest text-caption">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map(({ href, label }) => {
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
            </div>
          ))}
        </div>
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
