"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Building2,
  Award,
  User,
  Eye,
  Compass,
  Sparkles,
  Layers,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";

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
import { AdminSectionCard, FormMessage } from "@/components/admin/admin-layout";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-form";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";
import {
  UnsavedChangesLabel,
  createUnsavedFormProps,
} from "@/components/admin/unsaved-changes";
import { useUnsavedChanges } from "@/lib/hooks/use-unsaved-changes";
import { TiptapEditor } from "@/components/cms/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function SubmitButton({
  label,
  size = "default",
}: {
  label: string;
  size?: "default" | "sm";
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size={size} disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

function Message({ state }: { state: AboutActionState }) {
  return <FormMessage error={state.error} success={state.success} />;
}

type AboutTab = "mission" | "principal" | "accreditations" | "org";

export function AboutEditor({ data }: { data: AboutAdminData }) {
  const [activeTab, setActiveTab] = useState<AboutTab>("mission");
  const [contentState, contentAction] = useActionState(updateAboutContent, {});
  const [principalPhoto, setPrincipalPhoto] = useState(
    data.about.principal_photo_url ?? ""
  );
  const coreValuesText = data.about.core_values.join("\n");
  const [dirty, setDirty] = useState(false);

  useUnsavedChanges(dirty);

  useEffect(() => {
    if (contentState.success) setDirty(false);
  }, [contentState.success]);

  const coreValuesArray = data.about.core_values ?? [];

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-line bg-surface p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("mission")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all shrink-0",
            activeTab === "mission"
              ? "bg-primary text-white shadow-sm"
              : "text-caption hover:bg-bg hover:text-ink"
          )}
        >
          <Compass className="h-4 w-4" />
          <span>Vision, Mission & History</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("principal")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all shrink-0",
            activeTab === "principal"
              ? "bg-primary text-white shadow-sm"
              : "text-caption hover:bg-bg hover:text-ink"
          )}
        >
          <User className="h-4 w-4" />
          <span>Principal&apos;s Desk</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("accreditations")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all shrink-0",
            activeTab === "accreditations"
              ? "bg-primary text-white shadow-sm"
              : "text-caption hover:bg-bg hover:text-ink"
          )}
        >
          <Award className="h-4 w-4" />
          <span>Accreditations ({data.accreditations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("org")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all shrink-0",
            activeTab === "org"
              ? "bg-primary text-white shadow-sm"
              : "text-caption hover:bg-bg hover:text-ink"
          )}
        >
          <Building2 className="h-4 w-4" />
          <span>Governance & Units ({data.orgUnits.length})</span>
        </button>
      </div>

      {/* Tab 1: Vision, Mission & History */}
      {activeTab === "mission" && (
        <form
          action={contentAction}
          className="space-y-6"
          {...createUnsavedFormProps(setDirty)}
        >
          <Message state={contentState} />

          {/* Hidden fields needed for form submission */}
          <input
            type="hidden"
            name="principal_name"
            defaultValue={data.about.principal_name ?? ""}
          />
          <input
            type="hidden"
            name="principal_title"
            defaultValue={data.about.principal_title ?? ""}
          />
          <input
            type="hidden"
            name="principal_photo_url"
            value={principalPhoto}
          />
          <textarea
            name="principal_message"
            className="hidden"
            defaultValue={data.about.principal_message ?? ""}
          />

          {/* Vision & Mission Side-by-Side Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Eye className="h-4 w-4" />
                <span>Institutional Vision</span>
              </div>
              <p className="text-xs text-caption">
                The long-term aspirational goal of Nandom NMTC
              </p>
              <Textarea
                id="vision"
                name="vision"
                rows={3}
                defaultValue={data.about.vision}
                className="text-xs sm:text-sm bg-bg/40 focus:bg-surface"
                placeholder="To be a centre of excellence in nursing and midwifery education in Ghana..."
              />
            </div>

            <div className="rounded-xl border border-line bg-surface p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Compass className="h-4 w-4" />
                <span>Institutional Mission</span>
              </div>
              <p className="text-xs text-caption">
                The core mandate and operational commitment of the college
              </p>
              <Textarea
                id="mission"
                name="mission"
                rows={3}
                defaultValue={data.about.mission}
                className="text-xs sm:text-sm bg-bg/40 focus:bg-surface"
                placeholder="To train competent, compassionate nurses and midwives who serve with integrity..."
              />
            </div>
          </div>

          {/* Core Values Card with Live Tag Preview */}
          <div className="rounded-xl border border-line bg-surface p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-semibold text-ink">
                  Core Values
                </h3>
                <p className="text-xs text-caption">
                  Values displayed on the public About page (one value per line)
                </p>
              </div>
              {coreValuesArray.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {coreValuesArray.map((val) => (
                    <span
                      key={val}
                      className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      {val}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Textarea
              id="core_values"
              name="core_values"
              rows={4}
              defaultValue={coreValuesText}
              className="text-xs sm:text-sm bg-bg/40 focus:bg-surface font-mono"
            />
          </div>

          {/* Institutional History Card */}
          <div className="rounded-xl border border-line bg-surface p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-serif text-base font-semibold text-ink">
                College History & Background
              </h3>
              <p className="text-xs text-caption">
                Foundational story, milestones, and accreditation lineage
              </p>
            </div>
            <TiptapEditor name="history" defaultValue={data.about.history ?? ""} />
          </div>

          <StickyFormFooter>
            <UnsavedChangesLabel show={dirty} />
            <SubmitButton label="Save Changes" />
          </StickyFormFooter>
        </form>
      )}

      {/* Tab 2: Principal's Desk */}
      {activeTab === "principal" && (
        <form
          action={contentAction}
          className="space-y-6"
          {...createUnsavedFormProps(setDirty)}
        >
          <Message state={contentState} />

          {/* Hidden fields preserved from other sections */}
          <textarea name="history" className="hidden" defaultValue={data.about.history ?? ""} />
          <textarea name="vision" className="hidden" defaultValue={data.about.vision ?? ""} />
          <textarea name="mission" className="hidden" defaultValue={data.about.mission ?? ""} />
          <textarea name="core_values" className="hidden" defaultValue={coreValuesText} />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Principal Info & Photo Card */}
            <div className="rounded-xl border border-line bg-surface p-5 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-semibold text-ink">
                Executive Profile
              </h3>
              <p className="text-xs text-caption">
                Principal&apos;s name and designation
              </p>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="principal_name" className="text-xs">Principal Name</Label>
                  <Input
                    id="principal_name"
                    name="principal_name"
                    defaultValue={data.about.principal_name ?? ""}
                    placeholder="e.g. Mrs. Mary Konlan"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="principal_title" className="text-xs">Official Title</Label>
                  <Input
                    id="principal_title"
                    name="principal_title"
                    defaultValue={data.about.principal_title ?? "Principal"}
                    placeholder="e.g. Principal / Head of Institution"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-line/60">
                <ImageUploadField
                  name="principal_photo_url"
                  label="Official Portrait"
                  value={principalPhoto}
                  folder="about"
                  onChange={(value) => {
                    setPrincipalPhoto(value);
                    setDirty(true);
                  }}
                />
              </div>
            </div>

            {/* Right: Welcome Address / Message */}
            <div className="lg:col-span-2 rounded-xl border border-line bg-surface p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-serif text-base font-semibold text-ink">
                  Welcome Address to Students & Public
                </h3>
                <p className="text-xs text-caption">
                  Official message shown prominently on the About and Home pages
                </p>
              </div>
              <TiptapEditor
                name="principal_message"
                defaultValue={data.about.principal_message ?? ""}
              />
            </div>
          </div>

          <StickyFormFooter>
            <UnsavedChangesLabel show={dirty} />
            <SubmitButton label="Save Principal's Desk" />
          </StickyFormFooter>
        </form>
      )}

      {/* Tab 3: Accreditations */}
      {activeTab === "accreditations" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-semibold text-ink">
                Accreditations & Regulatory Affiliations
              </h3>
              <p className="text-xs text-caption">
                Ministry of Health, Nursing & Midwifery Council (N&MC), GTEC, and University affiliations
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data.accreditations.map((acc) => (
              <AccreditationRow key={acc.id} acc={acc} />
            ))}
          </div>

          <div className="rounded-xl border border-dashed border-line bg-surface/50 p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-caption mb-3">
              Add New Accreditation Body
            </h4>
            <AccreditationRow />
          </div>
        </div>
      )}

      {/* Tab 4: Governance & Org Units */}
      {activeTab === "org" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-semibold text-ink">
                Administrative Governance & Departments
              </h3>
              <p className="text-xs text-caption">
                Organogram departments, units, and heads of division
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data.orgUnits.map((unit) => (
              <OrgUnitRow
                key={unit.id}
                unit={unit}
                allUnits={data.orgUnits}
              />
            ))}
          </div>

          <div className="rounded-xl border border-dashed border-line bg-surface/50 p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-caption mb-3">
              Add New Governance Unit
            </h4>
            <OrgUnitRow allUnits={data.orgUnits} />
          </div>
        </div>
      )}
    </div>
  );
}

