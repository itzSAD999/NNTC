import { withPreview } from "@/lib/data/admin-preview";
import { PREVIEW_POSTS } from "@/lib/data/preview";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types/database";

export async function listAllPosts(): Promise<Post[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error || !data) return PREVIEW_POSTS;
    return withPreview(data as Post[], PREVIEW_POSTS);
  } catch {
    return PREVIEW_POSTS;
  }
}

export async function getPostForEdit(id: string): Promise<Post | null> {
  const preview = PREVIEW_POSTS.find((post) => post.id === id) ?? null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return preview;
    return data as Post;
  } catch {
    return preview;
  }
}
