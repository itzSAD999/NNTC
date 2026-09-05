"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  deleteCampusSectionForm,
  saveCampusSection,
  type CampusActionState,
} from "@/lib/actions/campus";
import type { CampusSection } from "@/lib/types/expansion";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Saving…" : "Save section"}
    </Button>
  );
}

function SectionEditor({ section }: { section: CampusSection }) {
  const [state, action] = useFormState(saveCampusSection, {});
  const [imageUrl, setImageUrl] = useState(section.image_url ?? "");
  const [dirty, setDirty] = useState(false);

  useUnsavedChanges(dirty);

  useEffect(() => {
    if (state.success) setDirty(false);
  }, [state.success]);

  return (
    <form
      action={action}
      className="space-y-4"
      {...createUnsavedFormProps(setDirty)}
    >
      <input type="hidden" name="id" value={section.id} />
      <input type="hidden" name="section_key" value={section.section_key} />
      <FormMessage error={state.error} success={state.success} />
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
        <SortOrderLabel htmlFor={`sort-${section.id}`} />
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
        onChange={(value) => {
          setImageUrl(value);
          setDirty(true);
        }}
      />
      <StickyFormFooter>
        <UnsavedChangesLabel show={dirty} />
        <SubmitButton />
        <DeleteConfirmButton
          action={deleteCampusSectionForm}
          confirmMessage={`Delete the "${section.title}" section? This cannot be undone.`}
          buttonLabel="Delete section"
          hiddenFields={{ id: section.id }}
        />
      </StickyFormFooter>
    </form>
  );
}

function NewSectionForm() {
  const [state, action] = useFormState(saveCampusSection, {});

  return (
    <AdminSectionCard
      title="Add section"
      description="Create a new block on the Campus Life page. The section ID is set once and cannot be changed later."
    >
      <form action={action} className="space-y-4">
        <FormMessage error={state.error} success={state.success} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new_key">Section ID (internal)</Label>
            <Input
              id="new_key"
              name="section_key"
              placeholder="e.g. sports-clubs"
              required
            />
            <FieldHint>
              Short lowercase ID with hyphens. Visitors only see the Title.
            </FieldHint>
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
    </AdminSectionCard>
  );
}

export function CampusEditor({ sections }: { sections: CampusSection[] }) {
  const [openId, setOpenId] = useState<string | null>(sections[0]?.id ?? null);

  return (
    <div className="space-y-6">
      {sections.length > 0 ? (
        <>
          <nav aria-label="Campus sections" className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setOpenId(section.id)}
                className={cn(
                  "rounded border px-3 py-1.5 text-sm transition-colors",
                  openId === section.id
                    ? "border-primary bg-primary/10 font-medium text-primary"
                    : "border-line bg-surface text-caption hover:text-ink"
                )}
              >
                {section.title}
              </button>
            ))}
          </nav>

          {openId ? (
            <AdminSectionCard
              title={
                sections.find((s) => s.id === openId)?.title ?? "Section"
              }
              description={
                <>
                  Section ID:{" "}
                  <span className="ref-mono">
                    {sections.find((s) => s.id === openId)?.section_key}
                  </span>
                </>
              }
            >
              <SectionEditor
                section={sections.find((s) => s.id === openId)!}
              />
            </AdminSectionCard>
          ) : (
            <p className="text-sm text-caption">
              Select a section above to edit it.
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-caption">
          No sections yet. Add your first section below.
        </p>
      )}

      <NewSectionForm />
    </div>
  );
}
