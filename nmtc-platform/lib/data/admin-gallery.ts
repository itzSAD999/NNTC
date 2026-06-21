import { createClient } from "@/lib/supabase/server";
import type { GalleryAlbum, GalleryAlbumWithMedia, GalleryMedia } from "@/lib/types/expansion";

export async function listGalleryAlbums(): Promise<GalleryAlbumWithMedia[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_albums")
    .select("*, media:gallery_media(*)")
    .order("sort_order");

  if (error || !data) return [];

  return (data as Array<Record<string, unknown>>).map((row) => {
    const media = (row.media as GalleryMedia[]) ?? [];
    const { media: _m, ...album } = row;
    return {
      ...(album as GalleryAlbum),
      media: [...media].sort((a, b) => a.sort_order - b.sort_order),
    };
  });
}

export async function getGalleryAlbum(id: string): Promise<GalleryAlbumWithMedia | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_albums")
    .select("*, media:gallery_media(*)")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  const row = data as Record<string, unknown>;
  const media = (row.media as GalleryMedia[]) ?? [];
  const { media: _m, ...album } = row;
  return {
    ...(album as GalleryAlbum),
    media: [...media].sort((a, b) => a.sort_order - b.sort_order),
  };
}
