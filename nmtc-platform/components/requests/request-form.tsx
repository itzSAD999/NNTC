"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { submitRequest } from "@/lib/actions/requests";
import {
  PROGRAMME_OPTIONS,
  requestFormSchema,
  validateReceiptFile,
  type RequestFormValues,
} from "@/lib/validation/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DocumentType } from "@/types/database";

interface RequestFormProps {
  documentTypes: DocumentType[];
  supabaseReady: boolean;
}

export function RequestForm({
  documentTypes,
  supabaseReady,
}: RequestFormProps) {
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      delivery_method: "collection",
    },
  });

  const onSubmit = (values: RequestFormValues) => {
    setServerError(null);
    const fileInput = document.getElementById("receipt") as HTMLInputElement;
    const file = fileInput?.files?.[0] ?? null;
    const fileErr = validateReceiptFile(file);
    setReceiptError(fileErr);

    if (fileErr) return;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        formData.append(key, String(value));
      }
    });
    if (file) {
      formData.append("receipt", file);
    }

    startTransition(async () => {
      const result = await submitRequest(formData);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {!supabaseReady ? (
        <p
          role="status"
          className="rounded border border-warning/40 bg-warning/5 px-4 py-3 text-sm text-ink"
        >
          Document requests require Supabase to be connected. Add your project
          keys to <code className="ref-mono text-xs">.env.local</code> to
          enable submissions.
        </p>
      ) : null}

      {serverError ? (
        <p role="alert" className="rounded border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {serverError}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="student_name">Full name *</Label>
          <Input
            id="student_name"
            {...register("student_name")}
            autoComplete="name"
            aria-invalid={!!errors.student_name}
          />
          {errors.student_name ? (
            <p className="text-xs text-danger">{errors.student_name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="student_id">Student ID / index *</Label>
          <Input
            id="student_id"
            {...register("student_id")}
            className="ref-mono"
            aria-invalid={!!errors.student_id}
          />
          {errors.student_id ? (
            <p className="text-xs text-danger">{errors.student_id.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="student_email">Email *</Label>
          <Input
            id="student_email"
            type="email"
            {...register("student_email")}
            autoComplete="email"
            aria-invalid={!!errors.student_email}
          />
          {errors.student_email ? (
            <p className="text-xs text-danger">{errors.student_email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="student_phone">Phone (Ghana)</Label>
          <Input
            id="student_phone"
            type="tel"
            placeholder="+233 XX XXX XXXX"
            {...register("student_phone")}
            aria-invalid={!!errors.student_phone}
          />
          {errors.student_phone ? (
            <p className="text-xs text-danger">{errors.student_phone.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="program">Programme *</Label>
          <select
            id="program"
            {...register("program")}
            defaultValue=""
            className="flex h-10 w-full rounded border border-line bg-surface px-3 py-2 text-sm"
            aria-invalid={!!errors.program}
          >
            <option value="" disabled>
              Select programme
            </option>
            {PROGRAMME_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.program ? (
            <p className="text-xs text-danger">{errors.program.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year_completed">Year completed *</Label>
          <Input
            id="year_completed"
            placeholder="e.g. 2024"
            {...register("year_completed")}
            aria-invalid={!!errors.year_completed}
          />
          {errors.year_completed ? (
            <p className="text-xs text-danger">{errors.year_completed.message}</p>
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="document_type_id">Document type *</Label>
          <select
            id="document_type_id"
            {...register("document_type_id")}
            defaultValue=""
            className="flex h-10 w-full rounded border border-line bg-surface px-3 py-2 text-sm"
            aria-invalid={!!errors.document_type_id}
          >
            <option value="" disabled>
              Select document type
            </option>
            {documentTypes.map((dt) => (
              <option key={dt.id} value={dt.id}>
                {dt.name} — GHS {dt.fee_amount.toFixed(2)}
              </option>
            ))}
          </select>
          {errors.document_type_id ? (
            <p className="text-xs text-danger">
              {errors.document_type_id.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="purpose">Purpose *</Label>
          <Textarea
            id="purpose"
            rows={4}
            placeholder="Briefly explain why you need this document…"
            {...register("purpose")}
            aria-invalid={!!errors.purpose}
          />
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
        {errors.delivery_method ? (
          <p className="text-xs text-danger">{errors.delivery_method.message}</p>
        ) : null}
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="receipt">Payment receipt *</Label>
        <p className="text-xs text-caption">
          Upload a photo or scan of your bank payment receipt (JPG, PNG, or PDF,
          max 5 MB).
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
          aria-invalid={!!receiptError}
        />
        {receiptName ? (
          <p className="text-xs text-caption">Selected: {receiptName}</p>
        ) : null}
        {receiptError ? (
          <p className="text-xs text-danger">{receiptError}</p>
        ) : null}
      </div>

      <Button type="submit" disabled={pending || !supabaseReady} className="w-full sm:w-auto">
        {pending ? "Submitting…" : "Submit request"}
      </Button>
    </form>
  );
}
