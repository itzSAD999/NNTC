import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { previewGalleryAlbums } from "@/lib/data/preview-expansion";
import type { GalleryAlbumWithMedia } from "@/lib/types/expansion";

export async function getGalleryAlbums(): Promise<GalleryAlbumWithMedia[]> {
  if (!isSupabaseConfigured()) return previewGalleryAlbums();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_albums")
      .select("*, media:gallery_media(*)")
      .order("sort_order");

    if (error || !data || data.length === 0) return previewGalleryAlbums();

    return (data as Array<Record<string, unknown>>).map((row) => {
      const media = (row.media as GalleryAlbumWithMedia["media"] | undefined) ?? [];
      const { media: _m, ...album } = row;
      return {
        ...(album as Omit<GalleryAlbumWithMedia, "media">),
        media: [...media].sort((a, b) => a.sort_order - b.sort_order),
      };
    });
  } catch {
    return previewGalleryAlbums();
  }
}
