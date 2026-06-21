"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireContentStaff } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";
import { postFormSchema } from "@/lib/validation/post";

export type PostActionState = {
  error?: string;
  success?: boolean;
  id?: string;
};

function formBool(value: FormDataEntryValue | null): boolean {
  return value === "true" || value === "on" || value === "1";
}

function parsePostForm(formData: FormData) {
  return postFormSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    excerpt: formData.get("excerpt")?.toString() ?? "",
    body: formData.get("body")?.toString() ?? "",
    category: formData.get("category")?.toString() ?? "",
    cover_image_url: formData.get("cover_image_url")?.toString() ?? "",
    is_pinned: formBool(formData.get("is_pinned")),
    published: formBool(formData.get("published")),
  });
}

export async function createPost(
  _prev: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const session = await requireContentStaff();
  const parsed = parsePostForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const data = parsed.data;
  const supabase = await createClient();

  const { data: created, error } = await supabase
    .from("posts")
    .insert({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt ?? "",
      body: data.body,
      category: data.category,
      cover_image_url: data.cover_image_url || null,
      is_pinned: data.is_pinned ?? false,
      published_at: data.published ? new Date().toISOString() : null,
      author_id: session.userId,
    })
    .select("id")
    .single();

  if (error || !created) {
    if (error?.code === "23505") {
      return { error: "A post with this slug already exists." };
    }
    return { error: "Could not create post." };
  }

  revalidatePath("/dashboard/admin/news");
  revalidatePath("/news");
  redirect(`/dashboard/admin/news/${(created as { id: string }).id}`);
}

export async function updatePost(
  _prev: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString() ?? "";
  if (!id) return { error: "Post ID is required." };

  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const data = parsed.data;
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("posts")
    .select("published_at")
    .eq("id", id)
    .single();

  let publishedAt: string | null =
    (existing as { published_at: string | null } | null)?.published_at ?? null;

  if (data.published && !publishedAt) {
    publishedAt = new Date().toISOString();
  } else if (!data.published) {
    publishedAt = null;
  }

  const { error } = await supabase
    .from("posts")
    .update({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt ?? "",
      body: data.body,
      category: data.category,
      cover_image_url: data.cover_image_url || null,
      is_pinned: data.is_pinned ?? false,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "A post with this slug already exists." };
    }
    return { error: "Could not update post." };
  }

  revalidatePath("/dashboard/admin/news");
  revalidatePath(`/dashboard/admin/news/${id}`);
  revalidatePath("/news");
  revalidatePath(`/news/${data.slug}`);
  return { success: true };
}

export async function togglePostPublishedForm(
  formData: FormData
): Promise<void> {
  const id = formData.get("id")?.toString() ?? "";
  await togglePostPublished(id);
}

export async function togglePostPinnedForm(
  formData: FormData
): Promise<void> {
  const id = formData.get("id")?.toString() ?? "";
  await togglePostPinned(id);
}

export async function deletePostForm(formData: FormData): Promise<void> {
  const id = formData.get("id")?.toString() ?? "";
  await deletePost(id);
}

export async function togglePostPublished(
  id: string
): Promise<PostActionState> {
  await requireContentStaff();
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("published_at, slug")
    .eq("id", id)
    .single();

  if (!post) return { error: "Post not found." };

  const row = post as { published_at: string | null; slug: string };
  const publishedAt = row.published_at
    ? null
    : new Date().toISOString();

  const { error } = await supabase
    .from("posts")
    .update({
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: "Could not update publish status." };

  revalidatePath("/dashboard/admin/news");
  revalidatePath("/news");
  revalidatePath(`/news/${row.slug}`);
  return { success: true };
}

export async function togglePostPinned(id: string): Promise<PostActionState> {
  await requireContentStaff();
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("is_pinned")
    .eq("id", id)
    .single();

  if (!post) return { error: "Post not found." };

  const { error } = await supabase
    .from("posts")
    .update({
      is_pinned: !(post as { is_pinned: boolean }).is_pinned,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: "Could not update pin status." };

  revalidatePath("/dashboard/admin/news");
  revalidatePath("/news");
  return { success: true };
}

export async function deletePost(id: string): Promise<PostActionState> {
  await requireContentStaff();
  const supabase = await createClient();

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) return { error: "Could not delete post." };

  revalidatePath("/dashboard/admin/news");
  revalidatePath("/news");
  redirect("/dashboard/admin/news");
}
