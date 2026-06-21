import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { navItemsForRole } from "@/lib/auth/navigation";
import { requireStaffSession } from "@/lib/auth/session";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  content_editor: "Content Editor",
  academic: "Academic Office",
  accounts: "Accounts Office",
  principal: "Principal",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireStaffSession();
  const navItems = navItemsForRole(session.staff.role);

  return (
    <div className="flex min-h-screen flex-col bg-bg lg:flex-row">
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to dashboard content
      </a>
      <DashboardSidebar
        items={navItems}
        staffName={session.staff.full_name}
        roleLabel={ROLE_LABELS[session.staff.role] ?? session.staff.role}
      />
      <div
        id="dashboard-main"
        className="flex-1 px-4 py-8 sm:px-6 lg:px-10"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}
