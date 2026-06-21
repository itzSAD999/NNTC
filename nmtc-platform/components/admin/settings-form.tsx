"use client";

import { useFormState, useFormStatus } from "react-dom";

import {
  updateDocumentTypeFee,
  updateSettings,
  type SettingsActionState,
} from "@/lib/actions/settings";
import type { DocumentType, Settings } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

function Message({ state }: { state: SettingsActionState }) {
  if (state.error) {
    return <p className="text-sm text-danger">{state.error}</p>;
  }
  if (state.success) {
    return <p className="text-sm text-primary">Saved successfully.</p>;
  }
  return null;
}

export function AdminSettingsForm({
  settings,
  documentTypes,
}: {
  settings: Settings;
  documentTypes: DocumentType[];
}) {
  const [settingsState, settingsAction] = useFormState(updateSettings, {});

  return (
    <div className="space-y-10">
      <section className="rounded border border-line bg-surface p-6">
        <h2 className="font-serif text-display-sm">Branding</h2>
        <form action={settingsAction} className="mt-6 grid gap-4 sm:grid-cols-2">
          <Message state={settingsState} />
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="college_name">College name</Label>
            <Input
              id="college_name"
              name="college_name"
              defaultValue={settings.college_name}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="motto">Motto</Label>
            <Input id="motto" name="motto" defaultValue={settings.motto} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              name="logo_url"
              type="url"
              defaultValue={settings.logo_url ?? ""}
              placeholder="https://…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primary_color">Primary colour</Label>
            <div className="flex gap-2">
              <Input
                id="primary_color"
                name="primary_color"
                defaultValue={settings.primary_color ?? "#1A5E3A"}
                pattern="^#[0-9A-Fa-f]{6}$"
                required
              />
              <input
                type="color"
                defaultValue={settings.primary_color ?? "#1A5E3A"}
                className="h-9 w-12 cursor-pointer rounded border border-line"
                onChange={(e) => {
                  const input = document.getElementById(
                    "primary_color"
                  ) as HTMLInputElement;
                  if (input) input.value = e.target.value;
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accent_color">Accent colour</Label>
            <div className="flex gap-2">
              <Input
                id="accent_color"
                name="accent_color"
                defaultValue={settings.accent_color ?? "#9A1B2F"}
                pattern="^#[0-9A-Fa-f]{6}$"
                required
              />
              <input
                type="color"
                defaultValue={settings.accent_color ?? "#9A1B2F"}
                className="h-9 w-12 cursor-pointer rounded border border-line"
                onChange={(e) => {
                  const input = document.getElementById(
                    "accent_color"
                  ) as HTMLInputElement;
                  if (input) input.value = e.target.value;
                }}
              />
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notification_email_template">
              Student notification email template
            </Label>
            <Textarea
              id="notification_email_template"
              name="notification_email_template"
              rows={8}
              defaultValue={settings.notification_email_template ?? ""}
              placeholder="Use {{student_name}}, {{reference_no}}, {{document_type}}, {{delivery_method}}, {{college_name}} as placeholders."
            />
          </div>
          <div className="sm:col-span-2">
            <SubmitButton label="Save branding" />
          </div>
        </form>
      </section>

      <section className="rounded border border-line bg-surface p-6">
        <h2 className="font-serif text-display-sm">Document fees</h2>
        <p className="mt-2 text-sm text-caption">
          Transcript and attestation fees shown on the public request form.
        </p>
        <div className="mt-6 space-y-4">
          {documentTypes.map((doc) => (
            <DocumentFeeRow key={doc.id} doc={doc} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DocumentFeeRow({ doc }: { doc: DocumentType }) {
  const [state, action] = useFormState(updateDocumentTypeFee, {});

  return (
    <form
      action={action}
      className="flex flex-wrap items-end gap-4 rounded border border-line p-4"
    >
      <input type="hidden" name="id" value={doc.id} />
      <div className="min-w-[180px] flex-1">
        <p className="font-medium text-ink">{doc.name}</p>
        <p className="text-xs text-caption">Code: {doc.code}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`fee-${doc.id}`}>Fee (GHS)</Label>
        <Input
          id={`fee-${doc.id}`}
          name="fee_amount"
          type="number"
          min={0}
          step="0.01"
          defaultValue={doc.fee_amount}
          className="w-32"
          required
        />
      </div>
      <SubmitButton label="Update" />
      <Message state={state} />
    </form>
  );
}
