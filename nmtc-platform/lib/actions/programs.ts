"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireContentStaff } from "@/lib/auth/permissions";
import { redirectWithNotice } from "@/lib/admin/redirect-notice";
import { createClient } from "@/lib/supabase/server";
import { programFormSchema } from "@/lib/validation/program";

export type ProgramActionState = { error?: string; success?: boolean };

function formBool(value: FormDataEntryValue | null): boolean {
  return value === "true" || value === "on" || value === "1";
}

function parseModulesJson(raw: string): { year_label: string; modules: string[]; sort_order: number }[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item, index) => {
        if (!item || typeof item !== "object") return null;
        const row = item as Record<string, unknown>;
        const modulesRaw = row.modules;
        const modules =
          typeof modulesRaw === "string"
            ? modulesRaw.split(",").map((s) => s.trim()).filter(Boolean)
            : Array.isArray(modulesRaw)
              ? modulesRaw.map(String)
              : [];
        return {
          year_label: String(row.year_label ?? `Year ${index + 1}`),
          modules,
          sort_order: Number(row.sort_order ?? index + 1),
        };
      })
      .filter(Boolean) as { year_label: string; modules: string[]; sort_order: number }[];
  } catch {
    return [];
  }
}

export async function createProgram(
  _prev: ProgramActionState,
  formData: FormData
): Promise<ProgramActionState> {
  await requireContentStaff();

  const parsed = programFormSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    department_id: formData.get("department_id")?.toString() ?? "",
    duration: formData.get("duration")?.toString() ?? "",
    qualification: formData.get("qualification")?.toString() ?? "",
    entry_requirements: formData.get("entry_requirements")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    career_prospects: formData.get("career_prospects")?.toString() ?? "",
    cutoff_points: formData.get("cutoff_points")?.toString() ?? "",
    sort_order: formData.get("sort_order")?.toString() ?? "0",
    is_published: formBool(formData.get("is_published")),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const data = parsed.data;
  const supabase = await createClient();

  const { data: created, error } = await supabase
    .from("programs")
    .insert({
      name: data.name,
      slug: data.slug,
      department_id: data.department_id,
      duration: data.duration,
      qualification: data.qualification,
      entry_requirements: data.entry_requirements ?? "",
      description: data.description ?? "",
      career_prospects: data.career_prospects ?? "",
      cutoff_points: data.cutoff_points || null,
      sort_order: data.sort_order ?? 0,
      is_published: data.is_published ?? false,
    })
    .select("id")
    .single();

  if (error || !created) {
    return { error: error?.code === "23505" ? "Slug already exists." : "Could not create programme." };
  }

  const programId = (created as { id: string }).id;
  const modules = parseModulesJson(formData.get("modules_json")?.toString() ?? "[]");

  if (modules.length) {
    await supabase.from("program_modules").insert(
      modules.map((m) => ({
        program_id: programId,
        year_label: m.year_label,
        modules: m.modules,
        sort_order: m.sort_order,
      }))
    );
  }

  revalidatePath("/programs");
  redirect(`/dashboard/admin/programs/${programId}`);
}

export async function updateProgram(
  _prev: ProgramActionState,
  formData: FormData
): Promise<ProgramActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString() ?? "";
  if (!id) return { error: "Programme ID required." };

  const parsed = programFormSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    department_id: formData.get("department_id")?.toString() ?? "",
    duration: formData.get("duration")?.toString() ?? "",
    qualification: formData.get("qualification")?.toString() ?? "",
    entry_requirements: formData.get("entry_requirements")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    career_prospects: formData.get("career_prospects")?.toString() ?? "",
    cutoff_points: formData.get("cutoff_points")?.toString() ?? "",
    sort_order: formData.get("sort_order")?.toString() ?? "0",
    is_published: formBool(formData.get("is_published")),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("programs")
    .update({
      name: data.name,
      slug: data.slug,
      department_id: data.department_id,
      duration: data.duration,
      qualification: data.qualification,
      entry_requirements: data.entry_requirements ?? "",
      description: data.description ?? "",
      career_prospects: data.career_prospects ?? "",
      cutoff_points: data.cutoff_points || null,
      sort_order: data.sort_order ?? 0,
      is_published: data.is_published ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "Slug already exists." : "Could not update programme." };
  }

  const modules = parseModulesJson(formData.get("modules_json")?.toString() ?? "[]");
  await supabase.from("program_modules").delete().eq("program_id", id);
  if (modules.length) {
    await supabase.from("program_modules").insert(
      modules.map((m) => ({
        program_id: id,
        year_label: m.year_label,
        modules: m.modules,
        sort_order: m.sort_order,
      }))
    );
  }

  revalidatePath("/programs");
  revalidatePath(`/programs/${data.slug}`);
  revalidatePath("/dashboard/admin/programs");
  revalidatePath(`/dashboard/admin/programs/${id}`);
  return { success: true };
}

export async function toggleProgramPublishedForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString() ?? "";
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("programs")
    .select("is_published, slug")
    .eq("id", id)
    .single();

  if (!row) return;

  await supabase
    .from("programs")
    .update({
      is_published: !(row as { is_published: boolean }).is_published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/programs");
  revalidatePath("/dashboard/admin/programs");
  redirectWithNotice(
    "/dashboard/admin/programs",
    (row as { is_published: boolean }).is_published
      ? "unpublished"
      : "published"
  );
}

export async function deleteProgramForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString() ?? "";
  const supabase = await createClient();
  await supabase.from("programs").delete().eq("id", id);
  revalidatePath("/programs");
  redirect("/dashboard/admin/programs");
}
