"use server";

import { revalidatePath } from "next/cache";

import { requireAcademicStaff } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";
import { departmentFormSchema } from "@/lib/validation/department";

export type DepartmentActionState = { error?: string; success?: boolean };

export async function createDepartment(
  _prev: DepartmentActionState,
  formData: FormData
): Promise<DepartmentActionState> {
  await requireAcademicStaff();

  const parsed = departmentFormSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("departments").insert(parsed.data);

  if (error) {
    return { error: "Could not create department. Slug may already exist." };
  }

  revalidatePath("/dashboard/admin/departments");
  revalidatePath("/dashboard/admin/programs");
  revalidatePath("/dashboard/admin/staff");
  revalidatePath("/programs");
  revalidatePath("/faculty");
  return { success: true };
}

export async function updateDepartment(
  _prev: DepartmentActionState,
  formData: FormData
): Promise<DepartmentActionState> {
  await requireAcademicStaff();

  const id = formData.get("id")?.toString();
  if (!id) return { error: "Missing department ID." };

  const parsed = departmentFormSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("departments")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    return { error: "Could not save department. Slug may already exist." };
  }

  revalidatePath("/dashboard/admin/departments");
  revalidatePath("/dashboard/admin/programs");
  revalidatePath("/dashboard/admin/staff");
  revalidatePath("/programs");
  revalidatePath("/faculty");
  return { success: true };
}

export async function deleteDepartmentForm(formData: FormData): Promise<void> {
  await requireAcademicStaff();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("departments").delete().eq("id", id);

  revalidatePath("/dashboard/admin/departments");
  revalidatePath("/dashboard/admin/programs");
  revalidatePath("/dashboard/admin/staff");
}
