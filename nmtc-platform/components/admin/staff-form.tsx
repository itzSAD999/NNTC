"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  createStaff,
  deleteStaffForm,
  updateStaff,
  type StaffActionState,
} from "@/lib/actions/staff";
import { slugify } from "@/lib/utils/slug";
import type { Department, StaffProfile } from "@/lib/types/expansion";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  FieldHint,
  SlugField,
  SortOrderLabel,
} from "@/components/admin/admin-help";
import { FormMessage } from "@/components/admin/admin-layout";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-form";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";
import {
  UnsavedChangesLabel,
  createUnsavedFormProps,
} from "@/components/admin/unsaved-changes";
import { useUnsavedChanges } from "@/lib/hooks/use-unsaved-changes";
import { PUBLISH_HINT } from "@/lib/admin/page-guides";
import { TiptapEditor } from "@/components/cms/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

function Message({ state }: { state: StaffActionState }) {
  return <FormMessage error={state.error} success={state.success} />;
}

export function StaffForm({
  departments,
  profile,
}: {
  departments: Department[];
  profile?: StaffProfile;
}) {
  const action = profile ? updateStaff : createStaff;
  const [state, formAction] = useActionState(action, {});
  const [name, setName] = useState(profile?.full_name ?? "");
  const [slug, setSlug] = useState(profile?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(profile?.slug));
  const [photoUrl, setPhotoUrl] = useState(profile?.photo_url ?? "");
  const [dirty, setDirty] = useState(false);

  useUnsavedChanges(dirty);

  useEffect(() => {
    if (!slugTouched && name) setSlug(slugify(name));
  }, [name, slugTouched]);

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
        {profile ? <input type="hidden" name="id" value={profile.id} /> : null}
        <Message state={state} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <SlugField
              value={slug}
              basePath="/faculty"
              onChange={(value) => {
                setSlugTouched(true);
                setSlug(value);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department_id">Department</Label>
            <select
              id="department_id"
              name="department_id"
              defaultValue={profile?.department_id ?? departments[0]?.id}
              className="flex h-10 w-full rounded border border-line bg-bg px-3 text-sm"
              required
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="job_title">Job title</Label>
            <Input
              id="job_title"
              name="job_title"
              defaultValue={profile?.job_title ?? ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification / specialisation</Label>
            <Input
              id="qualification"
              name="qualification"
              defaultValue={profile?.qualification ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="work_email">Work email</Label>
            <Input
              id="work_email"
              name="work_email"
              type="email"
              defaultValue={profile?.work_email ?? ""}
            />
          </div>
          <div className="space-y-2">
            <SortOrderLabel htmlFor="sort_order" />
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              min={0}
              defaultValue={profile?.sort_order ?? 0}
            />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm" htmlFor="is_published">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                value="true"
                defaultChecked={profile?.is_published ?? false}
                className="h-4 w-4"
              />
              Published on public site
            </label>
            <FieldHint>{PUBLISH_HINT}</FieldHint>
          </div>
        </div>

        <ImageUploadField
          name="photo_url"
          label="Photo"
          value={photoUrl}
          folder="staff"
          onChange={(value) => {
            setPhotoUrl(value);
            setDirty(true);
          }}
        />

        <div className="space-y-2">
          <Label>Bio</Label>
          <TiptapEditor name="bio" defaultValue={profile?.bio ?? ""} />
        </div>

        <StickyFormFooter>
          <UnsavedChangesLabel show={dirty} />
          <SubmitButton label={profile ? "Save changes" : "Create profile"} />
        </StickyFormFooter>
      </form>

      {profile ? (
        <DeleteConfirmButton
          action={deleteStaffForm}
          confirmMessage="Delete this staff profile permanently? This cannot be undone."
          buttonLabel="Delete profile"
          hiddenFields={{ id: profile.id }}
        />
      ) : null}
    </div>
  );
}
