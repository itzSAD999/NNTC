"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  deleteCampusSectionForm,
  saveCampusSection,
  type CampusActionState,
} from "@/lib/actions/campus";
import type { CampusSection } from "@/lib/types/expansion";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Saving…" : "Save section"}
    </Button>
  );
}

function Message({ state }: { state: CampusActionState }) {
  if (state.error) return <p className="text-sm text-danger">{state.error}</p>;
  if (state.success) return <p className="text-sm text-primary">Saved.</p>;
  return null;
}

function SectionEditor({ section }: { section: CampusSection }) {
  const [state, action] = useFormState(saveCampusSection, {});
  const [imageUrl, setImageUrl] = useState(section.image_url ?? "");

  return (
    <section className="rounded border border-line bg-surface p-6">
      <h3 className="font-serif text-lg">{section.title}</h3>
      <p className="mt-1 text-xs text-caption">Key: {section.section_key}</p>
      <form action={action} className="mt-6 space-y-4">
        <input type="hidden" name="id" value={section.id} />
        <input type="hidden" name="section_key" value={section.section_key} />
        <Message state={state} />
        <div className="space-y-2">
          <Label htmlFor={`title-${section.id}`}>Title</Label>
          <Input
            id={`title-${section.id}`}
            name="title"
            defaultValue={section.title}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`body-${section.id}`}>Body</Label>
          <Textarea
            id={`body-${section.id}`}
            name="body"
            rows={5}
            defaultValue={section.body}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`sort-${section.id}`}>Sort order</Label>
          <Input
            id={`sort-${section.id}`}
            name="sort_order"
            type="number"
            min={0}
            defaultValue={section.sort_order}
          />
        </div>
        <ImageUploadField
          name="image_url"
          label="Section image"
          value={imageUrl}
          folder="campus"
          onChange={setImageUrl}
        />
        <SubmitButton />
      </form>
      <form action={deleteCampusSectionForm} className="mt-4">
        <input type="hidden" name="id" value={section.id} />
        <Button type="submit" size="sm" variant="outline" className="text-danger">
          Delete section
        </Button>
      </form>
    </section>
  );
}

function NewSectionForm() {
  const [state, action] = useFormState(saveCampusSection, {});

  return (
    <section className="rounded border border-dashed border-line p-6">
      <h3 className="font-serif text-lg">Add section</h3>
      <form action={action} className="mt-6 space-y-4">
        <Message state={state} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new_key">Section key</Label>
            <Input
              id="new_key"
              name="section_key"
              placeholder="e.g. sports"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_title">Title</Label>
            <Input id="new_title" name="title" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="new_body">Body</Label>
          <Textarea id="new_body" name="body" rows={4} />
        </div>
        <input type="hidden" name="image_url" value="" />
        <input type="hidden" name="sort_order" value="99" />
        <SubmitButton />
      </form>
    </section>
  );
}

export function CampusEditor({ sections }: { sections: CampusSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((s) => (
        <SectionEditor key={s.id} section={s} />
      ))}
      <NewSectionForm />
    </div>
  );
}
