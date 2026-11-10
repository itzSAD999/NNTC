"use server";

import { redirect } from "next/navigation";

import { getDocumentTypeById } from "@/lib/data/document-types";
import { sendRequestConfirmationEmail } from "@/lib/email/request";
import { sendRequestSubmittedSms } from "@/lib/sms/arkesel";
import {
  EVENT_LABELS,
  PUBLIC_EVENT_ACTIONS,
} from "@/lib/requests/status-labels";
import { isAdminConfigured } from "@/lib/requests/reference";
import { guardPublicForm } from "@/lib/security/public-forms";
import { receiptObjectPath } from "@/lib/storage/receipts";
import { createAdminClient } from "@/lib/supabase/admin";
import { STORAGE_BUCKETS } from "@/lib/constants";
import {
  requestFormSchema,
  trackFormSchema,
  validateReceiptFile,
  type RequestFormValues,
} from "@/lib/validation/request";
import type { RequestStatus } from "@/lib/constants";

export type SubmitRequestState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof RequestFormValues | "receipt", string>>;
  referenceNo?: string;
};

export type TrackResult =
  | {
      ok: true;
      reference_no: string;
      status: RequestStatus;
      document_type: string;
      timeline: { label: string; at: string }[];
    }
  | {
      ok: false;
      error: string;
    };

