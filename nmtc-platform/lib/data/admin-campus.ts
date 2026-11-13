import { PREVIEW_CAMPUS_SECTIONS } from "@/lib/data/preview-expansion";
import { createClient } from "@/lib/supabase/server";
import type { CampusSection } from "@/lib/types/expansion";

export async function listCampusSections(): Promise<CampusSection[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("campus_sections")
      .select("*")
      .order("sort_order");
    if (!data || data.length === 0) return PREVIEW_CAMPUS_SECTIONS;
    return data as CampusSection[];
  } catch {
    return PREVIEW_CAMPUS_SECTIONS;
  }
}