function AccreditationRow({
  acc,
}: {
  acc?: AboutAdminData["accreditations"][0];
}) {
  const [state, action] = useActionState(saveAccreditation, {});
  const [logoUrl, setLogoUrl] = useState(acc?.logo_url ?? "");

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm space-y-3">
      <form action={action} className="space-y-3">
        {acc ? <input type="hidden" name="id" value={acc.id} /> : null}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs">Regulatory Body</Label>
            <Input
              name="body_name"
              defaultValue={acc?.body_name ?? ""}
              placeholder="e.g. Nursing & Midwifery Council"
              className="text-xs"
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Sort Order</Label>
            <Input
              name="sort_order"
              type="number"
              defaultValue={acc?.sort_order ?? 0}
              className="text-xs"
            />
          </div>
          <div className="space-y-1 sm:col-span-3">
            <Label className="text-xs">Accreditation / Reg. Number</Label>
            <Input
              name="accreditation_no"
              defaultValue={acc?.accreditation_no ?? ""}
              placeholder="e.g. NMC/TR/2026/04"
              className="text-xs"
            />
          </div>
        </div>
        <ImageUploadField
          name="logo_url"
          label="Emblem / Logo"
          value={logoUrl}
          folder="accreditations"
          onChange={setLogoUrl}
        />
        <div className="flex items-center justify-between pt-2 border-t border-line/50">
          <SubmitButton label={acc ? "Update" : "Add Accreditation"} size="sm" />
          <Message state={state} />
        </div>
      </form>
      {acc ? (
        <div className="pt-2 text-right">
          <DeleteConfirmButton
            action={deleteAccreditationForm}
            confirmMessage="Delete this accreditation?"
            buttonLabel="Remove"
            hiddenFields={{ id: acc.id }}
            variant="ghost"
          />
        </div>
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
  const [state, action] = useActionState(saveOrgUnit, {});
  const parents = allUnits.filter((u) => !unit || u.id !== unit.id);

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm space-y-3">
      <form action={action} className="space-y-3">
        {unit ? <input type="hidden" name="id" value={unit.id} /> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-xs">Unit / Division Name</Label>
            <Input
              name="name"
              defaultValue={unit?.name ?? ""}
              placeholder="e.g. Academic Affairs"
              className="text-xs"
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Head of Unit</Label>
            <Input
              name="head_name"
              defaultValue={unit?.head_name ?? ""}
              placeholder="e.g. Head of Nursing"
              className="text-xs"
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Reports To</Label>
            <select
              name="parent_id"
              defaultValue={unit?.parent_id ?? ""}
              className="flex h-9 w-full rounded-md border border-line bg-surface px-2.5 text-xs text-ink"
            >
              <option value="">Top level (Reports to Principal)</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Sort Order</Label>
            <Input
              name="sort_order"
              type="number"
              defaultValue={unit?.sort_order ?? 0}
              className="text-xs"
            />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-line/50">
          <SubmitButton label={unit ? "Update Unit" : "Add Unit"} size="sm" />
          <Message state={state} />
        </div>
      </form>
      {unit ? (
        <div className="pt-2 text-right">
          <DeleteConfirmButton
            action={deleteOrgUnitForm}
            confirmMessage="Delete this unit?"
            buttonLabel="Remove"
            hiddenFields={{ id: unit.id }}
            variant="ghost"
          />
        </div>
      ) : null}
    </div>
  );
}
