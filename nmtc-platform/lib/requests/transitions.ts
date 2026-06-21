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
    roles: ["academic", "accounts", "principal"],
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
        (role === "super_admin" || t.roles.includes(role))
    ) ?? null
  );
}
