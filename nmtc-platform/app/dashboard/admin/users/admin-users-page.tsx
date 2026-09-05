import { UsersManager } from "@/components/admin/users-manager";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireSuperAdmin } from "@/lib/auth/permissions";
import { listStaffAccounts } from "@/lib/data/admin-users";

export default async function AdminUsersPage() {
  const session = await requireSuperAdmin();
  const staff = await listStaffAccounts();

  return (
    <AdminListShell section="users">
      <UsersManager staff={staff} currentUserId={session.userId} />
    </AdminListShell>
  );
}