export async function submitRequest(
  formData: FormData
): Promise<SubmitRequestState> {
  if (!isAdminConfigured()) {
    return {
      error:
        "Document requests are not available yet — Supabase must be connected with service role key in .env.local.",
    };
  }

  const guard = await guardPublicForm(
    "request",
    formData.get("cf-turnstile-response")?.toString()
  );
  if (!guard.allowed) {
    return {
      error:
        guard.turnstileError ??
        `Too many submissions. Try again in ${guard.retryAfterSeconds ?? 60} seconds.`,
    };
  }

  const receipt = formData.get("receipt");
  const receiptFile = receipt instanceof File && receipt.size > 0 ? receipt : null;
  const receiptError = validateReceiptFile(receiptFile);

  const raw = {
    student_name: formData.get("student_name")?.toString() ?? "",
    student_id: formData.get("student_id")?.toString() ?? "",
    student_email: formData.get("student_email")?.toString() ?? "",
    student_phone: formData.get("student_phone")?.toString() || undefined,
    program: formData.get("program")?.toString() ?? "",
    year_completed: formData.get("year_completed")?.toString() ?? "",
    document_type_id: formData.get("document_type_id")?.toString() ?? "",
    purpose: formData.get("purpose")?.toString() ?? "",
    delivery_method: formData.get("delivery_method")?.toString() ?? "",
  };

  const parsed = requestFormSchema.safeParse(raw);
  const fieldErrors: SubmitRequestState["fieldErrors"] = {};

  if (!parsed.success) {
    parsed.error.errors.forEach((err) => {
      const field = err.path[0] as keyof RequestFormValues;
      if (field) fieldErrors[field] = err.message;
    });
  }

  if (receiptError) {
    fieldErrors.receipt = receiptError;
  }

  if (!parsed.success || receiptError) {
    return {
      error: "Please fix the errors below.",
      fieldErrors,
    };
  }

  const data = parsed.data;
  const docType = await getDocumentTypeById(data.document_type_id);

  if (!docType) {
    return { error: "Selected document type is not available." };
  }

  const supabase = createAdminClient();

  const { data: inserted, error: insertError } = await supabase
    .from("requests")
    .insert({
      student_name: data.student_name,
      student_id: data.student_id,
      student_email: data.student_email,
      student_phone: data.student_phone ?? null,
      program: data.program,
      year_completed: data.year_completed,
      document_type_id: data.document_type_id,
      purpose: data.purpose,
      delivery_method: data.delivery_method,
      status: "submitted" as const,
    })
    .select("id, reference_no")
    .single();

  if (insertError || !inserted) {
    return { error: "Could not submit your request. Please try again." };
  }

  const ext =
    receiptFile!.type === "application/pdf"
      ? "pdf"
      : receiptFile!.type === "image/png"
        ? "png"
        : "jpg";
  const storagePath = `${inserted.id}/${crypto.randomUUID()}-receipt.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.receipts)
    .upload(storagePath, receiptFile!, {
      contentType: receiptFile!.type,
      upsert: false,
    });

  if (uploadError) {
    await supabase.from("requests").delete().eq("id", inserted.id);
    return { error: "Could not upload receipt. Please try again." };
  }

  const { error: receiptUpdateError } = await supabase
    .from("requests")
    .update({ receipt_url: storagePath })
    .eq("id", inserted.id);

  if (receiptUpdateError) {
    await supabase.storage.from(STORAGE_BUCKETS.receipts).remove([storagePath]);
    await supabase.from("requests").delete().eq("id", inserted.id);
    return { error: "Could not save your request. Please try again." };
  }

  await supabase.from("request_events").insert({
    request_id: inserted.id,
    actor_id: null,
    actor_label: "Student",
    action: "submitted",
    note: null,
  });

  await sendRequestConfirmationEmail({
    to: data.student_email,
    studentName: data.student_name,
    referenceNo: inserted.reference_no,
    documentTypeName: docType.name,
    amountExpected: docType.fee_amount,
    deliveryMethod: data.delivery_method,
  });

  if (data.student_phone) {
    await sendRequestSubmittedSms({
      phone: data.student_phone,
      studentName: data.student_name,
      referenceNo: inserted.reference_no,
      docType: docType.name,
    }).catch(() => {});
  }

  redirect(`/request/success?ref=${encodeURIComponent(inserted.reference_no)}`);
}

export async function resubmitRequest(
  formData: FormData
): Promise<SubmitRequestState> {
  if (!isAdminConfigured()) {
    return {
      error:
        "Document requests are not available yet — Supabase must be connected with service role key in .env.local.",
    };
  }

  const guard = await guardPublicForm(
    "request",
    formData.get("cf-turnstile-response")?.toString()
  );
  if (!guard.allowed) {
    return {
      error:
        guard.turnstileError ??
        `Too many submissions. Try again in ${guard.retryAfterSeconds ?? 60} seconds.`,
    };
  }

  const referenceRaw = formData.get("reference_no")?.toString() ?? "";
  const refParsed = trackFormSchema.safeParse({ reference_no: referenceRaw });
  if (!refParsed.success) {
    return { error: "Invalid reference number." };
  }

  const receipt = formData.get("receipt");
  const receiptFile = receipt instanceof File && receipt.size > 0 ? receipt : null;
  const receiptError = validateReceiptFile(receiptFile);

  const raw = {
    student_name: formData.get("student_name")?.toString() ?? "",
    student_id: formData.get("student_id")?.toString() ?? "",
    student_email: formData.get("student_email")?.toString() ?? "",
    student_phone: formData.get("student_phone")?.toString() || undefined,
    program: formData.get("program")?.toString() ?? "",
    year_completed: formData.get("year_completed")?.toString() ?? "",
    document_type_id: formData.get("document_type_id")?.toString() ?? "",
    purpose: formData.get("purpose")?.toString() ?? "",
    delivery_method: formData.get("delivery_method")?.toString() ?? "",
  };

  const parsed = requestFormSchema.safeParse(raw);
  const fieldErrors: SubmitRequestState["fieldErrors"] = {};

  if (!parsed.success) {
    parsed.error.errors.forEach((err) => {
      const field = err.path[0] as keyof RequestFormValues;
      if (field) fieldErrors[field] = err.message;
    });
  }

  if (receiptError) {
    fieldErrors.receipt = receiptError;
  }

  if (!parsed.success || receiptError) {
    return {
      error: "Please fix the errors below.",
      fieldErrors,
    };
  }

  const data = parsed.data;
  const docType = await getDocumentTypeById(data.document_type_id);
  if (!docType) {
    return { error: "Selected document type is not available." };
  }

  const supabase = createAdminClient();
  const referenceNo = refParsed.data.reference_no;

  const { data: existing, error: fetchError } = await supabase
    .from("requests")
    .select("id, status, receipt_url, reference_no")
    .eq("reference_no", referenceNo)
    .single();

  if (fetchError || !existing) {
    return { error: "No request found with that reference number." };
  }

  if (existing.status !== "returned") {
    return {
      error:
        "This request is not awaiting corrections. Only returned requests can be resubmitted.",
    };
  }

  const ext =
    receiptFile!.type === "application/pdf"
      ? "pdf"
      : receiptFile!.type === "image/png"
        ? "png"
        : "jpg";
  const storagePath = `${existing.id}/${crypto.randomUUID()}-receipt.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.receipts)
    .upload(storagePath, receiptFile!, {
      contentType: receiptFile!.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: "Could not upload receipt. Please try again." };
  }

  const oldPath = receiptObjectPath(existing.receipt_url);

  const { error: updateError } = await supabase
    .from("requests")
    .update({
      student_name: data.student_name,
      student_id: data.student_id,
      student_email: data.student_email,
      student_phone: data.student_phone ?? null,
      program: data.program,
      year_completed: data.year_completed,
      document_type_id: data.document_type_id,
      purpose: data.purpose,
      delivery_method: data.delivery_method,
      receipt_url: storagePath,
      status: "submitted" as const,
    })
    .eq("id", existing.id)
    .eq("status", "returned");

  if (updateError) {
    await supabase.storage.from(STORAGE_BUCKETS.receipts).remove([storagePath]);
    return { error: "Could not resubmit your request. Please try again." };
  }

  if (oldPath) {
    await supabase.storage.from(STORAGE_BUCKETS.receipts).remove([oldPath]);
  }

  await supabase.from("request_events").insert({
    request_id: existing.id,
    actor_id: null,
    actor_label: "Student",
    action: "resubmitted",
    note: null,
  });

  await sendRequestConfirmationEmail({
    to: data.student_email,
    studentName: data.student_name,
    referenceNo: existing.reference_no,
    documentTypeName: docType.name,
    amountExpected: docType.fee_amount,
    deliveryMethod: data.delivery_method,
  });

  if (data.student_phone) {
    await sendRequestSubmittedSms({
      phone: data.student_phone,
      studentName: data.student_name,
      referenceNo: existing.reference_no,
      docType: docType.name,
    }).catch(() => {});
  }

  redirect(`/request/success?ref=${encodeURIComponent(existing.reference_no)}`);
}

