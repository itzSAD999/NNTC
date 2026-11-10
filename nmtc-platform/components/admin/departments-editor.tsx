"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  createDepartment,
  deleteDepartmentForm,
  updateDepartment,
  type DepartmentActionState,
} from "@/lib/actions/departments";
import { slugify } from "@/lib/utils/slug";
import type { Department } from "@/lib/types/expansion";
import {
  AdminSectionCard,
  AdminTable,
  AdminTableHead,
  AdminTableTh,
  FormMessage,
} from "@/components/admin/admin-layout";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldHint, SlugField } from "@/components/admin/admin-help";
import { EmptyState } from "@/components/ui/empty-state";
import { matchesSearch } from "@/lib/admin/list-filters";
import { AdminListFilterBar } from "@/components/admin/admin-list-filters";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? "Saving…" : label}
    </Button>
  );
}

function Message({ state }: { state: DepartmentActionState }) {
  return <FormMessage error={state.error} success={state.success} />;
}

function DepartmentRow({ department }: { department: Department }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState(updateDepartment, {});
  const [name, setName] = useState(department.name);
  const [slug, setSlug] = useState(department.slug);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (state.success) setEditing(false);
  }, [state.success]);

  useEffect(() => {
    if (!slugTouched && name) setSlug(slugify(name));
  }, [name, slugTouched]);

  if (!editing) {
    return (
      <tr className="border-b border-line last:border-0">
        <td className="px-4 py-3 font-medium text-ink">{department.name}</td>
        <td className="px-4 py-3 text-caption ref-mono">
          internal/{department.slug}
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
            <DeleteConfirmButton
              action={deleteDepartmentForm}
              confirmMessage={`Delete "${department.name}"? Programmes and staff linked to this department may be affected.`}
              buttonLabel="Delete"
              hiddenFields={{ id: department.id }}
            />
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-line bg-bg/50">
      <td colSpan={3} className="px-4 py-4">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={department.id} />
          <Message state={state} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`name-${department.id}`}>Name</Label>
              <Input
                id={`name-${department.id}`}
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <SlugField
                id={`slug-${department.id}`}
                value={slug}
                basePath="/departments"
                onChange={(value) => {
                  setSlugTouched(true);
                  setSlug(value);
                }}
              />
              <FieldHint>
                Used internally to link programmes and staff — not a separate
                public page.
              </FieldHint>
            </div>
          </div>
          <div className="flex gap-2">
            <SubmitButton label="Save" />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </td>
    </tr>
  );
}

function AddDepartmentForm() {
  const [state, formAction] = useActionState(createDepartment, {});
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!slugTouched && name) setSlug(slugify(name));
  }, [name, slugTouched]);

  useEffect(() => {
    if (state.success) {
      setName("");
      setSlug("");
      setSlugTouched(false);
    }
  }, [state.success]);

  return (
    <AdminSectionCard
      title="Add department"
      description="Departments group programmes and staff profiles — they do not have their own public page."
    >
      <form action={formAction} className="space-y-4">
        <Message state={state} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dept-name">Name</Label>
            <Input
              id="dept-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nursing Department"
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <SlugField
              id="dept-slug"
              value={slug}
              basePath="/departments"
              onChange={(value) => {
                setSlugTouched(true);
                setSlug(value);
              }}
            />
            <FieldHint>
              Filled in from the name. Used internally — departments do not have
              their own public page.
            </FieldHint>
          </div>
        </div>
        <SubmitButton label="Add department" />
      </form>
    </AdminSectionCard>
  );
}

export function DepartmentsEditor({
  departments,
}: {
  departments: Department[];
}) {
  const [search, setSearch] = useState("");

  const filteredDepartments = useMemo(() => {
    return departments.filter((d) =>
      matchesSearch(search, [d.name, d.slug])
    );
  }, [departments, search]);

  return (
    <div className="space-y-6">
      <AddDepartmentForm />

      {departments.length === 0 ? (
        <EmptyState message="No departments yet. Add one above — programmes and staff profiles link to departments." />
      ) : (
        <div className="space-y-4">
          <AdminListFilterBar
            search={search}
            onSearchChange={setSearch}
            showStatus={false}
            searchPlaceholder="Search departments…"
            total={departments.length}
            filtered={filteredDepartments.length}
          />
          {filteredDepartments.length === 0 ? (
            <EmptyState message="No departments match your search." />
          ) : (
        <AdminTable minWidth="560px">
          <AdminTableHead>
            <AdminTableTh>Name</AdminTableTh>
            <AdminTableTh>Internal link</AdminTableTh>
            <AdminTableTh>Actions</AdminTableTh>
          </AdminTableHead>
          <tbody>
            {filteredDepartments.map((d) => (
              <DepartmentRow key={d.id} department={d} />
            ))}
          </tbody>
        </AdminTable>
          )}
        </div>
      )}
    </div>
  );
}
