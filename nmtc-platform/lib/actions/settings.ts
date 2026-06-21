"use server";

import { revalidatePath } from "next/cache";

import { requireSuperAdmin } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";
import {
  documentFeeSchema,
  settingsFormSchema,
} from "@/lib/validation/settings";

export type SettingsActionState = {
  error?: string;
  success?: boolean;
};

export async function updateSettings(
  _prev: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  await requireSuperAdmin();

  const logoUrl = formData.get("logo_url")?.toString() ?? "";

  const parsed = settingsFormSchema.safeParse({
    college_name: formData.get("college_name")?.toString() ?? "",
    motto: formData.get("motto")?.toString() ?? "",
    logo_url: logoUrl,
    primary_color: formData.get("primary_color")?.toString() ?? "",
    accent_color: formData.get("accent_color")?.toString() ?? "",
    notification_email_template:
      formData.get("notification_email_template")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("settings")
    .update({
      college_name: data.college_name,
      motto: data.motto ?? "",
      logo_url: data.logo_url || null,
      primary_color: data.primary_color,
      accent_color: data.accent_color,
      notification_email_template: data.notification_email_template || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    return { error: "Could not save settings." };
  }

  revalidatePath("/dashboard/admin/settings");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateDocumentTypeFee(
  _prev: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  await requireSuperAdmin();

  const parsed = documentFeeSchema.safeParse({
    id: formData.get("id")?.toString() ?? "",
    fee_amount: formData.get("fee_amount")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("document_types")
    .update({
      fee_amount: parsed.data.fee_amount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);

  if (error) {
    return { error: "Could not update document fee." };
  }

  revalidatePath("/dashboard/admin/settings");
  revalidatePath("/request");
  return { success: true };
}
