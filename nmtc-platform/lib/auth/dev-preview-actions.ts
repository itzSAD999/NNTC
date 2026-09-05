"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import {
  DEV_ROLE_OPTIONS,
  getDevBypassRole,
  isAuthBypassEnabled,
  isValidDevRole,
} from "@/lib/auth/dev-bypass";
import type { Role } from "@/lib/constants";

const DEV_ROLE_COOKIE = "nmtc_dev_role";

export async function setDevPreviewRole(role: Role): Promise<void> {
  if (!isAuthBypassEnabled() || !isValidDevRole(role)) return;

  (await cookies()).set(DEV_ROLE_COOKIE, role, {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });

  revalidatePath("/dashboard", "layout");
}

export async function getDevPreviewState() {
  return {
    enabled: isAuthBypassEnabled(),
    currentRole: await getDevBypassRole(),
    options: DEV_ROLE_OPTIONS,
  };
}
