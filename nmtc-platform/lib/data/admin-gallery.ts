import { previewGalleryAlbums } from "@/lib/data/preview-expansion";
import { createClient } from "@/lib/supabase/server";
import type { GalleryAlbum, GalleryAlbumWithMedia, GalleryMedia } from "@/lib/types/expansion";

function mapAlbum(row: Record<string, unknown>): GalleryAlbumWithMedia {
  const media = (row.media as GalleryMedia[]) ?? [];
  const { media: _m, ...album } = row;
  return {
    ...(album as GalleryAlbum),
    media: [...media].sort((a, b) => a.sort_order - b.sort_order),
  };
}

export async function listGalleryAlbums(): Promise<GalleryAlbumWithMedia[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_albums")
      .select("*, media:gallery_media(*)")
      .order("sort_order");

    if (error || !data || data.length === 0) return previewGalleryAlbums();
    return (data as Array<Record<string, unknown>>).map(mapAlbum);
  } catch {
    return previewGalleryAlbums();
  }
}

export async function getGalleryAlbum(id: string): Promise<GalleryAlbumWithMedia | null> {
  const preview =
    previewGalleryAlbums().find((album) => album.id === id) ?? null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_albums")
      .select("*, media:gallery_media(*)")
      .eq("id", id)
      .single();

    if (error || !data) return preview;
    return mapAlbum(data as Record<string, unknown>);
  } catch {
    return preview;
  }
}