export async function trackByReference(
  referenceNo: string,
  turnstileToken?: string | null
): Promise<TrackResult> {
  const guard = await guardPublicForm("track", turnstileToken);
  if (!guard.allowed) {
    return {
      ok: false,
      error:
        guard.turnstileError ??
        `Too many lookups. Try again in ${guard.retryAfterSeconds ?? 60} seconds.`,
    };
  }

  const parsed = trackFormSchema.safeParse({ reference_no: referenceNo.trim() });

  if (!parsed.success) {
    return {
      ok: false,
      error:
        "We could not find a request with that reference. Check the number from your confirmation email and try again.",
    };
  }

  if (!isAdminConfigured()) {
    return {
      ok: false,
      error:
        "Tracking is unavailable until Supabase is connected. Please try again later or contact the college.",
    };
  }

  try {
    const supabase = createAdminClient();
    const { data: request, error } = await supabase
      .from("requests")
      .select("id, reference_no, status, document_types(name)")
      .eq("reference_no", parsed.data.reference_no)
      .single();

    if (error || !request) {
      return {
        ok: false,
        error:
          "No request found with that reference number. Double-check the number from your confirmation email and try again.",
      };
    }

    const { data: events } = await supabase
      .from("request_events")
      .select("action, created_at")
      .eq("request_id", request.id)
      .order("created_at", { ascending: true });

    const timeline = (events ?? [])
      .filter((e) => PUBLIC_EVENT_ACTIONS.has(e.action))
      .map((e) => ({
        label: EVENT_LABELS[e.action] ?? e.action,
        at: e.created_at,
      }));

    const docTypeRel = request.document_types as
      | { name: string }
      | { name: string }[]
      | null;
    const docTypeName = Array.isArray(docTypeRel)
      ? docTypeRel[0]?.name
      : docTypeRel?.name ?? "Document";

    return {
      ok: true,
      reference_no: request.reference_no,
      status: request.status as RequestStatus,
      document_type: docTypeName,
      timeline,
    };
  } catch {
    return {
      ok: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

