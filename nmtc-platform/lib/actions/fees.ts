"use server";

import { revalidatePath } from "next/cache";

import { requireContentStaff } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";
import {
  feeSchema,
  financialAidContentSchema,
  paymentMethodSchema,
  scholarshipSchema,
} from "@/lib/validation/fees";

export type FeesActionState = { error?: string; success?: boolean };

export async function updateFinancialAidContent(
  _prev: FeesActionState,
  formData: FormData
): Promise<FeesActionState> {
  await requireContentStaff();

  const parsed = financialAidContentSchema.safeParse({
    payment_schedule: formData.get("payment_schedule")?.toString() ?? "",
    sltf_info: formData.get("sltf_info")?.toString() ?? "",
    hardship_policy: formData.get("hardship_policy")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("financial_aid_content").upsert({
    id: 1,
    payment_schedule: parsed.data.payment_schedule ?? "",
    sltf_info: parsed.data.sltf_info ?? "",
    hardship_policy: parsed.data.hardship_policy ?? "",
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: "Could not save financial aid content." };

  revalidatePath("/financial-aid");
  revalidatePath("/dashboard/admin/fees");
  return { success: true };
}

export async function saveFee(
  _prev: FeesActionState,
  formData: FormData
): Promise<FeesActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString();
  const programId = formData.get("program_id")?.toString() ?? "";

  const parsed = feeSchema.safeParse({
    program_id: programId,
    year_label: formData.get("year_label")?.toString() ?? "",
    fee_type: formData.get("fee_type")?.toString() ?? "",
    amount: formData.get("amount")?.toString() ?? "",
    due_note: formData.get("due_note")?.toString() ?? "",
    sort_order: formData.get("sort_order")?.toString() ?? "0",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const payload = {
    program_id: parsed.data.program_id || null,
    year_label: parsed.data.year_label,
    fee_type: parsed.data.fee_type,
    amount: parsed.data.amount,
    due_note: parsed.data.due_note ?? "",
    sort_order: parsed.data.sort_order,
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("fees").update(payload).eq("id", id)
    : await supabase.from("fees").insert(payload);

  if (error) return { error: "Could not save fee." };

  revalidatePath("/financial-aid");
  revalidatePath("/dashboard/admin/fees");
  return { success: true };
}

export async function deleteFeeForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString() ?? "";
  const supabase = await createClient();
  await supabase.from("fees").delete().eq("id", id);
  revalidatePath("/financial-aid");
  revalidatePath("/dashboard/admin/fees");
}

export async function savePaymentMethod(
  _prev: FeesActionState,
  formData: FormData
): Promise<FeesActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString();
  const parsed = paymentMethodSchema.safeParse({
    method: formData.get("method")?.toString() ?? "",
    details: formData.get("details")?.toString() ?? "",
    sort_order: formData.get("sort_order")?.toString() ?? "0",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const payload = {
    method: parsed.data.method,
    details: parsed.data.details ?? "",
    sort_order: parsed.data.sort_order,
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("payment_methods").update(payload).eq("id", id)
    : await supabase.from("payment_methods").insert(payload);

  if (error) return { error: "Could not save payment method." };

  revalidatePath("/financial-aid");
  revalidatePath("/dashboard/admin/fees");
  return { success: true };
}

export async function deletePaymentMethodForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString() ?? "";
  const supabase = await createClient();
  await supabase.from("payment_methods").delete().eq("id", id);
  revalidatePath("/financial-aid");
  revalidatePath("/dashboard/admin/fees");
}

export async function saveScholarship(
  _prev: FeesActionState,
  formData: FormData
): Promise<FeesActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString();
  const parsed = scholarshipSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    eligibility: formData.get("eligibility")?.toString() ?? "",
    how_to_apply: formData.get("how_to_apply")?.toString() ?? "",
    external_url: formData.get("external_url")?.toString() ?? "",
    sort_order: formData.get("sort_order")?.toString() ?? "0",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const payload = {
    name: parsed.data.name,
    eligibility: parsed.data.eligibility ?? "",
    how_to_apply: parsed.data.how_to_apply ?? "",
    external_url: parsed.data.external_url || null,
    sort_order: parsed.data.sort_order,
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("scholarships").update(payload).eq("id", id)
    : await supabase.from("scholarships").insert(payload);

  if (error) return { error: "Could not save scholarship." };

  revalidatePath("/financial-aid");
  revalidatePath("/dashboard/admin/fees");
  return { success: true };
}

export async function deleteScholarshipForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString() ?? "";
  const supabase = await createClient();
  await supabase.from("scholarships").delete().eq("id", id);
  revalidatePath("/financial-aid");
  revalidatePath("/dashboard/admin/fees");
}
