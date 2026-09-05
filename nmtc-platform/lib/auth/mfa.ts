import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/constants";

/** Roles that must complete MFA (AAL2) before money-bearing workflow actions. */
const MFA_WORKFLOW_ROLES: Role[] = ["super_admin", "principal", "accounts"];

export function roleRequiresWorkflowMfa(role: Role): boolean {
  return MFA_WORKFLOW_ROLES.includes(role);
}

export type MfaCheckResult = { ok: true } | { ok: false; error: string };

export async function requireWorkflowMfa(role: Role): Promise<MfaCheckResult> {
  if (!roleRequiresWorkflowMfa(role)) {
    return { ok: true };
  }

  if (process.env.NODE_ENV !== "production") {
    return { ok: true };
  }

  const supabase = await createClient();
  const { data, error } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (error || data?.currentLevel !== "aal2") {
    return {
      ok: false,
      error:
        "Multi-factor authentication is required for this action. Enroll MFA in Supabase Auth, then sign in again with your second factor.",
    };
  }

  return { ok: true };
}
