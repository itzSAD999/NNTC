import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopBar } from "@/components/dashboard/dashboard-topbar";
import { DevRoleSwitcher } from "@/components/dashboard/dev-role-switcher";
import { getDevPreviewState } from "@/lib/auth/dev-preview-actions";
import { requireStaffSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

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
  const devPreview = await getDevPreviewState();
  const roleLabel = ROLE_LABELS[session.staff.role] ?? session.staff.role;

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f5]">
      {devPreview.enabled ? (
        <div className="w-full">
          <DevRoleSwitcher
            currentRole={devPreview.currentRole}
            options={devPreview.options}
          />
        </div>
      ) : null}

      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <a
          href="#dashboard-main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to dashboard content
        </a>

        <DashboardSidebar
          role={session.staff.role}
          staffName={session.staff.full_name}
          roleLabel={roleLabel}
          staffEmail={session.email}
        />

        <div className="flex flex-1 flex-col min-w-0">
          <DashboardTopBar role={session.staff.role} roleLabel={roleLabel} />
          <main
            id="dashboard-main"
            className="flex-1 px-4 py-8 sm:px-6 lg:px-10"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
