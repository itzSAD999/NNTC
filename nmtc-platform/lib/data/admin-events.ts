import { withPreview } from "@/lib/data/admin-preview";
import { PREVIEW_EVENTS } from "@/lib/data/preview-expansion";
import { createClient } from "@/lib/supabase/server";
import type { CollegeEvent } from "@/lib/types/expansion";

export async function listAllEvents(): Promise<CollegeEvent[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("starts_at", { ascending: false });

    if (error || !data) return PREVIEW_EVENTS;
    return withPreview(data as CollegeEvent[], PREVIEW_EVENTS);
  } catch {
    return PREVIEW_EVENTS;
  }
}

export async function getEventForEdit(id: string): Promise<CollegeEvent | null> {
  const preview = PREVIEW_EVENTS.find((event) => event.id === id) ?? null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return preview;
    return data as CollegeEvent;
  } catch {
    return preview;
  }
}
