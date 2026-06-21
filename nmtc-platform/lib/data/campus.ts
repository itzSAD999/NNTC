import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PREVIEW_CAMPUS_SECTIONS } from "@/lib/data/preview-expansion";
import type { CampusSection } from "@/lib/types/expansion";

export async function getCampusSections(): Promise<CampusSection[]> {
  if (!isSupabaseConfigured()) return PREVIEW_CAMPUS_SECTIONS;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("campus_sections")
      .select("*")
      .order("sort_order");

    if (error || !data?.length) return PREVIEW_CAMPUS_SECTIONS;
    return data as CampusSection[];
  } catch {
    return PREVIEW_CAMPUS_SECTIONS;
  }
}
