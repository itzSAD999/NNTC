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
  if (state.error) return <p className="text-sm text-danger">{state.error}</p>;
  if (state.success) return <p className="text-sm text-primary">Saved.</p>;
  return null;
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

  useEffect(() => {
    if (!slugTouched && name) setSlug(slugify(name));
  }, [name, slugTouched]);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-6">
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
            <Label htmlFor="sort_order">Sort order</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              min={0}
              defaultValue={program?.sort_order ?? 0}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cutoff_points">Cut-off points</Label>
            <Input
              id="cutoff_points"
              name="cutoff_points"
              defaultValue={program?.cutoff_points ?? ""}
            />
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
          <Label>Curriculum by year</Label>
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
                }}
                placeholder="Year 1"
              />
              <Input
                value={row.modules}
                onChange={(e) => {
                  const next = [...modules];
                  next[index] = { ...next[index], modules: e.target.value };
                  setModules(next);
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
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setModules((m) => [
                ...m,
                {
                  year_label: `Year ${m.length + 1}`,
                  modules: "",
                  sort_order: m.length + 1,
                },
              ])
            }
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

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_published"
            value="true"
            defaultChecked={program?.is_published ?? false}
          />
          Published on public site
        </label>

        <SubmitButton label={program ? "Save changes" : "Create programme"} />
      </form>

      {program ? (
        <form action={deleteProgramForm}>
          <input type="hidden" name="id" value={program.id} />
          <Button type="submit" variant="destructive">
            Delete programme
          </Button>
        </form>
      ) : null}
    </div>
  );
}
