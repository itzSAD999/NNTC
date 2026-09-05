"use server";

import { revalidatePath } from "next/cache";

import { requireWorkflowMfa } from "@/lib/auth/mfa";
import { requireStaffSession, hasStaffRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  sendRequestApprovedEmail,
  sendRequestReturnedEmail,
} from "@/lib/email/request";
import { findTransition } from "@/lib/requests/transitions";
import type { RequestStatus, Role } from "@/lib/constants";

export type WorkflowActionState = {
  error?: string;
  success?: boolean;
};

async function loadRequest(requestId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*, document_types(name)")
    .eq("id", requestId)
    .single();

  if (error || !data) return null;

  const docRel = data.document_types as
    | { name: string }
    | { name: string }[]
    | null;
  const documentTypeName = Array.isArray(docRel)
    ? docRel[0]?.name
    : docRel?.name ?? "Document";

  return { ...data, documentTypeName };
}

async function applyTransition(
  requestId: string,
  newStatus: RequestStatus,
  note: string | null
): Promise<WorkflowActionState> {
  const session = await requireStaffSession();
  const request = await loadRequest(requestId);

  if (!request) {
    return { error: "Request not found." };
  }

  const transition = findTransition(
    request.status as RequestStatus,
    newStatus,
    session.staff.role as Role
  );

  if (!transition) {
    return {
      error: `This action is not available for the current request status.`,
    };
  }

  const mfa = await requireWorkflowMfa(session.staff.role as Role);
  if (!mfa.ok) {
    return { error: mfa.error };
  }

  if (transition.requiresNote && (!note || note.trim().length < 5)) {
    return { error: "Please provide a note (at least 5 characters)." };
  }

  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("requests")
    .update({ status: newStatus })
    .eq("id", requestId)
    .eq("status", request.status);

  if (updateError) {
    return { error: "Could not update request. It may have changed already." };
  }

  const { error: eventError } = await supabase.from("request_events").insert({
    request_id: requestId,
    actor_id: session.userId,
    actor_label: session.staff.full_name,
    action: transition.action,
    note: note?.trim() || null,
  });

  if (eventError) {
    return { error: "Request updated but audit log failed." };
  }

  const docTypeName = request.documentTypeName;

  if (newStatus === "returned" && note) {
    const context =
      transition.action === "rejected_receipt"
        ? "receipt_rejected"
        : "sent_back";
    await sendRequestReturnedEmail({
      to: request.student_email,
      studentName: request.student_name,
      referenceNo: request.reference_no,
      reason: note.trim(),
      context,
    });
  }

  if (newStatus === "approved") {
    await sendRequestApprovedEmail({
      to: request.student_email,
      studentName: request.student_name,
      referenceNo: request.reference_no,
      documentTypeName: docTypeName,
      deliveryMethod: request.delivery_method,
    });

    await supabase.from("request_events").insert({
      request_id: requestId,
      actor_id: null,
      actor_label: "System",
      action: "notified",
      note: null,
    });
  }

  revalidatePath("/dashboard/academic");
  revalidatePath("/dashboard/accounts");
  revalidatePath("/dashboard/principal");
  revalidatePath(`/dashboard/requests/${requestId}`);

  return { success: true };
}

export async function academicApprove(
  requestId: string
): Promise<WorkflowActionState> {
  await requireStaffSession();
  return applyTransition(requestId, "academic_approved", null);
}

export async function academicSendBack(
  requestId: string,
  note: string
): Promise<WorkflowActionState> {
  await requireStaffSession();
  return applyTransition(requestId, "returned", note);
}

export async function confirmPayment(
  requestId: string
): Promise<WorkflowActionState> {
  await requireStaffSession();
  return applyTransition(requestId, "payment_confirmed", null);
}

export async function rejectReceipt(
  requestId: string,
  note: string
): Promise<WorkflowActionState> {
  await requireStaffSession();
  return applyTransition(requestId, "returned", note);
}

export async function principalApprove(
  requestId: string
): Promise<WorkflowActionState> {
  await requireStaffSession();
  return applyTransition(requestId, "approved", null);
}

export async function principalSendBack(
  requestId: string,
  note: string
): Promise<WorkflowActionState> {
  await requireStaffSession();
  return applyTransition(requestId, "returned", note);
}

export async function markCollected(
  requestId: string
): Promise<WorkflowActionState> {
  const session = await requireStaffSession();
  if (
    !hasStaffRole(session, ["academic", "accounts", "principal"])
  ) {
    return { error: "You do not have permission to mark requests collected." };
  }
  return applyTransition(requestId, "collected", null);
}
