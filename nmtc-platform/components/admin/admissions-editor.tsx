"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  deleteDocumentForm,
  deleteFaqForm,
  saveAdmissionsFaq,
  saveDocumentRequired,
  updateAdmissionsContent,
  type AdmissionsActionState,
} from "@/lib/actions/admissions";
import type {
  AdmissionsContent,
  AdmissionsFaq,
  AdmissionsProcessStep,
  DocumentRequired,
} from "@/lib/types/expansion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? "Saving…" : label}
    </Button>
  );
}

function Message({ state }: { state: AdmissionsActionState }) {
  if (state.error) return <p className="text-sm text-danger">{state.error}</p>;
  if (state.success) return <p className="text-sm text-primary">Saved.</p>;
  return null;
}

export function AdmissionsEditor({
  content,
  documents,
  faqs,
}: {
  content: AdmissionsContent;
  documents: DocumentRequired[];
  faqs: AdmissionsFaq[];
}) {
  const [steps, setSteps] = useState<AdmissionsProcessStep[]>(
    content.process_steps ?? []
  );
  const [contentState, contentAction] = useFormState(updateAdmissionsContent, {});

  return (
    <div className="space-y-10">
      <section className="rounded border border-line bg-surface p-6">
        <h2 className="font-serif text-display-sm">Main content</h2>
        <form action={contentAction} className="mt-6 space-y-4">
          <Message state={contentState} />

          <div className="space-y-3">
            <Label>Process steps</Label>
            {steps.map((step, i) => (
              <div key={i} className="grid gap-2 rounded border border-line p-3">
                <Input
                  value={step.title}
                  onChange={(e) => {
                    const next = [...steps];
                    next[i] = { ...next[i], title: e.target.value };
                    setSteps(next);
                  }}
                  placeholder="Step title"
                />
                <Textarea
                  value={step.body}
                  onChange={(e) => {
                    const next = [...steps];
                    next[i] = { ...next[i], body: e.target.value };
                    setSteps(next);
                  }}
                  rows={2}
                  placeholder="Step description"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSteps((s) => [...s, { title: "", body: "" }])}
            >
              Add step
            </Button>
            <input
              type="hidden"
              name="process_steps_json"
              value={JSON.stringify(steps)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="application_fee">Application fee (GHS)</Label>
              <Input
                id="application_fee"
                name="application_fee"
                type="number"
                min={0}
                step="0.01"
                defaultValue={content.application_fee ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="application_form_url">Application form URL</Label>
              <Input
                id="application_form_url"
                name="application_form_url"
                type="url"
                defaultValue={content.application_form_url ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_instructions">Payment instructions</Label>
            <Textarea
              id="payment_instructions"
              name="payment_instructions"
              rows={3}
              defaultValue={content.payment_instructions}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="academic_calendar">Academic calendar</Label>
            <Textarea
              id="academic_calendar"
              name="academic_calendar"
              rows={3}
              defaultValue={content.academic_calendar}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="selection_criteria">Selection criteria</Label>
            <Textarea
              id="selection_criteria"
              name="selection_criteria"
              rows={3}
              defaultValue={content.selection_criteria}
            />
          </div>

          <SubmitButton label="Save content" />
        </form>
      </section>

      <section className="rounded border border-line bg-surface p-6">
        <h2 className="font-serif text-display-sm">Required documents</h2>
        <div className="mt-4 space-y-3">
          {documents.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} />
          ))}
          <DocumentRow />
        </div>
      </section>

      <section className="rounded border border-line bg-surface p-6">
        <h2 className="font-serif text-display-sm">FAQs</h2>
        <div className="mt-4 space-y-3">
          {faqs.map((faq) => (
            <FaqRow key={faq.id} faq={faq} />
          ))}
          <FaqRow />
        </div>
      </section>
    </div>
  );
}

function DocumentRow({ doc }: { doc?: DocumentRequired }) {
  const [state, action] = useFormState(saveDocumentRequired, {});

  return (
    <div className="border-b border-line pb-3">
      <form action={action} className="flex flex-wrap items-end gap-2">
        {doc ? <input type="hidden" name="id" value={doc.id} /> : null}
        <Input
          name="label"
          defaultValue={doc?.label}
          placeholder="Document label"
          className="min-w-[200px] flex-1"
          required
        />
        <Input
          name="sort_order"
          type="number"
          defaultValue={doc?.sort_order ?? 0}
          className="w-20"
        />
        <SubmitButton label={doc ? "Update" : "Add"} />
        <Message state={state} />
      </form>
      {doc ? (
        <form action={deleteDocumentForm} className="mt-2">
          <input type="hidden" name="id" value={doc.id} />
          <Button type="submit" variant="ghost" size="sm">
            Delete
          </Button>
        </form>
      ) : null}
    </div>
  );
}

function FaqRow({ faq }: { faq?: AdmissionsFaq }) {
  const [state, action] = useFormState(saveAdmissionsFaq, {});

  return (
    <div className="rounded border border-line p-3">
      <form action={action} className="space-y-2">
        {faq ? <input type="hidden" name="id" value={faq.id} /> : null}
        <Input name="question" defaultValue={faq?.question} placeholder="Question" required />
        <Textarea name="answer" defaultValue={faq?.answer} rows={2} required />
        <div className="flex flex-wrap items-center gap-2">
          <Input
            name="sort_order"
            type="number"
            defaultValue={faq?.sort_order ?? 0}
            className="w-20"
          />
          <SubmitButton label={faq ? "Update FAQ" : "Add FAQ"} />
        </div>
        <Message state={state} />
      </form>
      {faq ? (
        <form action={deleteFaqForm} className="mt-2">
          <input type="hidden" name="id" value={faq.id} />
          <Button type="submit" variant="ghost" size="sm">
            Delete
          </Button>
        </form>
      ) : null}
    </div>
  );
}
