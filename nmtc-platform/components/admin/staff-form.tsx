"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  createStaff,
  deleteStaffForm,
  updateStaff,
  type StaffActionState,
} from "@/lib/actions/staff";
import { slugify } from "@/lib/utils/slug";
import type { Department, StaffProfile } from "@/lib/types/expansion";
import { ImageUploadField } from "@/components/admin/image-upload-field";
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
  if (state.error) return <p className="text-sm text-danger">{state.error}</p>;
  if (state.success) return <p className="text-sm text-primary">Saved.</p>;
  return null;
}

export function StaffForm({
  departments,
  profile,
}: {
  departments: Department[];
  profile?: StaffProfile;
}) {
  const action = profile ? updateStaff : createStaff;
  const [state, formAction] = useFormState(action, {});
  const [name, setName] = useState(profile?.full_name ?? "");
  const [slug, setSlug] = useState(profile?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(profile?.slug));
  const [photoUrl, setPhotoUrl] = useState(profile?.photo_url ?? "");

  useEffect(() => {
    if (!slugTouched && name) setSlug(slugify(name));
  }, [name, slugTouched]);

  return (
    <div className="space-y-6">
      <form action={formAction} className="max-w-2xl space-y-6">
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
            <Label htmlFor="sort_order">Sort order</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              min={0}
              defaultValue={profile?.sort_order ?? 0}
            />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              id="is_published"
              name="is_published"
              value="true"
              defaultChecked={profile?.is_published ?? false}
              className="h-4 w-4"
            />
            <Label htmlFor="is_published">Published</Label>
          </div>
        </div>

        <ImageUploadField
          name="photo_url"
          label="Photo"
          value={photoUrl}
          folder="staff"
          onChange={setPhotoUrl}
        />

        <div className="space-y-2">
          <Label>Bio</Label>
          <TiptapEditor name="bio" defaultValue={profile?.bio ?? ""} />
        </div>

        <SubmitButton label={profile ? "Save changes" : "Create profile"} />
      </form>

      {profile ? (
        <form action={deleteStaffForm} className="max-w-2xl pt-4">
          <input type="hidden" name="id" value={profile.id} />
          <Button type="submit" variant="outline" className="text-danger">
            Delete profile
          </Button>
        </form>
      ) : null}
    </div>
  );
}
