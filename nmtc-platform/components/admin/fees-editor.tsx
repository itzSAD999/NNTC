"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  deleteFeeForm,
  deletePaymentMethodForm,
  deleteScholarshipForm,
  saveFee,
  savePaymentMethod,
  saveScholarship,
  updateFinancialAidContent,
  type FeesActionState,
} from "@/lib/actions/fees";
import type {
  FeeWithProgram,
  FinancialAidContent,
  PaymentMethod,
  Scholarship,
} from "@/lib/types/expansion";
import { Button } from "@/components/ui/button";
import { AdminSectionCard, FormMessage } from "@/components/admin/admin-layout";
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

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? "Saving…" : label}
    </Button>
  );
}

function Message({ state }: { state: FeesActionState }) {
  return <FormMessage error={state.error} success={state.success} />;
}

export function FeesEditor({
  fees,
  paymentMethods,
  scholarships,
  content,
  programs,
}: {
  fees: FeeWithProgram[];
  paymentMethods: PaymentMethod[];
  scholarships: Scholarship[];
  content: FinancialAidContent | null;
  programs: { id: string; name: string }[];
}) {
  const [contentState, contentAction] = useFormState(updateFinancialAidContent, {});
  const [dirty, setDirty] = useState(false);

  useUnsavedChanges(dirty);

  useEffect(() => {
    if (contentState.success) setDirty(false);
  }, [contentState.success]);

  return (
    <div className="space-y-10">
      <section className="rounded border border-line bg-surface p-6">
        <h2 className="font-serif text-display-sm">Policies & schedules</h2>
        <form
          action={contentAction}
          className="mt-6 space-y-4"
          {...createUnsavedFormProps(setDirty)}
        >
          <Message state={contentState} />
          <div className="space-y-2">
            <Label htmlFor="payment_schedule">Payment schedule</Label>
            <Textarea
              id="payment_schedule"
              name="payment_schedule"
              rows={3}
              defaultValue={content?.payment_schedule ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sltf_info">SLTF information</Label>
            <Textarea
              id="sltf_info"
              name="sltf_info"
              rows={4}
              defaultValue={content?.sltf_info ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hardship_policy">Hardship policy</Label>
            <Textarea
              id="hardship_policy"
              name="hardship_policy"
              rows={4}
              defaultValue={content?.hardship_policy ?? ""}
            />
          </div>
          <StickyFormFooter>
            <UnsavedChangesLabel show={dirty} />
            <SubmitButton label="Save policies" />
          </StickyFormFooter>
        </form>
      </section>

      <section className="rounded border border-line bg-surface p-6">
        <h2 className="font-serif text-display-sm">Fee table</h2>
        <div className="mt-4 space-y-3">
          {fees.map((fee) => (
            <FeeRow key={fee.id} fee={fee} programs={programs} />
          ))}
          <FeeRow programs={programs} />
        </div>
      </section>

      <section className="rounded border border-line bg-surface p-6">
        <h2 className="font-serif text-display-sm">Payment methods</h2>
        <div className="mt-4 space-y-3">
          {paymentMethods.map((m) => (
            <PaymentMethodRow key={m.id} method={m} />
          ))}
          <PaymentMethodRow />
        </div>
      </section>

      <section className="rounded border border-line bg-surface p-6">
        <h2 className="font-serif text-display-sm">Scholarships</h2>
        <div className="mt-4 space-y-3">
          {scholarships.map((s) => (
            <ScholarshipRow key={s.id} scholarship={s} />
          ))}
          <ScholarshipRow />
        </div>
      </section>
    </div>
  );
}

function FeeRow({
  fee,
  programs,
}: {
  fee?: FeeWithProgram;
  programs: { id: string; name: string }[];
}) {
  const [state, action] = useFormState(saveFee, {});

  return (
    <div className="rounded border border-line p-3">
      <form
        action={action}
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6"
      >
        {fee ? <input type="hidden" name="id" value={fee.id} /> : null}
        <select
          name="program_id"
          defaultValue={fee?.program_id ?? ""}
          className="flex h-10 rounded border border-line bg-bg px-2 text-sm lg:col-span-2"
        >
          <option value="">All programmes</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Input name="year_label" defaultValue={fee?.year_label} placeholder="Year" required />
        <Input name="fee_type" defaultValue={fee?.fee_type} placeholder="Fee type" required />
        <Input
          name="amount"
          type="number"
          min={0}
          step="0.01"
          defaultValue={fee?.amount}
          required
        />
        <Input name="due_note" defaultValue={fee?.due_note} placeholder="Due note" />
        <Input
          name="sort_order"
          type="number"
          defaultValue={fee?.sort_order ?? 0}
          className="w-full"
        />
        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-6">
          <SubmitButton label={fee ? "Update fee" : "Add fee"} />
          <Message state={state} />
        </div>
      </form>
      {fee ? (
        <DeleteConfirmButton
          action={deleteFeeForm}
          confirmMessage="Delete this fee row?"
          buttonLabel="Delete"
          hiddenFields={{ id: fee.id }}
          variant="ghost"
        />
      ) : null}
    </div>
  );
}

function PaymentMethodRow({ method }: { method?: PaymentMethod }) {
  const [state, action] = useFormState(savePaymentMethod, {});

  return (
    <div className="rounded border border-line p-3">
      <form action={action} className="grid gap-2 sm:grid-cols-3">
        {method ? <input type="hidden" name="id" value={method.id} /> : null}
        <Input name="method" defaultValue={method?.method} placeholder="Method" required />
        <Input
          name="details"
          defaultValue={method?.details}
          placeholder="Details"
          className="sm:col-span-2"
        />
        <Input name="sort_order" type="number" defaultValue={method?.sort_order ?? 0} />
        <div className="flex gap-2 sm:col-span-3">
          <SubmitButton label={method ? "Update" : "Add"} />
          <Message state={state} />
        </div>
      </form>
      {method ? (
        <DeleteConfirmButton
          action={deletePaymentMethodForm}
          confirmMessage="Delete this payment method?"
          buttonLabel="Delete"
          hiddenFields={{ id: method.id }}
          variant="ghost"
        />
      ) : null}
    </div>
  );
}

function ScholarshipRow({ scholarship }: { scholarship?: Scholarship }) {
  const [state, action] = useFormState(saveScholarship, {});

  return (
    <div className="rounded border border-line p-3">
      <form action={action} className="space-y-2">
        {scholarship ? <input type="hidden" name="id" value={scholarship.id} /> : null}
        <Input name="name" defaultValue={scholarship?.name} placeholder="Name" required />
        <Textarea
          name="eligibility"
          defaultValue={scholarship?.eligibility}
          rows={2}
          placeholder="Eligibility"
        />
        <Textarea
          name="how_to_apply"
          defaultValue={scholarship?.how_to_apply}
          rows={2}
          placeholder="How to apply"
        />
        <Input
          name="external_url"
          type="url"
          defaultValue={scholarship?.external_url ?? ""}
          placeholder="External URL (optional)"
        />
        <div className="flex flex-wrap gap-2">
          <Input
            name="sort_order"
            type="number"
            defaultValue={scholarship?.sort_order ?? 0}
            className="w-20"
          />
          <SubmitButton label={scholarship ? "Update" : "Add"} />
          <Message state={state} />
        </div>
      </form>
      {scholarship ? (
        <DeleteConfirmButton
          action={deleteScholarshipForm}
          confirmMessage="Delete this scholarship entry?"
          buttonLabel="Delete"
          hiddenFields={{ id: scholarship.id }}
          variant="ghost"
        />
      ) : null}
    </div>
  );
}
