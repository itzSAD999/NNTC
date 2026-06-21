"use server";

import { revalidatePath } from "next/cache";

import { requireContentStaff } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";

export type AboutActionState = { error?: string; success?: boolean };

function parseCoreValues(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function updateAboutContent(
  _prev: AboutActionState,
  formData: FormData
): Promise<AboutActionState> {
  await requireContentStaff();

  const history = formData.get("history")?.toString() ?? "";
  const vision = formData.get("vision")?.toString() ?? "";
  const mission = formData.get("mission")?.toString() ?? "";
  const core_values = parseCoreValues(formData.get("core_values")?.toString() ?? "");
  const principal_name = formData.get("principal_name")?.toString() || null;
  const principal_title = formData.get("principal_title")?.toString() || null;
  const principal_message = formData.get("principal_message")?.toString() || null;
  const principal_photo_url =
    formData.get("principal_photo_url")?.toString() || null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("about_content")
    .update({
      history,
      vision,
      mission,
      core_values,
      principal_name,
      principal_title,
      principal_message,
      principal_photo_url,
    })
    .eq("id", 1);

  if (error) return { error: "Could not save about content." };

  revalidatePath("/about");
  revalidatePath("/");
  revalidatePath("/dashboard/admin/about");
  return { success: true };
}

export async function saveAccreditation(
  _prev: AboutActionState,
  formData: FormData
): Promise<AboutActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString();
  const body_name = formData.get("body_name")?.toString()?.trim() ?? "";
  const accreditation_no = formData.get("accreditation_no")?.toString() || null;
  const logo_url = formData.get("logo_url")?.toString() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);

  if (!body_name) return { error: "Body name is required." };

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase
      .from("accreditations")
      .update({ body_name, accreditation_no, logo_url, sort_order })
      .eq("id", id);
    if (error) return { error: "Could not save accreditation." };
  } else {
    const { error } = await supabase.from("accreditations").insert({
      body_name,
      accreditation_no,
      logo_url,
      sort_order,
    });
    if (error) return { error: "Could not add accreditation." };
  }

  revalidatePath("/about");
  revalidatePath("/dashboard/admin/about");
  return { success: true };
}

export async function deleteAccreditationForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("accreditations").delete().eq("id", id);

  revalidatePath("/about");
  revalidatePath("/dashboard/admin/about");
}

export async function saveOrgUnit(
  _prev: AboutActionState,
  formData: FormData
): Promise<AboutActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString()?.trim() ?? "";
  const head_name = formData.get("head_name")?.toString()?.trim() ?? "";
  const parent_id = formData.get("parent_id")?.toString() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);

  if (!name || !head_name) {
    return { error: "Name and head are required." };
  }

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase
      .from("org_units")
      .update({ name, head_name, parent_id: parent_id || null, sort_order })
      .eq("id", id);
    if (error) return { error: "Could not save org unit." };
  } else {
    const { error } = await supabase.from("org_units").insert({
      name,
      head_name,
      parent_id: parent_id || null,
      sort_order,
    });
    if (error) return { error: "Could not add org unit." };
  }

  revalidatePath("/about");
  revalidatePath("/dashboard/admin/about");
  return { success: true };
}

export async function deleteOrgUnitForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("org_units").delete().eq("id", id);

  revalidatePath("/about");
  revalidatePath("/dashboard/admin/about");
}
