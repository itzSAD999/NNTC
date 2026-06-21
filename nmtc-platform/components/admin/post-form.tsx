"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  deletePostForm,
  updatePost,
  createPost,
  type PostActionState,
} from "@/lib/actions/posts";
import { POST_CATEGORIES } from "@/lib/validation/post";
import { slugify } from "@/lib/utils/slug";
import type { Post } from "@/types/database";
import { TiptapEditor } from "@/components/cms/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

function Message({ state }: { state: PostActionState }) {
  if (state.error) {
    return <p className="text-sm text-danger">{state.error}</p>;
  }
  if (state.success) {
    return <p className="text-sm text-primary">Saved successfully.</p>;
  }
  return null;
}

type PostFormProps = {
  post?: Post;
};

export function PostForm({ post }: PostFormProps) {
  const action = post ? updatePost : createPost;
  const [state, formAction] = useFormState(action, {});
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));

  useEffect(() => {
    if (!slugTouched && title) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched]);

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-6">
        {post ? <input type="hidden" name="id" value={post.id} /> : null}
        <Message state={state} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              defaultValue={post?.category ?? POST_CATEGORIES[0]}
              className="flex h-9 w-full rounded border border-line bg-bg px-3 text-sm"
              required
            >
              {POST_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              defaultValue={post?.excerpt ?? ""}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cover_image_url">Cover image URL</Label>
            <Input
              id="cover_image_url"
              name="cover_image_url"
              type="url"
              defaultValue={post?.cover_image_url ?? ""}
              placeholder="https://…"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Body</Label>
          <TiptapEditor name="body" defaultValue={post?.body ?? ""} />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              value="true"
              defaultChecked={Boolean(post?.published_at)}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_pinned"
              value="true"
              defaultChecked={post?.is_pinned ?? false}
            />
            Pin to top
          </label>
        </div>

        <SubmitButton label={post ? "Save changes" : "Create post"} />
      </form>

      {post ? (
        <form action={deletePostForm}>
          <input type="hidden" name="id" value={post.id} />
          <Button type="submit" variant="destructive">
            Delete post
          </Button>
        </form>
      ) : null}
    </div>
  );
}
