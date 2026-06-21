"use client";

import { useState, useTransition } from "react";

import {
  academicApprove,
  academicSendBack,
  confirmPayment,
  markCollected,
  principalApprove,
  principalSendBack,
  rejectReceipt,
  type WorkflowActionState,
} from "@/lib/actions/request-workflow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RequestStatus } from "@/lib/constants";
import type { Role } from "@/lib/constants";

interface WorkflowActionsProps {
  requestId: string;
  status: RequestStatus;
  role: Role;
}

type ActionKind =
  | "academic_approve"
  | "academic_send_back"
  | "confirm_payment"
  | "reject_receipt"
  | "principal_approve"
  | "principal_send_back"
  | "mark_collected";

export function WorkflowActions({
  requestId,
  status,
  role,
}: WorkflowActionsProps) {
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [showNoteFor, setShowNoteFor] = useState<ActionKind | null>(null);
  const [message, setMessage] = useState<WorkflowActionState | null>(null);

  const isSuper = role === "super_admin";

  const canAcademic = role === "academic" || isSuper;
  const canAccounts = role === "accounts" || isSuper;
  const canPrincipal = role === "principal" || isSuper;
  const canCollect =
    role === "academic" ||
    role === "accounts" ||
    role === "principal" ||
    isSuper;

  async function run(action: ActionKind) {
    setMessage(null);

    const handlers: Record<ActionKind, () => Promise<WorkflowActionState>> = {
      academic_approve: () => academicApprove(requestId),
      academic_send_back: () => academicSendBack(requestId, note),
      confirm_payment: () => confirmPayment(requestId),
      reject_receipt: () => rejectReceipt(requestId, note),
      principal_approve: () => principalApprove(requestId),
      principal_send_back: () => principalSendBack(requestId, note),
      mark_collected: () => markCollected(requestId),
    };

    startTransition(async () => {
      const result = await handlers[action]();
      setMessage(result);
      if (result.success) {
        setShowNoteFor(null);
        setNote("");
      }
    });
  }

  return (
    <div className="space-y-4 rounded border border-line bg-surface p-5">
      <h2 className="font-serif text-display-sm">Actions</h2>

      {message?.error ? (
        <p role="alert" className="text-sm text-danger">
          {message.error}
        </p>
      ) : null}
      {message?.success ? (
        <p role="status" className="text-sm text-success">
          Request updated successfully.
        </p>
      ) : null}

      {status === "submitted" && canAcademic ? (
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={pending}
            onClick={() => run("academic_approve")}
          >
            Approve &amp; forward
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() =>
              setShowNoteFor(
                showNoteFor === "academic_send_back" ? null : "academic_send_back"
              )
            }
          >
            Send back
          </Button>
        </div>
      ) : null}

      {status === "academic_approved" && canAccounts ? (
        <div className="flex flex-wrap gap-2">
          <Button disabled={pending} onClick={() => run("confirm_payment")}>
            Confirm payment
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={() =>
              setShowNoteFor(
                showNoteFor === "reject_receipt" ? null : "reject_receipt"
              )
            }
          >
            Reject receipt
          </Button>
        </div>
      ) : null}

      {status === "payment_confirmed" && canPrincipal ? (
        <div className="flex flex-wrap gap-2">
          <Button disabled={pending} onClick={() => run("principal_approve")}>
            Approve
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() =>
              setShowNoteFor(
                showNoteFor === "principal_send_back" ? null : "principal_send_back"
              )
            }
          >
            Send back to Academic
          </Button>
        </div>
      ) : null}

      {status === "approved" && canCollect ? (
        <Button disabled={pending} onClick={() => run("mark_collected")}>
          Mark collected
        </Button>
      ) : null}

      {showNoteFor ? (
        <div className="space-y-3 border-t border-line pt-4">
          <Label htmlFor="workflow-note">Note to student *</Label>
          <Textarea
            id="workflow-note"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Explain what the student needs to correct…"
          />
          <Button
            disabled={pending || note.trim().length < 5}
            onClick={() => run(showNoteFor)}
          >
            {pending ? "Submitting…" : "Submit with note"}
          </Button>
        </div>
      ) : null}

      {status === "collected" ? (
        <p className="text-sm text-caption">This request is complete.</p>
      ) : null}

      {status === "returned" ? (
        <p className="text-sm text-caption">
          Awaiting student action. No staff actions available at this stage.
        </p>
      ) : null}
    </div>
  );
}
