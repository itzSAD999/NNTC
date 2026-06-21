"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireContentStaff } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";
import { resourceFormSchema } from "@/lib/validation/resources";

export type ResourceActionState = { error?: string; success?: boolean };

function formBool(value: FormDataEntryValue | null): boolean {
  return value === "true" || value === "on" || value === "1";
}

export async function createResource(
  _prev: ResourceActionState,
  formData: FormData
): Promise<ResourceActionState> {
  await requireContentStaff();

  const parsed = resourceFormSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    category: formData.get("category")?.toString() ?? "",
    file_url: formData.get("file_url")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    sort_order: formData.get("sort_order")?.toString() ?? "0",
    is_published: formBool(formData.get("is_published")),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const d = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .insert({
      title: d.title,
      category: d.category,
      file_url: d.file_url,
      description: d.description || null,
      sort_order: d.sort_order,
      is_published: d.is_published,
    })
    .select("id")
    .single();

  if (error) return { error: "Could not create resource." };

  revalidatePath("/resources");
  revalidatePath("/dashboard/admin/resources");
  redirect(`/dashboard/admin/resources/${data.id}`);
}

export async function updateResource(
  _prev: ResourceActionState,
  formData: FormData
): Promise<ResourceActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString();
  if (!id) return { error: "Missing resource ID." };

  const parsed = resourceFormSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    category: formData.get("category")?.toString() ?? "",
    file_url: formData.get("file_url")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    sort_order: formData.get("sort_order")?.toString() ?? "0",
    is_published: formBool(formData.get("is_published")),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const d = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("resources")
    .update({
      title: d.title,
      category: d.category,
      file_url: d.file_url,
      description: d.description || null,
      sort_order: d.sort_order,
      is_published: d.is_published,
    })
    .eq("id", id);

  if (error) return { error: "Could not save resource." };

  revalidatePath("/resources");
  revalidatePath("/dashboard/admin/resources");
  return { success: true };
}

export async function toggleResourcePublishedForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString();
  const isPublished = formData.get("is_published")?.toString() === "true";
  if (!id) return;

  const supabase = await createClient();
  await supabase
    .from("resources")
    .update({ is_published: !isPublished })
    .eq("id", id);

  revalidatePath("/resources");
  revalidatePath("/dashboard/admin/resources");
}

export async function deleteResourceForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("resources").delete().eq("id", id);

  revalidatePath("/resources");
  revalidatePath("/dashboard/admin/resources");
  redirect("/dashboard/admin/resources");
}
