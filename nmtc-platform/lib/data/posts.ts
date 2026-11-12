import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PREVIEW_POSTS } from "@/lib/data/preview";
import type { Post } from "@/types/database";

export type PostWithAuthor = Post & {
  author: { full_name: string } | null;
};

function previewPosts(limit?: number): Post[] {
  const sorted = [...PREVIEW_POSTS].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return (
      new Date(b.published_at ?? 0).getTime() -
      new Date(a.published_at ?? 0).getTime()
    );
  });
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getLatestPosts(limit = 3): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    return previewPosts(limit);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("is_pinned", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return previewPosts(limit);
    }

    return data as Post[];
  } catch {
    return previewPosts(limit);
  }
}

export async function getPublishedPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    return previewPosts();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("is_pinned", { ascending: false })
      .order("published_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return previewPosts();
    }

    return data as Post[];
  } catch {
    return previewPosts();
  }
}

export async function getPostBySlug(
  slug: string
): Promise<PostWithAuthor | null> {
  if (!isSupabaseConfigured()) {
    const post = PREVIEW_POSTS.find((p) => p.slug === slug);
    return post ? { ...post, author: { full_name: "NMTC Communications" } } : null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*, author:staff_accounts(full_name)")
      .eq("slug", slug)
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .single();

    if (error || !data) {
      const fallback = PREVIEW_POSTS.find((p) => p.slug === slug);
      return fallback ? { ...fallback, author: { full_name: "NMTC Communications" } } : null;
    }

    return data as PostWithAuthor;
  } catch {
    const fallback = PREVIEW_POSTS.find((p) => p.slug === slug);
    return fallback ? { ...fallback, author: { full_name: "NMTC Communications" } } : null;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return PREVIEW_POSTS.map((p) => p.slug);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("slug")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString());

    if (error || !data || data.length === 0) {
      return PREVIEW_POSTS.map((p) => p.slug);
    }

    return (data as Array<{ slug: string }>).map((row) => row.slug);
  } catch {
    return PREVIEW_POSTS.map((p) => p.slug);
  }
}
