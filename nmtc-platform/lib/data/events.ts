import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  previewEventBySlug,
  previewUpcomingEvents,
  PREVIEW_EVENTS,
} from "@/lib/data/preview-expansion";
import type { CollegeEvent } from "@/lib/types/expansion";

export async function getUpcomingEvents(limit?: number): Promise<CollegeEvent[]> {
  if (!isSupabaseConfigured()) return previewUpcomingEvents(limit ?? 10);

  try {
    const supabase = await createClient();
    let query = supabase
      .from("events")
      .select("*")
      .eq("is_past", false)
      .order("starts_at", { ascending: true });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error || !data) return previewUpcomingEvents(limit ?? 10);
    return data as CollegeEvent[];
  } catch {
    return previewUpcomingEvents(limit ?? 10);
  }
}

export async function getPastEvents(): Promise<CollegeEvent[]> {
  if (!isSupabaseConfigured()) {
    return PREVIEW_EVENTS.filter((e) => e.is_past).sort((a, b) =>
      b.starts_at.localeCompare(a.starts_at)
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_past", true)
      .order("starts_at", { ascending: false });

    if (error || !data) return [];
    return data as CollegeEvent[];
  } catch {
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<CollegeEvent | null> {
  if (!isSupabaseConfigured()) return previewEventBySlug(slug);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return previewEventBySlug(slug);
    return data as CollegeEvent;
  } catch {
    return previewEventBySlug(slug);
  }
}

export async function getAllEventSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return PREVIEW_EVENTS.map((e) => e.slug);
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("events").select("slug");
    return (data ?? []).map((r) => (r as { slug: string }).slug);
  } catch {
    return [];
  }
}
