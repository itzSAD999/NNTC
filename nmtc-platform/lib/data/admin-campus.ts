import { createClient } from "@/lib/supabase/server";
import type { CampusSection } from "@/lib/types/expansion";

export async function listCampusSections(): Promise<CampusSection[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("campus_sections")
    .select("*")
    .order("sort_order");
  return (data ?? []) as CampusSection[];
}
