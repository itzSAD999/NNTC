import { UsersManager } from "@/components/admin/users-manager";
import { requireSuperAdmin } from "@/lib/auth/permissions";
import { listStaffAccounts } from "@/lib/data/admin-users";

export default async function AdminUsersPage() {
  const session = await requireSuperAdmin();
  const staff = await listStaffAccounts();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Manage users</h1>
        <p className="mt-2 text-caption">
          Create staff accounts, assign roles, and reset passwords.
        </p>
      </header>

      <UsersManager staff={staff} currentUserId={session.userId} />
    </div>
  );
}
