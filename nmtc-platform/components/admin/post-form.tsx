"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

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
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  FieldHint,
  SlugField,
} from "@/components/admin/admin-help";
import { FormMessage } from "@/components/admin/admin-layout";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-form";
import {
  UnsavedChangesLabel,
  createUnsavedFormProps,
} from "@/components/admin/unsaved-changes";
import { useUnsavedChanges } from "@/lib/hooks/use-unsaved-changes";
import { PUBLISH_HINT } from "@/lib/admin/page-guides";
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
  return (
    <FormMessage error={state.error} success={state.success} />
  );
}

type PostFormProps = {
  post?: Post;
};

export function PostForm({ post }: PostFormProps) {
  const action = post ? updatePost : createPost;
  const [state, formAction] = useActionState(action, {});
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? "");
  const [dirty, setDirty] = useState(false);

  useUnsavedChanges(dirty);

  useEffect(() => {
    if (!slugTouched && title) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched]);

  useEffect(() => {
    if (state.success) setDirty(false);
  }, [state.success]);

  return (
    <div className="space-y-4">
      <form
        action={formAction}
        className="space-y-6"
        {...createUnsavedFormProps(setDirty)}
      >
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
            <SlugField
              value={slug}
              basePath="/news"
              onChange={(value) => {
                setSlugTouched(true);
                setSlug(value);
              }}
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
            <Label htmlFor="excerpt">Short summary</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              defaultValue={post?.excerpt ?? ""}
            />
            <FieldHint>
              One or two sentences shown on the news list and homepage — not the
              full article.
            </FieldHint>
          </div>
        </div>

        <ImageUploadField
          name="cover_image_url"
          label="Cover image"
          value={coverUrl}
          folder="news"
          onChange={(value) => {
            setCoverUrl(value);
            setDirty(true);
          }}
        />

        <div className="space-y-2">
          <Label>Body</Label>
          <TiptapEditor name="body" defaultValue={post?.body ?? ""} />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex max-w-xs flex-col gap-1 text-sm">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                name="published"
                value="true"
                defaultChecked={Boolean(post?.published_at)}
              />
              Published on public site
            </span>
            <FieldHint>{PUBLISH_HINT}</FieldHint>
          </label>
          <label className="flex max-w-xs flex-col gap-1 text-sm">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_pinned"
                value="true"
                defaultChecked={post?.is_pinned ?? false}
              />
              Pin to top of news list
            </span>
            <FieldHint>
              Pinned articles stay above other news until unpinned.
            </FieldHint>
          </label>
        </div>

        <StickyFormFooter>
          <UnsavedChangesLabel show={dirty} />
          <SubmitButton label={post ? "Save changes" : "Create post"} />
        </StickyFormFooter>
      </form>

      {post ? (
        <DeleteConfirmButton
          action={deletePostForm}
          confirmMessage="Delete this post permanently? This cannot be undone."
          buttonLabel="Delete post"
          hiddenFields={{ id: post.id }}
          variant="destructive"
        />
      ) : null}
    </div>
  );
}
