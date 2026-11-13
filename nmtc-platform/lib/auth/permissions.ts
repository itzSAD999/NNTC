import { redirect } from "next/navigation";

import {
  getStaffSession,
  hasStaffRole,
  type StaffSession,
} from "@/lib/auth/session";
import type { Role } from "@/lib/constants";

export async function requireSuperAdmin(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (!session || session.staff.role !== "super_admin") {
    redirect("/dashboard");
  }
  return session;
}

export async function requireContentStaff(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (
    !session ||
    !hasStaffRole(session, ["super_admin", "content_editor"])
  ) {
    redirect("/dashboard");
  }
  return session;
}

export async function requireInboxStaff(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (
    !session ||
    !hasStaffRole(session, ["super_admin", "principal"])
  ) {
    redirect("/dashboard");
  }
  return session;
}

export async function requireAuditStaff(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (
    !session ||
    !hasStaffRole(session, ["super_admin", "principal"])
  ) {
    redirect("/dashboard");
  }
  return session;
}

export async function requireFeesStaff(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (
    !session ||
    !hasStaffRole(session, [
      "super_admin",
      "accounts",
      "principal",
      "content_editor",
    ])
  ) {
    redirect("/dashboard");
  }
  return session;
}

export async function requireAcademicStaff(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (
    !session ||
    !hasStaffRole(session, ["super_admin", "academic", "content_editor"])
  ) {
    redirect("/dashboard");
  }
  return session;
}

export async function requireStaffDirectoryStaff(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (
    !session ||
    !hasStaffRole(session, [
      "super_admin",
      "academic",
      "principal",
      "content_editor",
    ])
  ) {
    redirect("/dashboard");
  }
  return session;
}

export function isContentStaffRole(role: Role): boolean {
  return role === "super_admin" || role === "content_editor";
}
