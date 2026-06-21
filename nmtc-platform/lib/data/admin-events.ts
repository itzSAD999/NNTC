import { createClient } from "@/lib/supabase/server";
import type { CollegeEvent } from "@/lib/types/expansion";

export async function listAllEvents(): Promise<CollegeEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: false });

  if (error || !data) return [];
  return data as CollegeEvent[];
}

export async function getEventForEdit(id: string): Promise<CollegeEvent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as CollegeEvent;
}
