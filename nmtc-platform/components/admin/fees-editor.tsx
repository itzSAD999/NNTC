"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Search,
  Coins,
  CreditCard,
  GraduationCap,
  FileText,
  Filter,
  Plus,
  ExternalLink,
  Receipt,
  Trash2,
} from "lucide-react";

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
  FeeComponent,
  FeeWithProgram,
  FinancialAidContent,
  PaymentMethod,
  Scholarship,
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

function Message({ state }: { state: FeesActionState }) {
  return <FormMessage error={state.error} success={state.success} />;
}

type FeesTab = "tuition" | "methods" | "scholarships" | "policies";

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
  const [activeTab, setActiveTab] = useState<FeesTab>("tuition");
  const [contentState, contentAction] = useActionState(updateFinancialAidContent, {});
  const [dirty, setDirty] = useState(false);
  const [feeSearch, setFeeSearch] = useState("");
  const [feeProgramFilter, setFeeProgramFilter] = useState("all");

  const filteredFees = useMemo(() => {
    const q = feeSearch.trim().toLowerCase();
    return fees.filter((fee) => {
      if (feeProgramFilter !== "all" && fee.program_id !== feeProgramFilter) {
        return false;
      }
      if (q) {
        const matchType = fee.fee_type.toLowerCase().includes(q);
        const matchYear = fee.year_label.toLowerCase().includes(q);
        const matchNote = fee.due_note ? fee.due_note.toLowerCase().includes(q) : false;
        const matchAmount = String(fee.amount).includes(q);
        if (!matchType && !matchYear && !matchNote && !matchAmount) {
          return false;
        }
      }
      return true;
    });
  }, [fees, feeSearch, feeProgramFilter]);

  useUnsavedChanges(dirty);

  useEffect(() => {
    if (contentState.success) setDirty(false);
  }, [contentState.success]);

  return (
    <div className="space-y-6">
      {/* SEGMENTED TABBED NAVIGATION: ZERO ENDLESS SCROLLING */}
      <nav aria-label="Fee management sections" className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("tuition")}
          className={cn(
            "flex items-center gap-2 rounded-none px-3.5 py-2 text-xs sm:text-sm font-medium transition-all shadow-sm",
            activeTab === "tuition"
              ? "bg-primary text-white shadow-sm font-semibold"
              : "bg-surface border border-line text-caption hover:text-ink hover:border-line/80"
          )}
        >
          <Coins className="h-4 w-4" />
          <span>Programme Tuition & Fees</span>
          <span
            className={cn(
              "rounded-none px-1.5 py-0.5 text-[10px]",
              activeTab === "tuition" ? "bg-white/20 text-white" : "bg-bg text-caption"
            )}
          >
            {fees.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("methods")}
          className={cn(
            "flex items-center gap-2 rounded-none px-3.5 py-2 text-xs sm:text-sm font-medium transition-all shadow-sm",
            activeTab === "methods"
              ? "bg-primary text-white shadow-sm font-semibold"
              : "bg-surface border border-line text-caption hover:text-ink hover:border-line/80"
          )}
        >
          <CreditCard className="h-4 w-4" />
          <span>Payment Methods & Accounts</span>
          <span
            className={cn(
              "rounded-none px-1.5 py-0.5 text-[10px]",
              activeTab === "methods" ? "bg-white/20 text-white" : "bg-bg text-caption"
            )}
          >
            {paymentMethods.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("scholarships")}
          className={cn(
            "flex items-center gap-2 rounded-none px-3.5 py-2 text-xs sm:text-sm font-medium transition-all shadow-sm",
            activeTab === "scholarships"
              ? "bg-primary text-white shadow-sm font-semibold"
              : "bg-surface border border-line text-caption hover:text-ink hover:border-line/80"
          )}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Scholarships & Financial Aid</span>
          <span
            className={cn(
              "rounded-none px-1.5 py-0.5 text-[10px]",
              activeTab === "scholarships" ? "bg-white/20 text-white" : "bg-bg text-caption"
            )}
          >
            {scholarships.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("policies")}
          className={cn(
            "flex items-center gap-2 rounded-none px-3.5 py-2 text-xs sm:text-sm font-medium transition-all shadow-sm",
            activeTab === "policies"
              ? "bg-primary text-white shadow-sm font-semibold"
              : "bg-surface border border-line text-caption hover:text-ink hover:border-line/80"
          )}
        >
          <FileText className="h-4 w-4" />
          <span>Bursary Policies & Schedules</span>
        </button>
      </nav>

      {/* TAB 1: TUITION & PROGRAMME FEE SCHEDULES */}
      {activeTab === "tuition" && (
        <section className="rounded-none border border-line bg-surface p-6 shadow-sm sm:p-8 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div>
              <h2 className="font-serif text-xl font-medium text-ink">
                Programme Tuition & Statutory Fees
              </h2>
              <p className="text-xs text-caption sm:text-sm">
                Tuition rates, clinical training levies, SRC dues, and examination fees broken down by academic cohort.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-caption">
              {filteredFees.length} of {fees.length} schedules showing
            </span>
          </div>

          {/* Search & Programme Filter Toolbar */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-caption" />
              <Input
                value={feeSearch}
                onChange={(e) => setFeeSearch(e.target.value)}
                placeholder="Search fees by type, year, note, or amount..."
                className="pl-9 text-xs sm:text-sm bg-bg/50 h-9"
              />
              {feeSearch && (
                <button
                  type="button"
                  onClick={() => setFeeSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-caption hover:text-ink text-xs px-1"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:w-64">
              <Filter className="h-3.5 w-3.5 text-caption shrink-0" />
              <select
                value={feeProgramFilter}
                onChange={(e) => setFeeProgramFilter(e.target.value)}
                className="h-9 w-full rounded-md border border-line bg-bg px-2.5 text-xs text-ink"
              >
                <option value="all">All Programmes</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fees List */}
          <div className="mt-5 space-y-3">
            {filteredFees.map((fee) => (
              <FeeRow key={fee.id} fee={fee} programs={programs} />
            ))}
            {filteredFees.length === 0 && (
              <div className="rounded-none border border-dashed border-line p-8 text-center text-xs text-caption">
                No fee schedules match your search or filter criteria.
              </div>
            )}
          </div>

          {/* Add New Fee Schedule */}
          <div className="rounded-none border border-dashed border-line/80 bg-bg/50 p-5 mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-caption mb-3">
              Create New Fee Schedule
            </p>
            <FeeRow programs={programs} />
          </div>
        </section>
      )}

      {/* TAB 2: PAYMENT METHODS & ACCOUNTS */}
      {activeTab === "methods" && (
        <section className="rounded-none border border-line bg-surface p-6 shadow-sm sm:p-8 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div>
              <h2 className="font-serif text-xl font-medium text-ink">
                Accepted Payment Channels & Accounts
              </h2>
              <p className="text-xs text-caption sm:text-sm">
                Official institution bank accounts, MoMo merchant paybills, and cashier payment instructions.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-none border border-line bg-bg px-3 py-1 text-xs font-medium text-caption">
              {paymentMethods.length} Channels Active
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-3">
              {paymentMethods.map((m) => (
                <PaymentMethodRow key={m.id} method={m} />
              ))}
              {paymentMethods.length === 0 && (
                <div className="rounded-none border border-dashed border-line p-6 text-center text-xs text-caption">
                  No payment methods configured yet.
                </div>
              )}
            </div>

            <div className="rounded-none border border-dashed border-line/80 bg-bg/50 p-5 mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-caption mb-3">
                Register New Payment Channel
              </p>
              <PaymentMethodRow />
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: SCHOLARSHIPS & FINANCIAL AID */}
      {activeTab === "scholarships" && (
        <section className="rounded-none border border-line bg-surface p-6 shadow-sm sm:p-8 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div>
              <h2 className="font-serif text-xl font-medium text-ink">
                Scholarships & Financial Aid Grants
              </h2>
              <p className="text-xs text-caption sm:text-sm">
                Government bursary programs, NGO grants, and private nursing scholarships available to students.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-none border border-line bg-bg px-3 py-1 text-xs font-medium text-caption">
              {scholarships.length} Aid Programs
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-4">
              {scholarships.map((s) => (
                <ScholarshipRow key={s.id} scholarship={s} />
              ))}
              {scholarships.length === 0 && (
                <div className="rounded-none border border-dashed border-line p-6 text-center text-xs text-caption">
                  No scholarship programs added yet.
                </div>
              )}
            </div>

            <div className="rounded-none border border-dashed border-line/80 bg-bg/50 p-5 mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-caption mb-3">
                Add Scholarship or Grant Program
              </p>
              <ScholarshipRow />
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: BURSARY POLICIES & SCHEDULES */}
      {activeTab === "policies" && (
        <section className="rounded-none border border-line bg-surface p-6 shadow-sm sm:p-8 animate-in fade-in duration-200">
          <div className="border-b border-line pb-4 mb-6">
            <h2 className="font-serif text-xl font-medium text-ink">
              Bursary Policies & Guidelines
            </h2>
            <p className="text-xs text-caption sm:text-sm">
              Fee payment policy, instalment plans, penalty terms, and refund guidelines displayed on the public fees page.
            </p>
          </div>

          <form
            action={contentAction}
            className="space-y-6"
            {...createUnsavedFormProps(setDirty)}
          >
            <Message state={contentState} />

            <div className="space-y-2">
              <Label htmlFor="payment_schedule" className="text-xs font-semibold uppercase tracking-wider text-caption">
                Institutional Payment Schedule & Policy
              </Label>
              <Textarea
                id="payment_schedule"
                name="payment_schedule"
                rows={5}
                defaultValue={content?.payment_schedule ?? ""}
                placeholder="Detail payment deadlines, acceptable installment arrangements, and conditions for examination registration..."
                className="text-xs sm:text-sm leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sltf_info" className="text-xs font-semibold uppercase tracking-wider text-caption">
                Students Loan Trust Fund (SLTF) Guidance
              </Label>
              <Textarea
                id="sltf_info"
                name="sltf_info"
                rows={4}
                defaultValue={content?.sltf_info ?? ""}
                placeholder="Information on national SLTF loan application steps, eligibility criteria, and disbursement schedules..."
                className="text-xs sm:text-sm leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hardship_policy" className="text-xs font-semibold uppercase tracking-wider text-caption">
                Hardship Relief & Refund Regulations
              </Label>
              <Textarea
                id="hardship_policy"
                name="hardship_policy"
                rows={4}
                defaultValue={content?.hardship_policy ?? ""}
                placeholder="Terms and percentage refunds applicable if a student withdraws prior to matriculation or within semester..."
                className="text-xs sm:text-sm leading-relaxed"
              />
            </div>

            <StickyFormFooter>
              <UnsavedChangesLabel show={dirty} />
              <SubmitButton label="Save Bursary Policies" />
            </StickyFormFooter>
          </form>
        </section>
      )}
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
  const [state, action] = useActionState(saveFee, {});
  const [components, setComponents] = useState<FeeComponent[]>(
    fee?.components && fee.components.length > 0 ? fee.components : []
  );
  const [showBreakdown, setShowBreakdown] = useState(
    (fee?.components && fee.components.length > 0) || false
  );
  const [amount, setAmount] = useState<string | number>(
    fee?.amount !== undefined ? fee.amount : ""
  );

  function handleAddComponent() {
    setComponents((prev) => [...prev, { name: "", amount: 0 }]);
  }

  function handleRemoveComponent(index: number) {
    const updated = components.filter((_, i) => i !== index);
    setComponents(updated);
    if (updated.length > 0) {
      const sum = updated.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
      setAmount(sum);
    }
  }

  function handleComponentChange(
    index: number,
    field: "name" | "amount",
    val: string | number
  ) {
    const updated = [...components];
    if (field === "name") {
      updated[index] = { ...updated[index], name: String(val) };
    } else {
      updated[index] = { ...updated[index], amount: Number(val) || 0 };
    }
    setComponents(updated);
    const sum = updated.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
    setAmount(sum);
  }

  return (
    <div className="rounded-none border border-line bg-surface p-4 sm:p-5 shadow-sm hover:border-line/80 transition-shadow">
      <form
        action={action}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 items-end"
      >
        {fee ? <input type="hidden" name="id" value={fee.id} /> : null}
        <input
          type="hidden"
          name="components_json"
          value={components.length > 0 ? JSON.stringify(components) : ""}
        />

        <div className="space-y-1 sm:col-span-2 lg:col-span-3">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-caption">
            Programme
          </Label>
          <select
            name="program_id"
            defaultValue={fee?.program_id ?? ""}
            className="flex h-9 w-full rounded-none border border-line bg-bg px-2 text-xs font-medium text-ink"
          >
            <option value="">All programmes</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1 sm:col-span-1 lg:col-span-2">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-caption">
            Cohort / Year
          </Label>
          <Input
            name="year_label"
            defaultValue={fee?.year_label}
            placeholder="e.g. Year 1"
            className="h-9 text-xs font-medium rounded-none"
            required
          />
        </div>

        <div className="space-y-1 sm:col-span-1 lg:col-span-3">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-caption">
            Fee Category
          </Label>
          <Input
            name="fee_type"
            defaultValue={fee?.fee_type}
            placeholder="e.g. Tuition & Clinical Training"
            className="h-9 text-xs font-medium rounded-none"
            required
          />
        </div>

        <div className="space-y-1 sm:col-span-1 lg:col-span-2">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-caption">
            Total Amount (GHS)
          </Label>
          <Input
            name="amount"
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="h-9 text-xs font-mono font-bold rounded-none"
            required
          />
        </div>

        <div className="space-y-1 sm:col-span-1 lg:col-span-2">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-caption">
            Sort Order
          </Label>
          <Input
            name="sort_order"
            type="number"
            defaultValue={fee?.sort_order ?? 0}
            className="h-9 text-xs rounded-none"
          />
        </div>

        <div className="space-y-1 sm:col-span-2 lg:col-span-8">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-caption">
            Payment Due Note / Terms
          </Label>
          <Input
            name="due_note"
            defaultValue={fee?.due_note}
            placeholder="e.g. 60% Semester 1, 40% before Semester 2"
            className="h-9 text-xs rounded-none"
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-4 justify-end">
          <button
            type="button"
            onClick={() => {
              if (!showBreakdown && components.length === 0) {
                const half =
                  typeof amount === "number" && amount > 0
                    ? Math.round(amount / 2)
                    : 500;
                setComponents([
                  { name: "Tuition & Academic Lectures", amount: half },
                  { name: "Clinical Practicum & Demonstration Lab", amount: half },
                ]);
                setAmount(half * 2);
              }
              setShowBreakdown(!showBreakdown);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline px-2.5 py-1.5 border border-line bg-bg rounded-none"
          >
            <Receipt className="h-3.5 w-3.5" />
            <span>{showBreakdown ? "Hide Levies" : "Itemize Components"}</span>
          </button>
          <SubmitButton label={fee ? "Update" : "Add schedule"} />
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

        {/* Itemized Components Builder Tray */}
        {showBreakdown && (
          <div className="sm:col-span-2 lg:col-span-12 rounded-none border border-line bg-bg/60 p-3.5 space-y-3 mt-1">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-caption flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5 text-primary" />
                <span>Itemized Fee Components (Auto-Calculates Total Amount)</span>
              </span>
              <button
                type="button"
                onClick={handleAddComponent}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <Plus className="h-3 w-3" />
                <span>Add Component</span>
              </button>
            </div>

            <div className="space-y-2">
              {components.map((comp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder="Component name (e.g. Tuition, Practicum, Skills Lab)"
                    value={comp.name}
                    onChange={(e) =>
                      handleComponentChange(idx, "name", e.target.value)
                    }
                    className="h-8 text-xs rounded-none flex-1 bg-surface"
                  />
                  <div className="flex items-center gap-1 shrink-0 w-36">
                    <span className="text-xs text-caption font-mono">GHS</span>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      value={comp.amount}
                      onChange={(e) =>
                        handleComponentChange(idx, "amount", e.target.value)
                      }
                      className="h-8 text-xs font-mono font-bold rounded-none bg-surface"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveComponent(idx)}
                    className="p-1.5 text-caption hover:text-red-600 transition-colors"
                    aria-label="Remove component"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {components.length === 0 && (
                <p className="text-xs text-caption py-1">
                  No itemized components added. Click &quot;Add Component&quot; to break this fee down.
                </p>
              )}
            </div>

            {components.length > 0 && (
              <div className="pt-2 border-t border-line/70 flex items-center justify-between text-xs font-bold text-ink">
                <span>Sum of Components:</span>
                <span className="font-mono text-primary text-sm">
                  GHS {Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="sm:col-span-2 lg:col-span-12">
          <Message state={state} />
        </div>
      </form>
    </div>
  );
}

function PaymentMethodRow({ method }: { method?: PaymentMethod }) {
  const [state, action] = useActionState(savePaymentMethod, {});

  return (
    <div className="rounded-none border border-line bg-surface p-4 shadow-sm">
      <form action={action} className="grid gap-3 sm:grid-cols-12 items-end">
        {method ? <input type="hidden" name="id" value={method.id} /> : null}

        <div className="space-y-1 sm:col-span-4">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-caption">
            Channel Name
          </Label>
          <Input
            name="method"
            defaultValue={method?.method}
            placeholder="e.g. GCB Bank / MTN MoMo Paybill"
            className="h-9 text-xs font-semibold rounded-none"
            required
          />
        </div>

        <div className="space-y-1 sm:col-span-5">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-caption">
            Account / Paybill Instructions
          </Label>
          <Input
            name="details"
            defaultValue={method?.details}
            placeholder="Account No: 1234567890 · Branch: Nandom"
            className="h-9 text-xs rounded-none"
          />
        </div>

        <div className="space-y-1 sm:col-span-1">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-caption">
            Sort
          </Label>
          <Input
            name="sort_order"
            type="number"
            defaultValue={method?.sort_order ?? 0}
            className="h-9 text-xs rounded-none"
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2 justify-end">
          <SubmitButton label={method ? "Update" : "Save"} />
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

        <div className="sm:col-span-12">
          <Message state={state} />
        </div>
      </form>
    </div>
  );
}

function ScholarshipRow({ scholarship }: { scholarship?: Scholarship }) {
  const [state, action] = useActionState(saveScholarship, {});

  return (
    <div className="rounded-none border border-line bg-surface p-5 shadow-sm space-y-3">
      <form action={action} className="space-y-3">
        {scholarship ? <input type="hidden" name="id" value={scholarship.id} /> : null}

        <div className="grid gap-3 sm:grid-cols-12 items-end">
          <div className="space-y-1 sm:col-span-9">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-caption">
              Scholarship / Scheme Title
            </Label>
            <Input
              name="name"
              defaultValue={scholarship?.name}
              placeholder="e.g. Ghana National Petroleum Corporation (GNPC) Foundation Scholarship"
              className="font-semibold text-sm h-9"
              required
            />
          </div>

          <div className="space-y-1 sm:col-span-3">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-caption">
              External Portal Link
            </Label>
            <Input
              name="external_url"
              type="url"
              defaultValue={scholarship?.external_url ?? ""}
              placeholder="https://…"
              className="h-9 text-xs"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-caption">
              Eligibility Requirements
            </Label>
            <Textarea
              name="eligibility"
              defaultValue={scholarship?.eligibility}
              rows={2}
              placeholder="e.g. Open to Level 100–300 Ghanaian citizens with strong academic standing..."
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-caption">
              Application Instructions
            </Label>
            <Textarea
              name="how_to_apply"
              defaultValue={scholarship?.how_to_apply}
              rows={2}
              placeholder="e.g. Apply online through the Scholarship Secretariat portal before October 31..."
              className="text-xs"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line/60">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-caption">Sort order:</span>
            <Input
              name="sort_order"
              type="number"
              defaultValue={scholarship?.sort_order ?? 0}
              className="w-16 text-xs h-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <SubmitButton label={scholarship ? "Update scholarship" : "Save scholarship"} />
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
        </div>

        <Message state={state} />
      </form>
    </div>
  );
}
