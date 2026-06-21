import type { Role } from "@/lib/constants";

export type DashboardNavItem = {
  href: string;
  label: string;
  roles: Role[];
};

export const DASHBOARD_NAV: DashboardNavItem[] = [
  {
    href: "/dashboard/academic",
    label: "Academic Office",
    roles: ["academic", "super_admin"],
  },
  {
    href: "/dashboard/accounts",
    label: "Accounts Office",
    roles: ["accounts", "super_admin"],
  },
  {
    href: "/dashboard/principal",
    label: "Principal",
    roles: ["principal", "super_admin"],
  },
  { href: "/dashboard/admin/inbox", label: "Inbox", roles: ["super_admin"] },
  { href: "/dashboard/admin/news", label: "News", roles: ["super_admin", "content_editor"] },
  { href: "/dashboard/admin/programs", label: "Programmes", roles: ["super_admin", "content_editor"] },
  { href: "/dashboard/admin/admissions", label: "Admissions", roles: ["super_admin", "content_editor"] },
  { href: "/dashboard/admin/fees", label: "Fees & Aid", roles: ["super_admin", "content_editor"] },
  { href: "/dashboard/admin/staff", label: "Staff", roles: ["super_admin", "content_editor"] },
  { href: "/dashboard/admin/campus-life", label: "Campus life", roles: ["super_admin", "content_editor"] },
  { href: "/dashboard/admin/gallery", label: "Gallery", roles: ["super_admin", "content_editor"] },
  { href: "/dashboard/admin/events", label: "Events", roles: ["super_admin", "content_editor"] },
  { href: "/dashboard/admin/resources", label: "Resources", roles: ["super_admin", "content_editor"] },
  { href: "/dashboard/admin/about", label: "About", roles: ["super_admin", "content_editor"] },
  { href: "/dashboard/admin/settings", label: "Settings", roles: ["super_admin"] },
  { href: "/dashboard/admin/users", label: "Users", roles: ["super_admin"] },
  { href: "/dashboard/admin/audit", label: "Audit log", roles: ["super_admin"] },
];

export function navItemsForRole(role: Role): DashboardNavItem[] {
  if (role === "super_admin") {
    return DASHBOARD_NAV;
  }
  return DASHBOARD_NAV.filter((item) => item.roles.includes(role));
}
