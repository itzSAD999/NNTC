"use client";

import { useMemo, useState, useTransition } from "react";

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
import { getWorkflowUiActions } from "@/lib/requests/transitions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RequestStatus } from "@/lib/constants";
import type { Role } from "@/lib/constants";

interface WorkflowActionsProps {
  requestId: string;
  status: RequestStatus;
  role: Role;
  preview?: boolean;
  onPreviewStatus?: (status: RequestStatus) => void;
}

export function WorkflowActions({
  requestId,
  status,
  role,
  preview = false,
  onPreviewStatus,
}: WorkflowActionsProps) {
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [noteActionId, setNoteActionId] = useState<string | null>(null);
  const [message, setMessage] = useState<WorkflowActionState | null>(null);

  const actions = useMemo(
    () => (role === "content_editor" ? [] : getWorkflowUiActions(status, role)),
    [status, role]
  );

  const handlers: Record<string, () => Promise<WorkflowActionState>> = {
    academic_approve: () => academicApprove(requestId),
    send_back: () =>
      status === "payment_confirmed"
        ? principalSendBack(requestId, note)
        : academicSendBack(requestId, note),
    confirm_payment: () => confirmPayment(requestId),
    reject_receipt: () => rejectReceipt(requestId, note),
    principal_approve: () => principalApprove(requestId),
    mark_collected: () => markCollected(requestId),
  };

  function run(actionId: string) {
    setMessage(null);
    const action = actions.find((item) => item.id === actionId);
    if (!action) return;

    if (preview) {
      onPreviewStatus?.(action.toStatus);
      setNoteActionId(null);
      setNote("");
      setMessage({ success: true });
      return;
    }

    const handler = handlers[actionId];
    if (!handler) return;

    startTransition(async () => {
      const result = await handler();
      setMessage(result);
      if (result.success) {
        setNoteActionId(null);
        setNote("");
      }
    });
  }

  if (role === "content_editor") {
    return (
      <div className="border border-line bg-white p-5">
        <h2 className="font-serif text-lg">Actions</h2>
        <p className="mt-2 text-sm text-caption">
          Content editors do not process document requests.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 border border-line bg-white p-5">
      <div>
        <h2 className="font-serif text-lg">Actions</h2>
        {preview ? (
          <p className="mt-1 text-xs text-caption">
            Sample request — buttons update this screen so you can practise the
            desk flow.
          </p>
        ) : null}
      </div>

      {message?.error ? (
        <p role="alert" className="text-sm text-danger">
          {message.error}
        </p>
      ) : null}
      {message?.success ? (
        <p role="status" className="text-sm text-success">
          {preview ? "Status updated on this preview." : "Request updated."}
        </p>
      ) : null}

      {actions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              type="button"
              variant={action.variant}
              disabled={pending}
              onClick={() => {
                if (action.requiresNote) {
                  setNoteActionId(noteActionId === action.id ? null : action.id);
                } else {
                  run(action.id);
                }
              }}
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-caption">
          {role === "super_admin"
            ? "Processing stays with Academic, Accounts, or the Principal. Use those desks to act."
            : status === "collected"
              ? "This request is complete."
              : status === "returned"
                ? "Awaiting the student. No staff action at this stage."
                : "No action for your desk at this stage."}
        </p>
      )}

      {noteActionId ? (
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
            onClick={() => run(noteActionId)}
          >
            {pending ? "Submitting…" : "Submit with note"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
