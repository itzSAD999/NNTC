"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  createEvent,
  deleteEventForm,
  updateEvent,
  type EventActionState,
} from "@/lib/actions/events";
import { slugify } from "@/lib/utils/slug";
import type { CollegeEvent } from "@/lib/types/expansion";
import { ImageUploadField } from "@/components/admin/image-upload-field";
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

function Message({ state }: { state: EventActionState }) {
  if (state.error) return <p className="text-sm text-danger">{state.error}</p>;
  if (state.success) return <p className="text-sm text-primary">Saved.</p>;
  return null;
}

function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({ event }: { event?: CollegeEvent }) {
  const action = event ? updateEvent : createEvent;
  const [state, formAction] = useFormState(action, {});
  const [title, setTitle] = useState(event?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(event?.slug));
  const [coverUrl, setCoverUrl] = useState(event?.cover_image_url ?? "");

  useEffect(() => {
    if (!slugTouched && title) setSlug(slugify(title));
  }, [title, slugTouched]);

  return (
    <div className="space-y-6">
      <form action={formAction} className="max-w-2xl space-y-6">
        {event ? <input type="hidden" name="id" value={event.id} /> : null}
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
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              defaultValue={event?.location ?? ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="starts_at">Starts</Label>
            <Input
              id="starts_at"
              name="starts_at"
              type="datetime-local"
              defaultValue={toDatetimeLocal(event?.starts_at)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ends_at">Ends (optional)</Label>
            <Input
              id="ends_at"
              name="ends_at"
              type="datetime-local"
              defaultValue={toDatetimeLocal(event?.ends_at)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="registration_url">Registration URL</Label>
            <Input
              id="registration_url"
              name="registration_url"
              type="url"
              defaultValue={event?.registration_url ?? ""}
            />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              id="is_past"
              name="is_past"
              value="true"
              defaultChecked={event?.is_past ?? false}
              className="h-4 w-4"
            />
            <Label htmlFor="is_past">Mark as past event</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={event?.description ?? ""}
            required
          />
        </div>

        <ImageUploadField
          name="cover_image_url"
          label="Cover image"
          value={coverUrl}
          folder="events"
          onChange={setCoverUrl}
        />

        <SubmitButton label={event ? "Save changes" : "Create event"} />
      </form>

      {event ? (
        <form action={deleteEventForm} className="max-w-2xl pt-4">
          <input type="hidden" name="id" value={event.id} />
          <Button type="submit" variant="outline" className="text-danger">
            Delete event
          </Button>
        </form>
      ) : null}
    </div>
  );
}
