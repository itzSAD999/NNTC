import type { RequestStatus, Role } from "@/lib/constants";

type Transition = {
  from: RequestStatus[];
  to: RequestStatus;
  roles: Role[];
  action: string;
  requiresNote?: boolean;
};

export const WORKFLOW_TRANSITIONS: Transition[] = [
  {
    from: ["submitted"],
    to: "academic_approved",
    roles: ["academic"],
    action: "academic_approved",
  },
  {
    from: ["submitted"],
    to: "returned",
    roles: ["academic"],
    action: "sent_back",
    requiresNote: true,
  },
  {
    from: ["academic_approved"],
    to: "payment_confirmed",
    roles: ["accounts"],
    action: "payment_confirmed",
  },
  {
    from: ["academic_approved"],
    to: "returned",
    roles: ["accounts"],
    action: "rejected_receipt",
    requiresNote: true,
  },
  {
    from: ["payment_confirmed"],
    to: "approved",
    roles: ["principal"],
    action: "principal_approved",
  },
  {
    from: ["payment_confirmed"],
    to: "returned",
    roles: ["principal"],
    action: "sent_back",
    requiresNote: true,
  },
  {
    from: ["approved"],
    to: "collected",
    roles: ["academic"],
    action: "collected",
  },
];

export function findTransition(
  currentStatus: RequestStatus,
  newStatus: RequestStatus,
  role: Role
): Transition | null {
  return (
    WORKFLOW_TRANSITIONS.find(
      (t) =>
        t.from.includes(currentStatus) &&
        t.to === newStatus &&
        t.roles.includes(role)
    ) ?? null
  );
}

export type WorkflowUiAction = {
  id: string;
  label: string;
  variant: "default" | "outline" | "destructive";
  requiresNote: boolean;
  toStatus: RequestStatus;
};

const UI_BY_ACTION: Record<
  string,
  Omit<WorkflowUiAction, "toStatus"> & { toStatus: RequestStatus }
> = {
  academic_approved: {
    id: "academic_approve",
    label: "Approve & forward",
    variant: "default",
    requiresNote: false,
    toStatus: "academic_approved",
  },
  sent_back: {
    id: "send_back",
    label: "Return to student",
    variant: "outline",
    requiresNote: true,
    toStatus: "returned",
  },
  payment_confirmed: {
    id: "confirm_payment",
    label: "Payment verified",
    variant: "default",
    requiresNote: false,
    toStatus: "payment_confirmed",
  },
  rejected_receipt: {
    id: "reject_receipt",
    label: "Reject receipt",
    variant: "destructive",
    requiresNote: true,
    toStatus: "returned",
  },
  principal_approved: {
    id: "principal_approve",
    label: "Sign / Approve",
    variant: "default",
    requiresNote: false,
    toStatus: "approved",
  },
  collected: {
    id: "mark_collected",
    label: "Mark collected",
    variant: "default",
    requiresNote: false,
    toStatus: "collected",
  },
};

/** Legal next actions for the staff UI — mirrors enforce_request_transition() in the DB. */
export function getWorkflowUiActions(
  currentStatus: RequestStatus,
  role: Role
): WorkflowUiAction[] {
  const seen = new Set<string>();
  const actions: WorkflowUiAction[] = [];

  for (const t of WORKFLOW_TRANSITIONS) {
    if (!t.from.includes(currentStatus)) continue;
    if (!t.roles.includes(role)) continue;

    const ui = UI_BY_ACTION[t.action];
    if (!ui || seen.has(ui.id)) continue;
    seen.add(ui.id);
    const label =
      t.action === "sent_back" && currentStatus === "payment_confirmed"
        ? "Send back to Academic"
        : ui.label;
    actions.push({ ...ui, label });
  }

  return actions;
}
