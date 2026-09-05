"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  createResource,
  deleteResourceForm,
  updateResource,
  type ResourceActionState,
} from "@/lib/actions/resources";
import type { Resource } from "@/lib/types/expansion";
import { DocumentUploadField } from "@/components/admin/document-upload-field";
import { FormMessage } from "@/components/admin/admin-layout";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-form";
import {
  UnsavedChangesLabel,
  createUnsavedFormProps,
} from "@/components/admin/unsaved-changes";
import { useUnsavedChanges } from "@/lib/hooks/use-unsaved-changes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { RESOURCE_CATEGORIES } from "@/lib/validation/resource";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

function Message({ state }: { state: ResourceActionState }) {
  return <FormMessage error={state.error} success={state.success} />;
}

export function ResourceForm({ resource }: { resource?: Resource }) {
  const action = resource ? updateResource : createResource;
  const [state, formAction] = useFormState(action, {});
  const [fileUrl, setFileUrl] = useState(resource?.file_url ?? "");
  const [dirty, setDirty] = useState(false);

  useUnsavedChanges(dirty);

  useEffect(() => {
    if (state.success) setDirty(false);
  }, [state.success]);

  return (
    <div className="space-y-6">
      <form
        action={formAction}
        className="max-w-2xl space-y-6"
        {...createUnsavedFormProps(setDirty)}
      >
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
              defaultValue={resource?.category ?? RESOURCE_CATEGORIES[0]}
              className="flex h-10 w-full rounded border border-line bg-bg px-3 text-sm"
              required
            >
              {RESOURCE_CATEGORIES.map((c) => (
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
          onChange={(value) => {
            setFileUrl(value);
            setDirty(true);
          }}
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

        <StickyFormFooter>
          <UnsavedChangesLabel show={dirty} />
          <SubmitButton label={resource ? "Save changes" : "Create resource"} />
        </StickyFormFooter>
      </form>

      {resource ? (
        <DeleteConfirmButton
          action={deleteResourceForm}
          confirmMessage="Delete this resource permanently? This cannot be undone."
          buttonLabel="Delete resource"
          hiddenFields={{ id: resource.id }}
        />
      ) : null}
    </div>
  );
}
