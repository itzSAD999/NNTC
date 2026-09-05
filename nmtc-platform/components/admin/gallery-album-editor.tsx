"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  deleteGalleryAlbumForm,
  deleteGalleryMediaForm,
  saveGalleryAlbum,
  saveGalleryMedia,
  type GalleryActionState,
} from "@/lib/actions/gallery";
import type { GalleryAlbumWithMedia } from "@/lib/types/expansion";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { FieldHint, SortOrderLabel } from "@/components/admin/admin-help";
import {
  AdminSectionCard,
  FormMessage,
} from "@/components/admin/admin-layout";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-form";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";
import {
  UnsavedChangesLabel,
  createUnsavedFormProps,
} from "@/components/admin/unsaved-changes";
import { useUnsavedChanges } from "@/lib/hooks/use-unsaved-changes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

function MediaRow({
  albumId,
  media,
}: {
  albumId: string;
  media: GalleryAlbumWithMedia["media"][0];
}) {
  const [state, action] = useFormState(saveGalleryMedia, {});
  const [url, setUrl] = useState(media.url);

  return (
    <div className="rounded border border-line p-4">
      <form action={action} className="space-y-3">
        <input type="hidden" name="id" value={media.id} />
        <input type="hidden" name="album_id" value={albumId} />
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <select
              name="type"
              defaultValue={media.type}
              className="flex h-10 w-full rounded border border-line bg-bg px-3 text-sm"
            >
              <option value="image">Image</option>
              <option value="video">Video URL</option>
            </select>
          </div>
          <div className="space-y-2">
            <SortOrderLabel htmlFor={`media-sort-${media.id}`} />
            <Input
              id={`media-sort-${media.id}`}
              name="sort_order"
              type="number"
              defaultValue={media.sort_order}
            />
          </div>
          <div className="space-y-2 sm:col-span-4">
            <Label>Caption</Label>
            <Input name="caption" defaultValue={media.caption ?? ""} />
          </div>
        </div>
        {media.type === "image" ? (
          <ImageUploadField
            name="url"
            label="Image"
            value={url}
            folder="gallery"
            onChange={setUrl}
          />
        ) : (
          <div className="space-y-2">
            <Label>Video URL</Label>
            <Input
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        )}
        <FormMessage error={state.error} success={state.success} />
        <SubmitBtn label="Save media" />
      </form>
      <DeleteConfirmButton
        action={deleteGalleryMediaForm}
        confirmMessage="Remove this media item from the album?"
        buttonLabel="Remove"
        hiddenFields={{ id: media.id }}
        className="mt-2"
      />
    </div>
  );
}

function NewMediaRow({
  albumId,
  nextOrder,
}: {
  albumId: string;
  nextOrder: number;
}) {
  const [state, action] = useFormState(saveGalleryMedia, {});
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"image" | "video">("image");

  return (
    <div className="rounded border border-dashed border-line p-4">
      <p className="text-sm font-medium text-ink">Add media</p>
      <form action={action} className="mt-3 space-y-3">
        <input type="hidden" name="album_id" value={albumId} />
        <input type="hidden" name="sort_order" value={nextOrder} />
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as "image" | "video")}
          className="flex h-10 rounded border border-line bg-bg px-3 text-sm"
        >
          <option value="image">Image upload</option>
          <option value="video">Video URL</option>
        </select>
        {type === "image" ? (
          <ImageUploadField
            name="url"
            label="Image"
            value={url}
            folder="gallery"
            onChange={setUrl}
          />
        ) : (
          <Input
            name="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        )}
        <Input name="caption" placeholder="Caption (optional)" />
        <FormMessage error={state.error} success={state.success} />
        <SubmitBtn label="Add media" />
      </form>
    </div>
  );
}

export function GalleryAlbumEditor({ album }: { album: GalleryAlbumWithMedia }) {
  const [albumState, albumAction] = useFormState(saveGalleryAlbum, {});
  const [dirty, setDirty] = useState(false);

  useUnsavedChanges(dirty);

  useEffect(() => {
    if (albumState.success) setDirty(false);
  }, [albumState.success]);

  return (
    <div className="space-y-8">
      <AdminSectionCard
        title="Album details"
        description="Update the album title and display order. Delete the album only after removing all media."
      >
        <form
          action={albumAction}
          className="grid gap-4 sm:grid-cols-3"
          {...createUnsavedFormProps(setDirty)}
        >
          <input type="hidden" name="id" value={album.id} />
          <div className="space-y-2 sm:col-span-2">
            <Label>Album title</Label>
            <Input name="title" defaultValue={album.title} required />
          </div>
          <div className="space-y-2">
            <Label>Page link (web address)</Label>
            <Input name="slug" defaultValue={album.slug} required />
            <FieldHint>
              Short name for this album on the Gallery page.
            </FieldHint>
          </div>
          <div className="space-y-2">
            <SortOrderLabel htmlFor="album-sort" />
            <Input
              id="album-sort"
              name="sort_order"
              type="number"
              defaultValue={album.sort_order}
            />
          </div>
          <div className="sm:col-span-3">
            <FormMessage error={albumState.error} success={albumState.success} />
          </div>
          <StickyFormFooter className="sm:col-span-3">
            <UnsavedChangesLabel show={dirty} />
            <SubmitBtn label="Save album" />
            <DeleteConfirmButton
              action={deleteGalleryAlbumForm}
              confirmMessage="Delete this album and all its media? This cannot be undone."
              buttonLabel="Delete album"
              hiddenFields={{ id: album.id }}
            />
          </StickyFormFooter>
        </form>
      </AdminSectionCard>

      <AdminSectionCard
        title="Media items"
        description={`${album.media.length} item${album.media.length === 1 ? "" : "s"} in this album.`}
      >
        <div className="space-y-4">
          {album.media.map((m) => (
            <MediaRow key={m.id} albumId={album.id} media={m} />
          ))}
          <NewMediaRow
            albumId={album.id}
            nextOrder={album.media.length + 1}
          />
        </div>
      </AdminSectionCard>
    </div>
  );
}

export function NewAlbumForm() {
  const [state, action] = useFormState(saveGalleryAlbum, {});

  return (
    <AdminSectionCard
      title="New album"
      description="Create an album first, then open it to add photos and videos."
    >
      <form action={action} className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-2">
          <Label>Title</Label>
          <Input name="title" required />
        </div>
        <div className="space-y-2">
          <Label>Page link (optional)</Label>
          <Input name="slug" placeholder="Filled in from title if left blank" />
          <FieldHint>Short web address for this album on the Gallery page.</FieldHint>
        </div>
        <input type="hidden" name="sort_order" value="99" />
        <div className="sm:col-span-3">
          <FormMessage error={state.error} success={state.success} successLabel="Album created. Open it from the list to add media." />
          <SubmitBtn label="Create album" />
        </div>
      </form>
    </AdminSectionCard>
  );
}
