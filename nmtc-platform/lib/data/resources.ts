import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { previewPublishedResources } from "@/lib/data/preview-expansion";
import type { Resource } from "@/lib/types/expansion";

export async function getPublishedResources(): Promise<Resource[]> {
  if (!isSupabaseConfigured()) return previewPublishedResources();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");

    if (error || !data) return previewPublishedResources();
    return data as Resource[];
  } catch {
    return previewPublishedResources();
  }
}

export function groupResourcesByCategory(
  resources: Resource[]
): { category: string; items: Resource[] }[] {
  const map = new Map<string, Resource[]>();
  for (const r of resources) {
    const list = map.get(r.category) ?? [];
    list.push(r);
    map.set(r.category, list);
  }
  return Array.from(map.entries()).map(([category, items]) => ({
    category,
    items,
  }));
}
