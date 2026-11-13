import { PREVIEW_STAFF, previewPublishedStaff } from "@/lib/data/preview-expansion";
import { createClient } from "@/lib/supabase/server";
import type {
  Department,
  StaffProfile,
  StaffProfileWithDepartment,
} from "@/lib/types/expansion";

export { listDepartments } from "@/lib/data/admin-programs";

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

export async function listAllStaff(): Promise<StaffProfileWithDepartment[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("staff_profiles")
      .select("*, department:departments(name, slug)")
      .order("sort_order");

    if (error || !data || data.length === 0) return previewPublishedStaff();
    return mapStaffRows(data as Array<Record<string, unknown>>);
  } catch {
    return previewPublishedStaff();
  }
}

export async function getStaffForEdit(id: string): Promise<StaffProfile | null> {
  const preview = PREVIEW_STAFF.find((row) => row.id === id) ?? null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("staff_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return preview;
    return data as StaffProfile;
  } catch {
    return preview;
  }
}
