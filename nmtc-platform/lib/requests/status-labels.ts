import type { RequestStatus } from "@/lib/constants";

/** Student-facing status labels (no internal detail). */
export const STATUS_LABELS: Record<RequestStatus, string> = {
  submitted: "Submitted",
  returned: "Returned — action required",
  academic_approved: "Academic review complete",
  payment_confirmed: "Payment verified",
  approved: "Approved — ready for collection",
  collected: "Collected",
};

/** Public timeline labels for request_events.action values. */
export const EVENT_LABELS: Record<string, string> = {
  submitted: "Request submitted",
  academic_approved: "Passed academic review",
  sent_back: "Returned for corrections",
  payment_confirmed: "Payment confirmed",
  rejected_receipt: "Receipt needs attention",
  principal_approved: "Final approval granted",
  notified: "You were notified by email",
  collected: "Document collected",
};

/** Staff dashboard timeline labels (includes internal notes). */
export const STAFF_EVENT_LABELS: Record<string, string> = {
  ...EVENT_LABELS,
  sent_back: "Sent back to student",
  rejected_receipt: "Receipt rejected",
};

/** Actions visible on the student track timeline (no internal notes). */
export const PUBLIC_EVENT_ACTIONS = new Set([
  "submitted",
  "academic_approved",
  "sent_back",
  "payment_confirmed",
  "rejected_receipt",
  "principal_approved",
  "notified",
  "collected",
]);
