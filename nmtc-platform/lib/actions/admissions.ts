"use server";

import { revalidatePath } from "next/cache";

import { requireContentStaff } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";
import {
  admissionsContentSchema,
  admissionsFaqSchema,
  documentRequiredSchema,
} from "@/lib/validation/admissions";
import type { AdmissionsProcessStep } from "@/lib/types/expansion";

export type AdmissionsActionState = { error?: string; success?: boolean };

export async function updateAdmissionsContent(
  _prev: AdmissionsActionState,
  formData: FormData
): Promise<AdmissionsActionState> {
  await requireContentStaff();

  const parsed = admissionsContentSchema.safeParse({
    application_form_url: formData.get("application_form_url")?.toString() ?? "",
    application_fee: formData.get("application_fee")?.toString() ?? "",
    payment_instructions: formData.get("payment_instructions")?.toString() ?? "",
    academic_calendar: formData.get("academic_calendar")?.toString() ?? "",
    selection_criteria: formData.get("selection_criteria")?.toString() ?? "",
    process_steps_json: formData.get("process_steps_json")?.toString() ?? "[]",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  let process_steps: AdmissionsProcessStep[] = [];
  try {
    process_steps = JSON.parse(parsed.data.process_steps_json) as AdmissionsProcessStep[];
  } catch {
    return { error: "Process steps must be valid JSON." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("admissions_content")
    .upsert({
      id: 1,
      process_steps,
      application_form_url: parsed.data.application_form_url || null,
      application_fee: parsed.data.application_fee ?? null,
      payment_instructions: parsed.data.payment_instructions ?? "",
      academic_calendar: parsed.data.academic_calendar ?? "",
      selection_criteria: parsed.data.selection_criteria ?? "",
      updated_at: new Date().toISOString(),
    });

  if (error) return { error: "Could not save admissions content." };

  revalidatePath("/admissions");
  revalidatePath("/dashboard/admin/admissions");
  return { success: true };
}

export async function saveDocumentRequired(
  _prev: AdmissionsActionState,
  formData: FormData
): Promise<AdmissionsActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString();
  const parsed = documentRequiredSchema.safeParse({
    label: formData.get("label")?.toString() ?? "",
    sort_order: formData.get("sort_order")?.toString() ?? "0",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const payload = {
    label: parsed.data.label,
    sort_order: parsed.data.sort_order,
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("documents_required").update(payload).eq("id", id)
    : await supabase.from("documents_required").insert(payload);

  if (error) return { error: "Could not save document." };

  revalidatePath("/admissions");
  revalidatePath("/dashboard/admin/admissions");
  return { success: true };
}

export async function deleteDocumentForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString() ?? "";
  const supabase = await createClient();
  await supabase.from("documents_required").delete().eq("id", id);
  revalidatePath("/admissions");
  revalidatePath("/dashboard/admin/admissions");
}

export async function saveAdmissionsFaq(
  _prev: AdmissionsActionState,
  formData: FormData
): Promise<AdmissionsActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString();
  const parsed = admissionsFaqSchema.safeParse({
    question: formData.get("question")?.toString() ?? "",
    answer: formData.get("answer")?.toString() ?? "",
    sort_order: formData.get("sort_order")?.toString() ?? "0",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const payload = {
    question: parsed.data.question,
    answer: parsed.data.answer,
    sort_order: parsed.data.sort_order,
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("admissions_faqs").update(payload).eq("id", id)
    : await supabase.from("admissions_faqs").insert(payload);

  if (error) return { error: "Could not save FAQ." };

  revalidatePath("/admissions");
  revalidatePath("/dashboard/admin/admissions");
  return { success: true };
}

export async function deleteFaqForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString() ?? "";
  const supabase = await createClient();
  await supabase.from("admissions_faqs").delete().eq("id", id);
  revalidatePath("/admissions");
  revalidatePath("/dashboard/admin/admissions");
}
