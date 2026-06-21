"use server";

import { redirect } from "next/navigation";

import {
  getRoleDashboardPath,
  getStaffSession,
} from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthFormState = {
  error?: string;
};

export async function signInStaff(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured. Add keys to .env.local." };
  }

  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid email or password." };
  }

  const session = await getStaffSession();
  if (!session) {
    await supabase.auth.signOut();
    return {
      error:
        "Your account is not linked to an active staff profile. Contact the administrator.",
    };
  }

  redirect(getRoleDashboardPath(session.staff.role));
}

export async function signOutStaff() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
