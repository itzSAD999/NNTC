import type { Role } from "@/lib/constants";

export type DashboardNavGroupId = "operations" | "content" | "system";

export type DashboardNavItem = {
  href: string;
  label: string;
  roles: Role[];
  group: DashboardNavGroupId;
};

const GROUP_LABELS: Record<DashboardNavGroupId, string> = {
  operations: "Document requests",
  content: "Website content",
  system: "Administration",
};

export const DASHBOARD_NAV: DashboardNavItem[] = [
  {
    href: "/dashboard/academic",
    label: "Academic Office",
    roles: ["academic", "super_admin"],
    group: "operations",
  },
  {
    href: "/dashboard/accounts",
    label: "Accounts Office",
    roles: ["accounts", "super_admin"],
    group: "operations",
  },
  {
    href: "/dashboard/principal",
    label: "Principal",
    roles: ["principal", "super_admin"],
    group: "operations",
  },
  {
    href: "/dashboard/admin/inbox",
    label: "Inbox",
    roles: ["super_admin"],
    group: "operations",
  },
  {
    href: "/dashboard/admin/news",
    label: "News",
    roles: ["super_admin", "content_editor"],
    group: "content",
  },
  {
    href: "/dashboard/admin/programs",
    label: "Programmes",
    roles: ["super_admin", "content_editor"],
    group: "content",
  },
  {
    href: "/dashboard/admin/departments",
    label: "Departments",
    roles: ["super_admin", "content_editor"],
    group: "content",
  },
  {
    href: "/dashboard/admin/admissions",
    label: "Admissions",
    roles: ["super_admin", "content_editor"],
    group: "content",
  },
  {
    href: "/dashboard/admin/fees",
    label: "Fees & Aid",
    roles: ["super_admin", "content_editor"],
    group: "content",
  },
  {
    href: "/dashboard/admin/staff",
    label: "Staff",
    roles: ["super_admin", "content_editor"],
    group: "content",
  },
  {
    href: "/dashboard/admin/campus-life",
    label: "Campus life",
    roles: ["super_admin", "content_editor"],
    group: "content",
  },
  {
    href: "/dashboard/admin/gallery",
    label: "Gallery",
    roles: ["super_admin", "content_editor"],
    group: "content",
  },
  {
    href: "/dashboard/admin/events",
    label: "Events",
    roles: ["super_admin", "content_editor"],
    group: "content",
  },
  {
    href: "/dashboard/admin/resources",
    label: "Resources",
    roles: ["super_admin", "content_editor"],
    group: "content",
  },
  {
    href: "/dashboard/admin/about",
    label: "About",
    roles: ["super_admin", "content_editor"],
    group: "content",
  },
  {
    href: "/dashboard/admin/settings",
    label: "Settings",
    roles: ["super_admin"],
    group: "system",
  },
  {
    href: "/dashboard/admin/users",
    label: "Users",
    roles: ["super_admin"],
    group: "system",
  },
  {
    href: "/dashboard/admin/audit",
    label: "Audit log",
    roles: ["super_admin"],
    group: "system",
  },
];

export type DashboardNavGroup = {
  id: DashboardNavGroupId;
  label: string;
  items: DashboardNavItem[];
};

export function navItemsForRole(role: Role): DashboardNavItem[] {
  if (role === "super_admin") {
    return DASHBOARD_NAV;
  }
  return DASHBOARD_NAV.filter((item) => item.roles.includes(role));
}

export function navGroupsForRole(role: Role): DashboardNavGroup[] {
  const items = navItemsForRole(role);
  const order: DashboardNavGroupId[] = ["operations", "content", "system"];

  return order
    .map((id) => ({
      id,
      label: GROUP_LABELS[id],
      items: items.filter((item) => item.group === id),
    }))
    .filter((group) => group.items.length > 0);
}
