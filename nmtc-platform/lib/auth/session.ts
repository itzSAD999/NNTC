import { redirect } from "next/navigation";

import {
  getDevBypassRole,
  getDevBypassSession,
  isAuthBypassEnabled,
} from "@/lib/auth/dev-bypass";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/constants";
import type { StaffAccount } from "@/types/database";

export type StaffSession = {
  userId: string;
  email: string;
  staff: StaffAccount;
};

export async function getStaffSession(): Promise<StaffSession | null> {
  if (isAuthBypassEnabled()) {
    return getDevBypassSession(await getDevBypassRole());
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: staff } = await supabase
    .from("staff_accounts")
    .select("*")
    .eq("id", user.id)
    .eq("is_active", true)
    .single();

  if (!staff) return null;

  return {
    userId: user.id,
    email: user.email ?? staff.email,
    staff: staff as StaffAccount,
  };
}

export async function requireStaffSession(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export function hasStaffRole(session: StaffSession, roles: Role[]): boolean {
  return (
    session.staff.role === "super_admin" || roles.includes(session.staff.role)
  );
}

export async function requireStaffRole(roles: Role[]): Promise<StaffSession> {
  const session = await requireStaffSession();
  if (!hasStaffRole(session, roles)) {
    redirect("/dashboard");
  }
  return session;
}

export function getRoleDashboardPath(role: Role): string {
  switch (role) {
    case "academic":
      return "/dashboard/academic";
    case "accounts":
      return "/dashboard/accounts";
    case "principal":
      return "/dashboard/principal";
    case "super_admin":
      return "/dashboard/admin/settings";
    case "content_editor":
      return "/dashboard/admin/news";
    default:
      return "/dashboard";
  }
}
