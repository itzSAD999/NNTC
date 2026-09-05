import type { Role } from "@/lib/constants";
import type { StaffSession } from "@/lib/auth/session";
import { isAuthBypassEnabled } from "@/lib/auth/dev-bypass-config";
import type { StaffAccount } from "@/types/database";
import { cookies } from "next/headers";

const DEV_ROLE_COOKIE = "nmtc_dev_role";

const PREVIEW_STAFF: Record<
  Role,
  { full_name: string; email: string }
> = {
  super_admin: {
    full_name: "Preview — Super Admin",
    email: "admin@nmtc.edu.gh",
  },
  content_editor: {
    full_name: "Preview — Content Editor",
    email: "editor@nmtc.edu.gh",
  },
  academic: {
    full_name: "Preview — Academic Office",
    email: "academic@nmtc.edu.gh",
  },
  accounts: {
    full_name: "Preview — Accounts Office",
    email: "accounts@nmtc.edu.gh",
  },
  principal: {
    full_name: "Preview — Principal",
    email: "principal@nmtc.edu.gh",
  },
};

const MOCK_STAFF_IDS: Record<Role, string> = {
  super_admin: "10000000-0000-4000-8000-000000000001",
  content_editor: "10000000-0000-4000-8000-000000000002",
  academic: "10000000-0000-4000-8000-000000000003",
  accounts: "10000000-0000-4000-8000-000000000004",
  principal: "10000000-0000-4000-8000-000000000005",
};

export { isAuthBypassEnabled } from "@/lib/auth/dev-bypass-config";

export function isValidDevRole(value: string): value is Role {
  return value in PREVIEW_STAFF;
}

export async function getDevBypassRole(): Promise<Role> {
  if (!isAuthBypassEnabled()) return "super_admin";
  const raw = (await cookies()).get(DEV_ROLE_COOKIE)?.value ?? "super_admin";
  return isValidDevRole(raw) ? raw : "super_admin";
}

export async function getDevBypassSession(role?: Role): Promise<StaffSession> {
  const activeRole = role ?? (await getDevBypassRole());
  const preview = PREVIEW_STAFF[activeRole];
  const now = new Date().toISOString();

  const staff: StaffAccount = {
    id: MOCK_STAFF_IDS[activeRole],
    full_name: preview.full_name,
    email: preview.email,
    role: activeRole,
    is_active: true,
    created_at: now,
    updated_at: now,
  };

  return {
    userId: staff.id,
    email: preview.email,
    staff,
  };
}

export const DEV_ROLE_OPTIONS: { role: Role; label: string }[] = [
  { role: "super_admin", label: "Super Admin" },
  { role: "content_editor", label: "Content Editor" },
  { role: "academic", label: "Academic" },
  { role: "accounts", label: "Accounts" },
  { role: "principal", label: "Principal" },
];
