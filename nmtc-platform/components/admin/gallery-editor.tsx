"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Msg({ state }: { state: GalleryActionState }) {
  if (state.error) return <p className="text-sm text-danger">{state.error}</p>;
  if (state.success) return <p className="text-sm text-primary">Saved.</p>;
  return null;
}

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

function AlbumBlock({ album }: { album: GalleryAlbumWithMedia }) {
  const [albumState, albumAction] = useFormState(saveGalleryAlbum, {});

  return (
    <section className="rounded border border-line bg-surface p-6">
      <form action={albumAction} className="grid gap-4 sm:grid-cols-3">
        <input type="hidden" name="id" value={album.id} />
        <div className="space-y-2 sm:col-span-2">
          <Label>Album title</Label>
          <Input name="title" defaultValue={album.title} required />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input name="slug" defaultValue={album.slug} required />
        </div>
        <div className="space-y-2">
          <Label>Sort order</Label>
          <Input name="sort_order" type="number" defaultValue={album.sort_order} />
        </div>
        <div className="sm:col-span-3">
          <Msg state={albumState} />
          <SubmitBtn label="Save album" />
        </div>
      </form>

      <form action={deleteGalleryAlbumForm} className="mt-2">
        <input type="hidden" name="id" value={album.id} />
        <Button type="submit" size="sm" variant="outline" className="text-danger">
          Delete album
        </Button>
      </form>

      <div className="mt-8 space-y-4">
        <h4 className="text-sm font-medium text-ink">Media items</h4>
        {album.media.map((m) => (
          <MediaRow key={m.id} albumId={album.id} media={m} />
        ))}
        <NewMediaRow albumId={album.id} nextOrder={album.media.length + 1} />
      </div>
    </section>
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
          <div className="space-y-2 sm:col-span-2">
            <Label>Sort order</Label>
            <Input name="sort_order" type="number" defaultValue={media.sort_order} />
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
            <Input name="url" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
        )}
        <Msg state={state} />
        <SubmitBtn label="Save media" />
      </form>
      <form action={deleteGalleryMediaForm} className="mt-2">
        <input type="hidden" name="id" value={media.id} />
        <Button type="submit" size="sm" variant="outline" className="text-danger">
          Remove
        </Button>
      </form>
    </div>
  );
}

function NewMediaRow({ albumId, nextOrder }: { albumId: string; nextOrder: number }) {
  const [state, action] = useFormState(saveGalleryMedia, {});
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"image" | "video">("image");

  return (
    <div className="rounded border border-dashed border-line p-4">
      <p className="text-sm text-caption">Add media</p>
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
        <Msg state={state} />
        <SubmitBtn label="Add media" />
      </form>
    </div>
  );
}

function NewAlbumForm() {
  const [state, action] = useFormState(saveGalleryAlbum, {});

  return (
    <section className="rounded border border-dashed border-line p-6">
      <h3 className="font-serif text-lg">New album</h3>
      <form action={action} className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-2">
          <Label>Title</Label>
          <Input name="title" required />
        </div>
        <div className="space-y-2">
          <Label>Slug (optional)</Label>
          <Input name="slug" placeholder="auto-generated" />
        </div>
        <input type="hidden" name="sort_order" value="99" />
        <div className="sm:col-span-3">
          <Msg state={state} />
          <SubmitBtn label="Create album" />
        </div>
      </form>
    </section>
  );
}

export function GalleryEditor({ albums }: { albums: GalleryAlbumWithMedia[] }) {
  return (
    <div className="space-y-8">
      {albums.map((a) => (
        <AlbumBlock key={a.id} album={a} />
      ))}
      <NewAlbumForm />
    </div>
  );
}
