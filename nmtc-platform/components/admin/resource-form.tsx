"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  createResource,
  deleteResourceForm,
  updateResource,
  type ResourceActionState,
} from "@/lib/actions/resources";
import type { Resource } from "@/lib/types/expansion";
import { DocumentUploadField } from "@/components/admin/document-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = [
  "Handbook",
  "Timetable",
  "Health Guidelines",
  "Forms",
  "Academic Calendar",
] as const;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

function Message({ state }: { state: ResourceActionState }) {
  if (state.error) return <p className="text-sm text-danger">{state.error}</p>;
  if (state.success) return <p className="text-sm text-primary">Saved.</p>;
  return null;
}

export function ResourceForm({ resource }: { resource?: Resource }) {
  const action = resource ? updateResource : createResource;
  const [state, formAction] = useFormState(action, {});
  const [fileUrl, setFileUrl] = useState(resource?.file_url ?? "");

  return (
    <div className="space-y-6">
      <form action={formAction} className="max-w-2xl space-y-6">
        {resource ? <input type="hidden" name="id" value={resource.id} /> : null}
        <Message state={state} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={resource?.title ?? ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              defaultValue={resource?.category ?? CATEGORIES[0]}
              className="flex h-10 w-full rounded border border-line bg-bg px-3 text-sm"
              required
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort order</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              min={0}
              defaultValue={resource?.sort_order ?? 0}
            />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              id="is_published"
              name="is_published"
              value="true"
              defaultChecked={resource?.is_published ?? true}
              className="h-4 w-4"
            />
            <Label htmlFor="is_published">Published</Label>
          </div>
        </div>

        <DocumentUploadField
          name="file_url"
          label="Document file"
          value={fileUrl}
          onChange={setFileUrl}
        />

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={resource?.description ?? ""}
          />
        </div>

        <SubmitButton label={resource ? "Save changes" : "Create resource"} />
      </form>

      {resource ? (
        <form action={deleteResourceForm} className="max-w-2xl pt-4">
          <input type="hidden" name="id" value={resource.id} />
          <Button type="submit" variant="outline" className="text-danger">
            Delete resource
          </Button>
        </form>
      ) : null}
    </div>
  );
}
