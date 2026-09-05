import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isEventPast } from "@/lib/events/dates";
import {
  previewEventBySlug,
  previewUpcomingEvents,
  PREVIEW_EVENTS,
} from "@/lib/data/preview-expansion";
import type { CollegeEvent } from "@/lib/types/expansion";

function sortUpcoming(events: CollegeEvent[]): CollegeEvent[] {
  return [...events]
    .filter((e) => !isEventPast(e.starts_at, e.ends_at))
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
}

function sortPast(events: CollegeEvent[]): CollegeEvent[] {
  return [...events]
    .filter((e) => isEventPast(e.starts_at, e.ends_at))
    .sort((a, b) => b.starts_at.localeCompare(a.starts_at));
}

export async function getUpcomingEvents(limit?: number): Promise<CollegeEvent[]> {
  if (!isSupabaseConfigured()) {
    const items = sortUpcoming(PREVIEW_EVENTS);
    return limit ? items.slice(0, limit) : items;
  }

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .or(
        `and(ends_at.not.is.null,ends_at.gte.${now}),and(ends_at.is.null,starts_at.gte.${now})`
      )
      .order("starts_at", { ascending: true });

    if (error || !data) return previewUpcomingEvents(limit ?? 10);
    const items = data as CollegeEvent[];
    return limit ? items.slice(0, limit) : items;
  } catch {
    return previewUpcomingEvents(limit ?? 10);
  }
}

export async function getPastEvents(): Promise<CollegeEvent[]> {
  if (!isSupabaseConfigured()) {
    return sortPast(PREVIEW_EVENTS);
  }

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .or(
        `and(ends_at.not.is.null,ends_at.lt.${now}),and(ends_at.is.null,starts_at.lt.${now})`
      )
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
