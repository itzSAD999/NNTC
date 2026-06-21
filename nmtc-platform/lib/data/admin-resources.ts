import { createClient } from "@/lib/supabase/server";
import type { Resource } from "@/lib/types/expansion";

export async function listAllResources(): Promise<Resource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("sort_order");

  if (error || !data) return [];
  return data as Resource[];
}

export async function getResourceForEdit(id: string): Promise<Resource | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Resource;
}
