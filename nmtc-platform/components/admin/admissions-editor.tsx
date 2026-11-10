"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Search,
  BookOpen,
  FileCheck,
  HelpCircle,
  Plus,
  Trash2,
  Calendar,
  CreditCard,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

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
import { FormMessage } from "@/components/admin/admin-layout";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-form";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";
import {
  UnsavedChangesLabel,
  createUnsavedFormProps,
} from "@/components/admin/unsaved-changes";
import { useUnsavedChanges } from "@/lib/hooks/use-unsaved-changes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? "Saving…" : label}
    </Button>
  );
}

function Message({ state }: { state: AdmissionsActionState }) {
  return <FormMessage error={state.error} success={state.success} />;
}

type AdmissionsTab = "guidelines" | "checklist" | "faqs";

export function AdmissionsEditor({
  content,
  documents,
  faqs,
}: {
  content: AdmissionsContent;
  documents: DocumentRequired[];
  faqs: AdmissionsFaq[];
}) {
  const [activeTab, setActiveTab] = useState<AdmissionsTab>("guidelines");
  const [steps, setSteps] = useState<AdmissionsProcessStep[]>(
    content.process_steps ?? []
  );
  const [contentState, contentAction] = useActionState(updateAdmissionsContent, {});
  const [dirty, setDirty] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");

  const filteredFaqs = useMemo(() => {
    const q = faqSearch.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    );
  }, [faqs, faqSearch]);

  useUnsavedChanges(dirty);

  useEffect(() => {
    if (contentState.success) setDirty(false);
  }, [contentState.success]);

  return (
    <div className="space-y-6">
      {/* SEGMENTED TABBED NAVIGATION: ZERO ENDLESS SCROLLING */}
      <nav aria-label="Admissions sections" className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("guidelines")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all shadow-sm",
            activeTab === "guidelines"
              ? "bg-primary text-white shadow-sm font-semibold"
              : "bg-surface border border-line text-caption hover:text-ink hover:border-line/80"
          )}
        >
          <BookOpen className="h-4 w-4" />
          <span>Application Guidelines</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("checklist")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all shadow-sm",
            activeTab === "checklist"
              ? "bg-primary text-white shadow-sm font-semibold"
              : "bg-surface border border-line text-caption hover:text-ink hover:border-line/80"
          )}
        >
          <FileCheck className="h-4 w-4" />
          <span>Required Documents</span>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px]",
              activeTab === "checklist" ? "bg-white/20 text-white" : "bg-bg text-caption"
            )}
          >
            {documents.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("faqs")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all shadow-sm",
            activeTab === "faqs"
              ? "bg-primary text-white shadow-sm font-semibold"
              : "bg-surface border border-line text-caption hover:text-ink hover:border-line/80"
          )}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Admissions FAQs</span>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px]",
              activeTab === "faqs" ? "bg-white/20 text-white" : "bg-bg text-caption"
            )}
          >
            {faqs.length}
          </span>
        </button>
      </nav>

      {/* TAB 1: APPLICATION GUIDELINES, STEPS & POLICIES */}
      {activeTab === "guidelines" && (
        <section className="rounded-xl border border-line bg-surface p-6 shadow-sm sm:p-8 animate-in fade-in duration-200">
          <div className="border-b border-line pb-4 mb-6">
            <h2 className="font-serif text-xl font-medium text-ink">
              Application Guidelines & Calendar
            </h2>
            <p className="text-xs text-caption sm:text-sm">
              Prospective student onboarding steps, academic deadlines, and admission requirements shown on the public portal.
            </p>
          </div>

          <form
            action={contentAction}
            className="space-y-6"
            {...createUnsavedFormProps(setDirty)}
          >
            <Message state={contentState} />

            {/* Application Steps */}
            <div className="rounded-xl border border-line bg-bg/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-semibold text-ink">
                    Application Process Steps
                  </h3>
                  <p className="text-xs text-caption">
                    Sequential steps guiding applicants through form purchase, submission, and interviews.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSteps([
                      ...steps,
                      {
                        title: `Step ${steps.length + 1}`,
                        body: "Complete online application voucher purchase.",
                      },
                    ]);
                    setDirty(true);
                  }}
                  className="gap-1.5 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Add step
                </Button>
              </div>

              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-line bg-surface p-3.5 shadow-sm">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                      <Input
                        value={step.title}
                        onChange={(e) => {
                          const next = [...steps];
                          next[i] = { ...next[i], title: e.target.value };
                          setSteps(next);
                          setDirty(true);
                        }}
                        placeholder="Step title"
                        className="font-medium text-sm"
                        required
                      />
                      <Textarea
                        value={step.body}
                        onChange={(e) => {
                          const next = [...steps];
                          next[i] = { ...next[i], body: e.target.value };
                          setSteps(next);
                          setDirty(true);
                        }}
                        placeholder="Step instructions…"
                        rows={2}
                        className="text-xs"
                      />
                    </div>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = steps.filter((_, idx) => idx !== i);
                          setSteps(next);
                          setDirty(true);
                        }}
                        className="text-caption hover:text-danger p-1"
                        title="Remove step"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <input type="hidden" name="process_steps" value={JSON.stringify(steps)} />
            </div>

            {/* Application Portal Link & Payment Instructions */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="application_form_url" className="text-xs font-semibold uppercase tracking-wider text-caption">
                  National MoH Portal / Voucher URL
                </Label>
                <div className="relative">
                  <Input
                    id="application_form_url"
                    name="application_form_url"
                    type="url"
                    defaultValue={content.application_form_url ?? ""}
                    placeholder="https://healthtraining.gov.gh"
                    className="pr-8"
                  />
                  <ExternalLink className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-caption" />
                </div>
                <p className="text-[11px] text-caption">Direct voucher link for Ministry of Health admissions portal.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="academic_calendar" className="text-xs font-semibold uppercase tracking-wider text-caption">
                  Key Admissions Dates & Calendar
                </Label>
                <Textarea
                  id="academic_calendar"
                  name="academic_calendar"
                  rows={3}
                  defaultValue={content.academic_calendar}
                  placeholder="e.g. Applications Open: May 15 · Entrance Interviews: August 2–10 · Academic Year Commencement: October"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="selection_criteria" className="text-xs font-semibold uppercase tracking-wider text-caption">
                  Minimum Entry Criteria & Cut-off
                </Label>
                <Textarea
                  id="selection_criteria"
                  name="selection_criteria"
                  rows={4}
                  defaultValue={content.selection_criteria}
                  placeholder="WASSCE: Aggregates 24 or better with Credits (A1–C6) in Core English, Core Mathematics, and Integrated Science..."
                  className="text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_instructions" className="text-xs font-semibold uppercase tracking-wider text-caption">
                  Voucher Purchase & Payment Guide
                </Label>
                <Textarea
                  id="payment_instructions"
                  name="payment_instructions"
                  rows={4}
                  defaultValue={content.payment_instructions}
                  placeholder="Vouchers can be purchased via MTN MoMo code *887*18# or at any GCB Bank branch nationwide."
                  className="text-xs"
                />
              </div>
            </div>

            <StickyFormFooter>
              <UnsavedChangesLabel show={dirty} />
              <SubmitButton label="Save Admissions Guidelines" />
            </StickyFormFooter>
          </form>
        </section>
      )}

      {/* TAB 2: REQUIRED DOCUMENTS CHECKLIST */}
      {activeTab === "checklist" && (
        <section className="rounded-xl border border-line bg-surface p-6 shadow-sm sm:p-8 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div>
              <h2 className="font-serif text-xl font-medium text-ink">
                Required Applicant Documents
              </h2>
              <p className="text-xs text-caption sm:text-sm">
                Checklist of certified documents prospective students must bring to the entrance screening interview.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-caption">
              {documents.length} Items Listed
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div className="divide-y divide-line rounded-lg border border-line bg-surface">
              {documents.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} />
              ))}
              {documents.length === 0 && (
                <div className="p-6 text-center text-xs text-caption">
                  No required documents specified yet. Add your first item below.
                </div>
              )}
            </div>

            <div className="rounded-xl border border-dashed border-line/80 bg-bg/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-caption mb-3">
                Add New Document Requirement
              </p>
              <DocumentRow />
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: ADMISSIONS FAQS */}
      {activeTab === "faqs" && (
        <section className="rounded-xl border border-line bg-surface p-6 shadow-sm sm:p-8 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div>
              <h2 className="font-serif text-xl font-medium text-ink">
                Admissions Frequently Asked Questions
              </h2>
              <p className="text-xs text-caption sm:text-sm">
                Answers to common candidate questions about vouchers, interviews, hostels, and cut-off points.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-caption">
              {faqs.length} FAQs
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {/* Quick FAQ search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-caption" />
              <Input
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search FAQs by question or answer keyword..."
                className="pl-9 text-xs sm:text-sm bg-bg/50 h-9"
              />
              {faqSearch && (
                <button
                  type="button"
                  onClick={() => setFaqSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-caption hover:text-ink text-xs px-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filtered FAQ Items */}
            <div className="space-y-3">
              {filteredFaqs.map((faq) => (
                <FaqRow key={faq.id} faq={faq} />
              ))}
              {filteredFaqs.length === 0 && (
                <div className="rounded-lg border border-dashed border-line p-6 text-center text-xs text-caption">
                  No FAQs match &ldquo;{faqSearch}&rdquo;.
                </div>
              )}
            </div>

            {/* Add New FAQ Box */}
            <div className="rounded-xl border border-dashed border-line/80 bg-bg/50 p-5 mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-caption mb-3">
                Create New FAQ Entry
              </p>
              <FaqRow />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function DocumentRow({ doc }: { doc?: DocumentRequired }) {
  const [state, action] = useActionState(saveDocumentRequired, {});

  return (
    <div className="p-3.5 hover:bg-bg/30 transition-colors">
      <form action={action} className="flex flex-wrap items-center gap-3">
        {doc ? <input type="hidden" name="id" value={doc.id} /> : null}
        <Input
          name="label"
          defaultValue={doc?.label}
          placeholder="e.g. Original WASSCE Certificate / Result Slip"
          className="min-w-[220px] flex-1 text-sm font-medium"
          required
        />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-caption shrink-0">Sort:</span>
          <Input
            name="sort_order"
            type="number"
            defaultValue={doc?.sort_order ?? 0}
            className="w-16 text-xs"
          />
        </div>
        <SubmitButton label={doc ? "Update" : "Add requirement"} />
        <Message state={state} />
        {doc ? (
          <DeleteConfirmButton
            action={deleteDocumentForm}
            confirmMessage="Remove this required document from the admissions page?"
            buttonLabel="Delete"
            hiddenFields={{ id: doc.id }}
            variant="ghost"
          />
        ) : null}
      </form>
    </div>
  );
}

function FaqRow({ faq }: { faq?: AdmissionsFaq }) {
  const [state, action] = useActionState(saveAdmissionsFaq, {});

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <form action={action} className="space-y-3">
        {faq ? <input type="hidden" name="id" value={faq.id} /> : null}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-caption">
            Question
          </Label>
          <Input
            name="question"
            defaultValue={faq?.question}
            placeholder="e.g. Can I apply with awaiting WASSCE results?"
            required
            className="font-medium text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-caption">
            Answer
          </Label>
          <Textarea
            name="answer"
            defaultValue={faq?.answer}
            rows={2}
            placeholder="Provide a clear, authoritative answer..."
            required
            className="text-xs sm:text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-line/50">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-caption">Display order:</span>
            <Input
              name="sort_order"
              type="number"
              defaultValue={faq?.sort_order ?? 0}
              className="w-16 text-xs h-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <SubmitButton label={faq ? "Update FAQ" : "Save FAQ"} />
            {faq ? (
              <DeleteConfirmButton
                action={deleteFaqForm}
                confirmMessage="Delete this FAQ?"
                buttonLabel="Delete"
                hiddenFields={{ id: faq.id }}
                variant="ghost"
              />
            ) : null}
          </div>
        </div>
        <Message state={state} />
      </form>
    </div>
  );
}
