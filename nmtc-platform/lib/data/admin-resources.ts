import { withPreview } from "@/lib/data/admin-preview";
import { PREVIEW_RESOURCES } from "@/lib/data/preview-expansion";
import { createClient } from "@/lib/supabase/server";
import type { Resource } from "@/lib/types/expansion";

export async function listAllResources(): Promise<Resource[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("sort_order");

    if (error || !data) return PREVIEW_RESOURCES;
    return withPreview(data as Resource[], PREVIEW_RESOURCES);
  } catch {
    return PREVIEW_RESOURCES;
  }
}

export async function getResourceForEdit(id: string): Promise<Resource | null> {
  const preview = PREVIEW_RESOURCES.find((resource) => resource.id === id) ?? null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return preview;
    return data as Resource;
  } catch {
    return preview;
  }
}
