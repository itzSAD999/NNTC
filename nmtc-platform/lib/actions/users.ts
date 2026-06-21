"use server";

import { revalidatePath } from "next/cache";

import { requireSuperAdmin } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isAdminConfigured } from "@/lib/requests/reference";
import {
  createStaffSchema,
  resetPasswordSchema,
  updateStaffSchema,
} from "@/lib/validation/users";

export type UserActionState = {
  error?: string;
  success?: boolean;
};

function formBool(value: FormDataEntryValue | null): boolean {
  return value === "true" || value === "on" || value === "1";
}

export async function createStaff(
  _prev: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const session = await requireSuperAdmin();

  if (!isAdminConfigured()) {
    return {
      error:
        "Staff creation requires SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    };
  }

  const parsed = createStaffSchema.safeParse({
    full_name: formData.get("full_name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
    role: formData.get("role")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const { full_name, email, password, role } = parsed.data;
  const admin = createAdminClient();

  const { data: authData, error: authError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

  if (authError || !authData.user) {
    return {
      error: authError?.message ?? "Could not create auth user.",
    };
  }

  const supabase = await createClient();
  const { error: staffError } = await supabase.from("staff_accounts").insert({
    id: authData.user.id,
    full_name,
    email,
    role,
    is_active: true,
  });

  if (staffError) {
    await admin.auth.admin.deleteUser(authData.user.id);
    return { error: "Could not create staff account record." };
  }

  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

export async function updateStaff(
  _prev: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const session = await requireSuperAdmin();

  const parsed = updateStaffSchema.safeParse({
    id: formData.get("id")?.toString() ?? "",
    full_name: formData.get("full_name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    role: formData.get("role")?.toString() ?? "",
    is_active: formBool(formData.get("is_active")),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const { id, full_name, email, role, is_active } = parsed.data;

  if (id === session.userId && !is_active) {
    return { error: "You cannot deactivate your own account." };
  }

  if (id === session.userId && role !== "super_admin") {
    return { error: "You cannot change your own role." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("staff_accounts")
    .select("email")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("staff_accounts")
    .update({ full_name, email, role, is_active })
    .eq("id", id);

  if (error) {
    return { error: "Could not update staff account." };
  }

  if (
    isAdminConfigured() &&
    existing &&
    (existing as { email: string }).email !== email
  ) {
    const admin = createAdminClient();
    await admin.auth.admin.updateUserById(id, { email });
  }

  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

export async function deactivateStaffForm(
  formData: FormData
): Promise<void> {
  const id = formData.get("id")?.toString() ?? "";
  await deactivateStaff(id);
}

export async function deactivateStaff(
  id: string
): Promise<UserActionState> {
  const session = await requireSuperAdmin();

  if (id === session.userId) {
    return { error: "You cannot deactivate your own account." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("staff_accounts")
    .update({ is_active: false })
    .eq("id", id);

  if (error) {
    return { error: "Could not deactivate staff account." };
  }

  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

export async function resetStaffPassword(
  _prev: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  await requireSuperAdmin();

  if (!isAdminConfigured()) {
    return {
      error:
        "Password reset requires SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    };
  }

  const parsed = resetPasswordSchema.safeParse({
    id: formData.get("id")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(parsed.data.id, {
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Could not reset password." };
  }

  return { success: true };
}
