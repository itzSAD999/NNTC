"use server";

import { revalidatePath } from "next/cache";

import { requireContentStaff } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";

export type CampusActionState = { error?: string; success?: boolean };

export async function saveCampusSection(
  _prev: CampusActionState,
  formData: FormData
): Promise<CampusActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString();
  const section_key = formData.get("section_key")?.toString()?.trim();
  const title = formData.get("title")?.toString()?.trim();
  const body = formData.get("body")?.toString() ?? "";
  const image_url = formData.get("image_url")?.toString() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);

  if (!section_key || !title) {
    return { error: "Section key and title are required." };
  }

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase
      .from("campus_sections")
      .update({ title, body, image_url, sort_order })
      .eq("id", id);
    if (error) return { error: "Could not save section." };
  } else {
    const { error } = await supabase.from("campus_sections").insert({
      section_key,
      title,
      body,
      image_url,
      sort_order,
    });
    if (error) return { error: "Could not create section. Key may exist." };
  }

  revalidatePath("/campus-life");
  revalidatePath("/dashboard/admin/campus-life");
  return { success: true };
}

export async function deleteCampusSectionForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("campus_sections").delete().eq("id", id);

  revalidatePath("/campus-life");
  revalidatePath("/dashboard/admin/campus-life");
}
