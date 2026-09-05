"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { resubmitRequest } from "@/lib/actions/requests";
import {
  PROGRAMME_OPTIONS,
  requestFormSchema,
  validateReceiptFile,
  type RequestFormValues,
} from "@/lib/validation/request";
import type { ResubmitRequestData } from "@/lib/data/request-resubmit";
import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { ReferenceDisplay } from "@/components/requests/reference-display";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DocumentType } from "@/types/database";

interface ResubmitFormProps {
  request: ResubmitRequestData;
  documentTypes: DocumentType[];
}

export function ResubmitForm({ request, documentTypes }: ResubmitFormProps) {
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: request.defaults,
  });

  const onSubmit = (values: RequestFormValues) => {
    setServerError(null);
    const fileInput = document.getElementById("receipt") as HTMLInputElement;
    const file = fileInput?.files?.[0] ?? null;
    const fileErr = validateReceiptFile(file);
    setReceiptError(fileErr);
    if (fileErr) return;

    const formData = new FormData();
    formData.append("reference_no", request.reference_no);
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        formData.append(key, String(value));
      }
    });
    if (file) formData.append("receipt", file);
    if (turnstileToken) {
      formData.append("cf-turnstile-response", turnstileToken);
    }

    startTransition(async () => {
      const result = await resubmitRequest(formData);
      if (result?.error) {
        setServerError(result.error);
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, message]) => {
            if (field === "receipt" && message) {
              setReceiptError(message);
            } else if (message) {
              setError(field as keyof RequestFormValues, { message });
            }
          });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded border border-warning/40 bg-warning/5 p-5">
        <p className="text-sm font-medium text-ink">Action required</p>
        <p className="mt-2 text-sm text-caption">
          Your request was returned for corrections. Update the details below,
          upload a new payment receipt if needed, and resubmit. Your reference
          number stays the same.
        </p>
        <ReferenceDisplay
          referenceNo={request.reference_no}
          className="mt-4"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {serverError ? (
          <p
            role="alert"
            className="rounded border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
          >
            {serverError}
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="student_name">Full name *</Label>
            <Input id="student_name" {...register("student_name")} />
            {errors.student_name ? (
              <p className="text-xs text-danger">{errors.student_name.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="student_id">Student ID / index *</Label>
            <Input id="student_id" {...register("student_id")} className="ref-mono" />
            {errors.student_id ? (
              <p className="text-xs text-danger">{errors.student_id.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="student_email">Email *</Label>
            <Input id="student_email" type="email" {...register("student_email")} />
            {errors.student_email ? (
              <p className="text-xs text-danger">{errors.student_email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="student_phone">Phone (Ghana)</Label>
            <Input id="student_phone" type="tel" {...register("student_phone")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="program">Programme *</Label>
            <select
              id="program"
              {...register("program")}
              className="flex h-10 w-full rounded border border-line bg-surface px-3 py-2 text-sm"
            >
              {PROGRAMME_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year_completed">Year completed *</Label>
            <Input id="year_completed" {...register("year_completed")} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="document_type_id">Document type *</Label>
            <select
              id="document_type_id"
              {...register("document_type_id")}
              className="flex h-10 w-full rounded border border-line bg-surface px-3 py-2 text-sm"
            >
              {documentTypes.map((dt) => (
                <option key={dt.id} value={dt.id}>
                  {dt.name} — GHS {dt.fee_amount.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Textarea id="purpose" rows={4} {...register("purpose")} />
            {errors.purpose ? (
              <p className="text-xs text-danger">{errors.purpose.message}</p>
            ) : null}
          </div>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-ink">Delivery method *</legend>
          <div className="flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                value="collection"
                {...register("delivery_method")}
                className="h-4 w-4 accent-primary"
              />
              Collection at college
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                value="email"
                {...register("delivery_method")}
                className="h-4 w-4 accent-primary"
              />
              Email delivery
            </label>
          </div>
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="receipt">New payment receipt *</Label>
          <p className="text-xs text-caption">
            Upload a corrected receipt if staff asked you to (JPG, PNG, or PDF, max 5 MB).
          </p>
          <Input
            id="receipt"
            name="receipt"
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            className="cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:text-white"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setReceiptName(f?.name ?? null);
              setReceiptError(f ? validateReceiptFile(f) : null);
            }}
          />
          {receiptName ? (
            <p className="text-xs text-caption">Selected: {receiptName}</p>
          ) : null}
          {receiptError ? (
            <p className="text-xs text-danger">{receiptError}</p>
          ) : null}
        </div>

        <TurnstileWidget
          onToken={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
        />

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Resubmitting…" : "Resubmit request"}
          </Button>
          <Button asChild variant="outline">
            <Link href={`/request/track?ref=${encodeURIComponent(request.reference_no)}`}>
              Back to tracking
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
