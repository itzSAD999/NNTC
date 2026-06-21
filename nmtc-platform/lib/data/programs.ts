import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  previewProgramBySlug,
  previewProgramsWithDepartments,
} from "@/lib/data/preview-expansion";
import type { ProgramDetail, ProgramWithDepartment } from "@/lib/types/expansion";

export async function getPublishedPrograms(): Promise<ProgramWithDepartment[]> {
  if (!isSupabaseConfigured()) {
    return previewProgramsWithDepartments();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programs")
      .select("*, department:departments(name, slug)")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return previewProgramsWithDepartments();

    return (data as Array<Record<string, unknown>>).map((row) => {
      const dept = row.department as
        | { name: string; slug: string }
        | { name: string; slug: string }[]
        | null;
      const department = Array.isArray(dept) ? dept[0] : dept;
      const { department: _d, ...program } = row;
      return { ...program, department: department ?? null } as ProgramWithDepartment;
    });
  } catch {
    return previewProgramsWithDepartments();
  }
}

export async function getProgramBySlug(slug: string): Promise<ProgramDetail | null> {
  if (!isSupabaseConfigured()) {
    return previewProgramBySlug(slug);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programs")
      .select("*, department:departments(name, slug), modules:program_modules(*)")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !data) return previewProgramBySlug(slug);

    const row = data as Record<string, unknown>;
    const dept = row.department as
      | { name: string; slug: string }
      | { name: string; slug: string }[]
      | null;
    const modules = (row.modules as ProgramDetail["modules"] | undefined) ?? [];
    const department = Array.isArray(dept) ? dept[0] : dept;
    const { department: _d, modules: _m, ...program } = row;

    return {
      ...(program as Omit<ProgramDetail, "department" | "modules">),
      department: department ?? null,
      modules: [...modules].sort((a, b) => a.sort_order - b.sort_order),
    };
  } catch {
    return previewProgramBySlug(slug);
  }
}

export async function getAllProgramSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return previewProgramsWithDepartments().map((p) => p.slug);
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("programs")
      .select("slug")
      .eq("is_published", true);

    return (data ?? []).map((r) => (r as { slug: string }).slug);
  } catch {
    return [];
  }
}
