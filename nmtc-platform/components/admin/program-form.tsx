"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  createProgram,
  deleteProgramForm,
  updateProgram,
  type ProgramActionState,
} from "@/lib/actions/programs";
import { slugify } from "@/lib/utils/slug";
import type { Department, ProgramDetail } from "@/lib/types/expansion";
import { TiptapEditor } from "@/components/cms/tiptap-editor";
import {
  FieldHint,
  SlugField,
  SortOrderLabel,
} from "@/components/admin/admin-help";
import { FormMessage } from "@/components/admin/admin-layout";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-form";
import {
  UnsavedChangesLabel,
  createUnsavedFormProps,
} from "@/components/admin/unsaved-changes";
import { useUnsavedChanges } from "@/lib/hooks/use-unsaved-changes";
import { PUBLISH_HINT } from "@/lib/admin/page-guides";
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

function Message({ state }: { state: ProgramActionState }) {
  return <FormMessage error={state.error} success={state.success} />;
}

type ModuleRow = { year_label: string; modules: string; sort_order: number };

type ProgramFormProps = {
  departments: Department[];
  program?: ProgramDetail;
};

export function ProgramForm({ departments, program }: ProgramFormProps) {
  const action = program ? updateProgram : createProgram;
  const [state, formAction] = useFormState(action, {});
  const [name, setName] = useState(program?.name ?? "");
  const [slug, setSlug] = useState(program?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(program?.slug));
  const [modules, setModules] = useState<ModuleRow[]>(
    program?.modules.map((m) => ({
      year_label: m.year_label,
      modules: m.modules.join(", "),
      sort_order: m.sort_order,
    })) ?? [{ year_label: "Year 1", modules: "", sort_order: 1 }]
  );
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
        className="space-y-6"
        {...createUnsavedFormProps(setDirty)}
      >
        {program ? <input type="hidden" name="id" value={program.id} /> : null}
        <Message state={state} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Programme name</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <SlugField
              value={slug}
              basePath="/programs"
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
              defaultValue={program?.department_id ?? departments[0]?.id}
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
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              name="duration"
              defaultValue={program?.duration ?? ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              name="qualification"
              defaultValue={program?.qualification ?? ""}
              required
            />
          </div>
          <div className="space-y-2">
            <SortOrderLabel htmlFor="sort_order" />
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              min={0}
              defaultValue={program?.sort_order ?? 0}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cutoff_points">Cut-off points (WASSCE)</Label>
            <Input
              id="cutoff_points"
              name="cutoff_points"
              defaultValue={program?.cutoff_points ?? ""}
            />
            <FieldHint>
              Optional. Shown on the programme page if filled in — e.g. aggregate
              score required for admission.
            </FieldHint>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <TiptapEditor name="description" defaultValue={program?.description ?? ""} />
        </div>
        <div className="space-y-2">
          <Label>Entry requirements</Label>
          <TiptapEditor
            name="entry_requirements"
            defaultValue={program?.entry_requirements ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label>Career prospects</Label>
          <TiptapEditor
            name="career_prospects"
            defaultValue={program?.career_prospects ?? ""}
          />
        </div>

        <div className="space-y-3">
          <div>
            <Label>Curriculum by year</Label>
            <FieldHint>
              List modules for each year, separated by commas. Use Add year for
              each additional year of study.
            </FieldHint>
          </div>
          {modules.map((row, index) => (
            <div
              key={index}
              className="grid gap-3 rounded border border-line p-4 sm:grid-cols-[1fr_2fr_auto]"
            >
              <Input
                value={row.year_label}
                onChange={(e) => {
                  const next = [...modules];
                  next[index] = { ...next[index], year_label: e.target.value };
                  setModules(next);
                  setDirty(true);
                }}
                placeholder="Year 1"
              />
              <Input
                value={row.modules}
                onChange={(e) => {
                  const next = [...modules];
                  next[index] = { ...next[index], modules: e.target.value };
                  setModules(next);
                  setDirty(true);
                }}
                placeholder="Module A, Module B"
              />
              <Input
                type="number"
                className="w-20"
                value={row.sort_order}
                onChange={(e) => {
                  const next = [...modules];
                  next[index] = {
                    ...next[index],
                    sort_order: Number(e.target.value),
                  };
                  setModules(next);
                  setDirty(true);
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setModules((m) => [
                ...m,
                {
                  year_label: `Year ${m.length + 1}`,
                  modules: "",
                  sort_order: m.length + 1,
                },
              ]);
              setDirty(true);
            }}
          >
            Add year
          </Button>
          <input
            type="hidden"
            name="modules_json"
            value={JSON.stringify(
              modules.map((m) => ({
                year_label: m.year_label,
                modules: m.modules,
                sort_order: m.sort_order,
              }))
            )}
          />
        </div>

        <label className="flex max-w-md flex-col gap-1 text-sm">
          <span className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_published"
              value="true"
              defaultChecked={program?.is_published ?? false}
            />
            Published on public site
          </span>
          <FieldHint>{PUBLISH_HINT}</FieldHint>
        </label>

        <StickyFormFooter>
          <UnsavedChangesLabel show={dirty} />
          <SubmitButton label={program ? "Save changes" : "Create programme"} />
        </StickyFormFooter>
      </form>

      {program ? (
        <DeleteConfirmButton
          action={deleteProgramForm}
          confirmMessage="Delete this programme permanently? This cannot be undone."
          buttonLabel="Delete programme"
          hiddenFields={{ id: program.id }}
          variant="destructive"
        />
      ) : null}
    </div>
  );
}
