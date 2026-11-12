import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  previewPublishedStaff,
  previewStaffBySlug,
  PREVIEW_DEPARTMENTS,
} from "@/lib/data/preview-expansion";
import type { Department, StaffProfileWithDepartment } from "@/lib/types/expansion";

function mapStaffRows(
  data: Array<Record<string, unknown>>
): StaffProfileWithDepartment[] {
  return data.map((row) => {
    const dept = row.department as
      | { name: string; slug: string }
      | { name: string; slug: string }[]
      | null;
    const department = Array.isArray(dept) ? dept[0] : dept;
    const { department: _d, ...profile } = row;
    return { ...profile, department: department ?? null } as StaffProfileWithDepartment;
  });
}

export async function getPublishedStaff(): Promise<StaffProfileWithDepartment[]> {
  if (!isSupabaseConfigured()) return previewPublishedStaff();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("staff_profiles")
      .select("*, department:departments(name, slug)")
      .eq("is_published", true)
      .order("sort_order");

    if (error || !data || data.length === 0) return previewPublishedStaff();
    return mapStaffRows(data as Array<Record<string, unknown>>);
  } catch {
    return previewPublishedStaff();
  }
}

export async function getStaffBySlug(
  slug: string
): Promise<StaffProfileWithDepartment | null> {
  if (!isSupabaseConfigured()) return previewStaffBySlug(slug);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("staff_profiles")
      .select("*, department:departments(name, slug)")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !data) return previewStaffBySlug(slug);
    return mapStaffRows([data as Record<string, unknown>])[0] ?? null;
  } catch {
    return previewStaffBySlug(slug);
  }
}

export async function getDepartmentsForFilter(): Promise<Department[]> {
  if (!isSupabaseConfigured()) return PREVIEW_DEPARTMENTS;

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("departments").select("*").order("name");
    if (data && data.length > 0) return data as Department[];
    return PREVIEW_DEPARTMENTS;
  } catch {
    return PREVIEW_DEPARTMENTS;
  }
}

export async function getAllStaffSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return previewPublishedStaff().map((s) => s.slug);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("staff_profiles")
      .select("slug")
      .eq("is_published", true);
    if (error || !data || data.length === 0) {
      return previewPublishedStaff().map((s) => s.slug);
    }
    return (data as Array<{ slug: string }>).map((r) => r.slug);
  } catch {
    return previewPublishedStaff().map((s) => s.slug);
  }
}
