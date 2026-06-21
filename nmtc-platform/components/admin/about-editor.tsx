"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  deleteAccreditationForm,
  deleteOrgUnitForm,
  saveAccreditation,
  saveOrgUnit,
  updateAboutContent,
  type AboutActionState,
} from "@/lib/actions/about";
import type { AboutAdminData } from "@/lib/data/admin-about";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { TiptapEditor } from "@/components/cms/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton({ label, size = "default" }: { label: string; size?: "default" | "sm" }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size={size} disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

function Message({ state }: { state: AboutActionState }) {
  if (state.error) return <p className="text-sm text-danger">{state.error}</p>;
  if (state.success) return <p className="text-sm text-primary">Saved.</p>;
  return null;
}

export function AboutEditor({ data }: { data: AboutAdminData }) {
  const [contentState, contentAction] = useFormState(updateAboutContent, {});
  const [principalPhoto, setPrincipalPhoto] = useState(
    data.about.principal_photo_url ?? ""
  );
  const coreValuesText = data.about.core_values.join("\n");

  return (
    <div className="space-y-12">
      <section className="rounded border border-line bg-surface p-6">
        <h2 className="font-serif text-display-sm">About content</h2>
        <form action={contentAction} className="mt-6 space-y-4">
          <Message state={contentState} />
          <div className="space-y-2">
            <Label>History</Label>
            <TiptapEditor name="history" defaultValue={data.about.history ?? ""} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vision">Vision</Label>
              <Textarea id="vision" name="vision" rows={3} defaultValue={data.about.vision} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mission">Mission</Label>
              <Textarea id="mission" name="mission" rows={3} defaultValue={data.about.mission} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="core_values">Core values (one per line)</Label>
            <Textarea
              id="core_values"
              name="core_values"
              rows={4}
              defaultValue={coreValuesText}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="principal_name">Principal name</Label>
              <Input
                id="principal_name"
                name="principal_name"
                defaultValue={data.about.principal_name ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="principal_title">Principal title</Label>
              <Input
                id="principal_title"
                name="principal_title"
                defaultValue={data.about.principal_title ?? ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Principal message</Label>
            <TiptapEditor
              name="principal_message"
              defaultValue={data.about.principal_message ?? ""}
            />
          </div>
          <ImageUploadField
            name="principal_photo_url"
            label="Principal photo"
            value={principalPhoto}
            folder="about"
            onChange={setPrincipalPhoto}
          />
          <SubmitButton label="Save about content" />
        </form>
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-display-sm">Accreditations</h2>
        {data.accreditations.map((acc) => (
          <AccreditationRow key={acc.id} acc={acc} />
        ))}
        <AccreditationRow />
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-display-sm">Organisation units</h2>
        {data.orgUnits.map((unit) => (
          <OrgUnitRow key={unit.id} unit={unit} allUnits={data.orgUnits} />
        ))}
        <OrgUnitRow allUnits={data.orgUnits} />
      </section>
    </div>
  );
}

function AccreditationRow({
  acc,
}: {
  acc?: AboutAdminData["accreditations"][0];
}) {
  const [state, action] = useFormState(saveAccreditation, {});
  const [logoUrl, setLogoUrl] = useState(acc?.logo_url ?? "");

  return (
    <div className="rounded border border-line bg-surface p-4">
      <form action={action} className="space-y-3">
        {acc ? <input type="hidden" name="id" value={acc.id} /> : null}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-2">
            <Label>Body name</Label>
            <Input name="body_name" defaultValue={acc?.body_name ?? ""} required />
          </div>
          <div className="space-y-2">
            <Label>Sort order</Label>
            <Input name="sort_order" type="number" defaultValue={acc?.sort_order ?? 0} />
          </div>
          <div className="space-y-2 sm:col-span-3">
            <Label>Accreditation number</Label>
            <Input name="accreditation_no" defaultValue={acc?.accreditation_no ?? ""} />
          </div>
        </div>
        <ImageUploadField
          name="logo_url"
          label="Logo"
          value={logoUrl}
          folder="accreditations"
          onChange={setLogoUrl}
        />
        <Message state={state} />
        <SubmitButton label={acc ? "Save" : "Add accreditation"} size="sm" />
      </form>
      {acc ? (
        <form action={deleteAccreditationForm} className="mt-2">
          <input type="hidden" name="id" value={acc.id} />
          <Button type="submit" size="sm" variant="outline" className="text-danger">
            Delete
          </Button>
        </form>
      ) : null}
    </div>
  );
}

function OrgUnitRow({
  unit,
  allUnits,
}: {
  unit?: AboutAdminData["orgUnits"][0];
  allUnits: AboutAdminData["orgUnits"];
}) {
  const [state, action] = useFormState(saveOrgUnit, {});
  const parents = allUnits.filter((u) => !unit || u.id !== unit.id);

  return (
    <div className="rounded border border-line bg-surface p-4">
      <form action={action} className="space-y-3">
        {unit ? <input type="hidden" name="id" value={unit.id} /> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Unit name</Label>
            <Input name="name" defaultValue={unit?.name ?? ""} required />
          </div>
          <div className="space-y-2">
            <Label>Head name</Label>
            <Input name="head_name" defaultValue={unit?.head_name ?? ""} required />
          </div>
          <div className="space-y-2">
            <Label>Parent unit</Label>
            <select
              name="parent_id"
              defaultValue={unit?.parent_id ?? ""}
              className="flex h-10 w-full rounded border border-line bg-bg px-3 text-sm"
            >
              <option value="">None (top level)</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Sort order</Label>
            <Input name="sort_order" type="number" defaultValue={unit?.sort_order ?? 0} />
          </div>
        </div>
        <Message state={state} />
        <SubmitButton label={unit ? "Save" : "Add unit"} size="sm" />
      </form>
      {unit ? (
        <form action={deleteOrgUnitForm} className="mt-2">
          <input type="hidden" name="id" value={unit.id} />
          <Button type="submit" size="sm" variant="outline" className="text-danger">
            Delete
          </Button>
        </form>
      ) : null}
    </div>
  );
}
