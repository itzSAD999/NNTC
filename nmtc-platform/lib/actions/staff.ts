"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStaffDirectoryStaff } from "@/lib/auth/permissions";
import { redirectWithNotice } from "@/lib/admin/redirect-notice";
import { createClient } from "@/lib/supabase/server";
import { staffFormSchema } from "@/lib/validation/staff";

export type StaffActionState = { error?: string; success?: boolean };

function formBool(value: FormDataEntryValue | null): boolean {
  return value === "true" || value === "on" || value === "1";
}

export async function createStaff(
  _prev: StaffActionState,
  formData: FormData
): Promise<StaffActionState> {
  await requireStaffDirectoryStaff();

  const parsed = staffFormSchema.safeParse({
    full_name: formData.get("full_name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    job_title: formData.get("job_title")?.toString() ?? "",
    department_id: formData.get("department_id")?.toString() ?? "",
    qualification: formData.get("qualification")?.toString() ?? "",
    photo_url: formData.get("photo_url")?.toString() ?? "",
    bio: formData.get("bio")?.toString() ?? "",
    work_email: formData.get("work_email")?.toString() ?? "",
    sort_order: formData.get("sort_order")?.toString() ?? "0",
    is_published: formBool(formData.get("is_published")),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const d = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff_profiles")
    .insert({
      full_name: d.full_name,
      slug: d.slug,
      job_title: d.job_title,
      department_id: d.department_id,
      qualification: d.qualification || "",
      photo_url: d.photo_url || null,
      bio: d.bio || null,
      work_email: d.work_email || null,
      sort_order: d.sort_order,
      is_published: d.is_published,
    })
    .select("id")
    .single();

  if (error) return { error: "Could not create profile. Slug may already exist." };

  revalidatePath("/faculty");
  revalidatePath("/dashboard/admin/staff");
  redirect(`/dashboard/admin/staff/${data.id}`);
}

export async function updateStaff(
  _prev: StaffActionState,
  formData: FormData
): Promise<StaffActionState> {
  await requireStaffDirectoryStaff();

  const id = formData.get("id")?.toString();
  if (!id) return { error: "Missing profile ID." };

  const parsed = staffFormSchema.safeParse({
    full_name: formData.get("full_name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    job_title: formData.get("job_title")?.toString() ?? "",
    department_id: formData.get("department_id")?.toString() ?? "",
    qualification: formData.get("qualification")?.toString() ?? "",
    photo_url: formData.get("photo_url")?.toString() ?? "",
    bio: formData.get("bio")?.toString() ?? "",
    work_email: formData.get("work_email")?.toString() ?? "",
    sort_order: formData.get("sort_order")?.toString() ?? "0",
    is_published: formBool(formData.get("is_published")),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const d = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("staff_profiles")
    .update({
      full_name: d.full_name,
      slug: d.slug,
      job_title: d.job_title,
      department_id: d.department_id,
      qualification: d.qualification || "",
      photo_url: d.photo_url || null,
      bio: d.bio || null,
      work_email: d.work_email || null,
      sort_order: d.sort_order,
      is_published: d.is_published,
    })
    .eq("id", id);

  if (error) return { error: "Could not save profile." };

  revalidatePath("/faculty");
  revalidatePath(`/faculty/${d.slug}`);
  revalidatePath("/dashboard/admin/staff");
  return { success: true };
}

export async function toggleStaffPublishedForm(formData: FormData): Promise<void> {
  await requireStaffDirectoryStaff();
  const id = formData.get("id")?.toString();
  const isPublished = formData.get("is_published")?.toString() === "true";
  if (!id) return;

  const supabase = await createClient();
  await supabase
    .from("staff_profiles")
    .update({ is_published: !isPublished })
    .eq("id", id);

  revalidatePath("/faculty");
  revalidatePath("/dashboard/admin/staff");
  redirectWithNotice(
    "/dashboard/admin/staff",
    isPublished ? "unpublished" : "published"
  );
}

export async function deleteStaffForm(formData: FormData): Promise<void> {
  await requireStaffDirectoryStaff();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("staff_profiles").delete().eq("id", id);

  revalidatePath("/faculty");
  revalidatePath("/dashboard/admin/staff");
  redirect("/dashboard/admin/staff");
}
