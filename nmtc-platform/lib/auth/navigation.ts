import type { Role } from "@/lib/constants";

export type DashboardNavGroupId =
  | "command"
  | "operations"
  | "academics"
  | "content"
  | "finance"
  | "system";

export type DashboardNavItem = {
  href: string;
  label: string;
  roles: Role[];
  group: DashboardNavGroupId;
  iconName: string;
  badge?: string;
  description?: string;
};

export const GROUP_METADATA: Record<
  DashboardNavGroupId,
  { label: string; description: string }
> = {
  command: {
    label: "Workspace Overview",
    description: "Main desk summary and institutional metrics",
  },
  operations: {
    label: "Document Processing Queues",
    description: "Dedicated queues for each verification stage",
  },
  academics: {
    label: "Academic & Admissions",
    description: "Curricula, departments & intake",
  },
  content: {
    label: "Public Portal & Media",
    description: "Articles, calendar & gallery",
  },
  finance: {
    label: "Bursary & Accounts",
    description: "Fee schedules & financial aid",
  },
  system: {
    label: "System & Governance",
    description: "Staff, roles, settings & audit logs",
  },
};

export const DASHBOARD_NAV: DashboardNavItem[] = [
  // 1. Primary Workspaces (Each role lands on their own dedicated overview)
  {
    href: "/dashboard/admin",
    label: "Executive Overview",
    roles: ["super_admin"],
    group: "command",
    iconName: "LayoutDashboard",
    description: "Platform metrics and institutional summary",
  },
  {
    href: "/dashboard/principal",
    label: "Principal Overview",
    roles: ["principal"],
    group: "command",
    iconName: "LayoutDashboard",
    description: "Executive endorsement desk & institutional metrics",
  },
  {
    href: "/dashboard/academic",
    label: "Academic Overview",
    roles: ["academic"],
    group: "command",
    iconName: "LayoutDashboard",
    description: "Records verification & curriculum summary",
  },
  {
    href: "/dashboard/accounts",
    label: "Accounts Overview",
    roles: ["accounts"],
    group: "command",
    iconName: "LayoutDashboard",
    description: "Payment verification & fee reconciliation summary",
  },
  {
    href: "/dashboard/editor",
    label: "Editorial Desk",
    roles: ["content_editor"],
    group: "command",
    iconName: "LayoutDashboard",
    description: "News, events, and public pages",
  },

  // 2. Principal Dedicated Subpages
  {
    href: "/dashboard/principal/pending",
    label: "Awaiting Signatures",
    roles: ["principal", "super_admin"],
    group: "operations",
    iconName: "Award",
    description: "Cleared requests awaiting Principal endorsement",
  },
  {
    href: "/dashboard/principal/issued",
    label: "Signed & Issued Archive",
    roles: ["principal", "super_admin"],
    group: "operations",
    iconName: "CheckCircle2",
    description: "History of all officially released documents",
  },

  // 3. Academic Office Dedicated Subpages
  {
    href: "/dashboard/academic/pending",
    label: "Pending Verification",
    roles: ["academic", "super_admin"],
    group: "operations",
    iconName: "FileCheck2",
    description: "Submitted transcript & attestation checks",
  },
  {
    href: "/dashboard/academic/returned",
    label: "Returned to Students",
    roles: ["academic", "super_admin"],
    group: "operations",
    iconName: "RotateCcw",
    description: "Discrepancy queries & resubmissions",
  },
  {
    href: "/dashboard/academic/cleared",
    label: "Cleared to Accounts",
    roles: ["academic", "super_admin"],
    group: "operations",
    iconName: "CheckCircle2",
    description: "Academically verified requests forwarded",
  },

  // 4. Accounts Office Dedicated Subpages
  {
    href: "/dashboard/accounts/pending",
    label: "Payment Verification",
    roles: ["accounts", "super_admin"],
    group: "operations",
    iconName: "Receipt",
    description: "Paystack & bank slip reconciliation",
  },
  {
    href: "/dashboard/accounts/cleared",
    label: "Cleared to Principal",
    roles: ["accounts", "super_admin"],
    group: "operations",
    iconName: "Award",
    description: "Payment cleared & forwarded for signature",
  },
  {
    href: "/dashboard/accounts/collected",
    label: "Collected & Dispatched",
    roles: ["accounts", "super_admin"],
    group: "operations",
    iconName: "CheckCircle2",
    description: "Finalized and collected document archive",
  },

  // 5. Inquiries & Communications
  {
    href: "/dashboard/admin/inbox",
    label: "Inquiries & Inbox",
    roles: ["super_admin", "principal"],
    group: "operations",
    iconName: "Inbox",
    description: "Public contact messages & student queries",
  },

  // 6. Academic & Admissions Management
  {
    href: "/dashboard/admin/programs",
    label: "Programmes & Courses",
    roles: ["super_admin", "academic", "content_editor"],
    group: "academics",
    iconName: "GraduationCap",
    description: "Nursing & midwifery curricula",
  },
  {
    href: "/dashboard/admin/departments",
    label: "Departments & Units",
    roles: ["super_admin", "academic", "content_editor"],
    group: "academics",
    iconName: "Building2",
    description: "Faculties & academic heads",
  },
  {
    href: "/dashboard/admin/admissions",
    label: "Admissions & Intake",
    roles: ["super_admin", "academic", "content_editor"],
    group: "academics",
    iconName: "UserCheck",
    description: "Requirements & application guide",
  },
  {
    href: "/dashboard/admin/resources",
    label: "Student Resources",
    roles: ["super_admin", "academic", "content_editor"],
    group: "academics",
    iconName: "BookOpen",
    description: "Handbooks, forms & downloads",
  },

  // 7. Public Portal & Media
  {
    href: "/dashboard/admin/news",
    label: "News & Bulletins",
    roles: ["super_admin", "content_editor"],
    group: "content",
    iconName: "Newspaper",
    description: "Institutional notices & articles",
  },
  {
    href: "/dashboard/admin/events",
    label: "Events & Calendar",
    roles: ["super_admin", "content_editor"],
    group: "content",
    iconName: "CalendarDays",
    description: "Matriculation, exams & clinics",
  },
  {
    href: "/dashboard/admin/gallery",
    label: "Media & Photos",
    roles: ["super_admin", "content_editor"],
    group: "content",
    iconName: "Images",
    description: "Campus & graduation albums",
  },
  {
    href: "/dashboard/admin/campus-life",
    label: "Campus Life & Hostels",
    roles: ["super_admin", "content_editor"],
    group: "content",
    iconName: "Compass",
    description: "Student amenities & facilities",
  },
  {
    href: "/dashboard/admin/about",
    label: "About Institution",
    roles: ["super_admin", "content_editor"],
    group: "content",
    iconName: "Info",
    description: "History, mission & leadership",
  },

  // 8. Bursary & Finance
  {
    href: "/dashboard/admin/fees",
    label: "Fee Schedules & Aid",
    roles: ["super_admin", "accounts", "principal"],
    group: "finance",
    iconName: "BadgePercent",
    description: "Tuition rates, bank accounts & aid",
  },

  // 9. System & Governance
  {
    href: "/dashboard/admin/staff",
    label: "Faculty & Staff Directory",
    roles: ["super_admin", "academic", "principal", "content_editor"],
    group: "system",
    iconName: "Users",
    description: "Lecturers, tutors & management",
  },
  {
    href: "/dashboard/admin/users",
    label: "Staff Accounts & Roles",
    roles: ["super_admin"],
    group: "system",
    iconName: "UserCog",
    description: "RBAC permissions & access",
  },
  {
    href: "/dashboard/admin/settings",
    label: "College Settings",
    roles: ["super_admin"],
    group: "system",
    iconName: "Sliders",
    description: "Crest, contacts & social links",
  },
  {
    href: "/dashboard/admin/audit",
    label: "Security & Audit Trail",
    roles: ["super_admin", "principal"],
    group: "system",
    iconName: "ShieldCheck",
    description: "Immutable logs & timestamps",
  },
];

export type DashboardNavGroup = {
  id: DashboardNavGroupId;
  label: string;
  description: string;
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
  const order: DashboardNavGroupId[] = [
    "command",
    "operations",
    "academics",
    "content",
    "finance",
    "system",
  ];

  return order
    .map((id) => ({
      id,
      label: GROUP_METADATA[id].label,
      description: GROUP_METADATA[id].description,
      items: items.filter((item) => item.group === id),
    }))
    .filter((group) => group.items.length > 0);
}
