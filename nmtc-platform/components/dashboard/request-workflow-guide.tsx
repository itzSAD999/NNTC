"use client";

import { DeskHelp } from "@/components/dashboard/desk-help";

const TIPS = {
  academic:
    "Your step only: check the student record, then send the request to Accounts or return it to the student. You do not confirm payment or sign.",
  accounts:
    "Your step only: confirm the receipt and amount, then send it to the Principal. Reject the receipt if payment is incomplete.",
  principal:
    "Your step only: sign payment-verified requests. After you approve, the document is ready to issue. Send back only if something still needs correction.",
} as const;

export function RequestWorkflowGuide({
  highlight,
}: {
  highlight: "academic" | "accounts" | "principal";
}) {
  return (
    <DeskHelp title="Your desk">
      <p>{TIPS[highlight]}</p>
      <p className="mt-2 text-xs text-caption">
        Request → Academic → Accounts → Principal sign → Issued.
      </p>
    </DeskHelp>
  );
}
