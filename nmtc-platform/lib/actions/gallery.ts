"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireContentStaff } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";

export type GalleryActionState = { error?: string; success?: boolean };

export async function saveGalleryAlbum(
  _prev: GalleryActionState,
  formData: FormData
): Promise<GalleryActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString()?.trim() ?? "";
  const slug =
    formData.get("slug")?.toString()?.trim() || slugify(title);
  const sort_order = Number(formData.get("sort_order") ?? 0);

  if (!title) return { error: "Album title is required." };

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase
      .from("gallery_albums")
      .update({ title, slug, sort_order })
      .eq("id", id);
    if (error) return { error: "Could not save album." };
  } else {
    const { error } = await supabase
      .from("gallery_albums")
      .insert({ title, slug, sort_order });
    if (error) return { error: "Could not create album. Slug may exist." };
  }

  revalidatePath("/gallery");
  revalidatePath("/dashboard/admin/gallery");
  return { success: true };
}

export async function deleteGalleryAlbumForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("gallery_albums").delete().eq("id", id);

  revalidatePath("/gallery");
  revalidatePath("/dashboard/admin/gallery");
}

export async function saveGalleryMedia(
  _prev: GalleryActionState,
  formData: FormData
): Promise<GalleryActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString();
  const album_id = formData.get("album_id")?.toString();
  const type = formData.get("type")?.toString() as "image" | "video";
  const url = formData.get("url")?.toString()?.trim() ?? "";
  const caption = formData.get("caption")?.toString() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);

  if (!album_id || !url) return { error: "Album and URL are required." };
  if (type !== "image" && type !== "video") {
    return { error: "Invalid media type." };
  }

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase
      .from("gallery_media")
      .update({ type, url, caption, sort_order })
      .eq("id", id);
    if (error) return { error: "Could not save media." };
  } else {
    const { error } = await supabase.from("gallery_media").insert({
      album_id,
      type,
      url,
      caption,
      sort_order,
    });
    if (error) return { error: "Could not add media." };
  }

  revalidatePath("/gallery");
  revalidatePath("/dashboard/admin/gallery");
  return { success: true };
}

export async function deleteGalleryMediaForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("gallery_media").delete().eq("id", id);

  revalidatePath("/gallery");
  revalidatePath("/dashboard/admin/gallery");
}
