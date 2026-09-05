import { cn } from "@/lib/utils";

type WorkflowStep = "submitted" | "academic" | "accounts" | "principal" | "completed";

const STEPS: { key: WorkflowStep; label: string; detail: string }[] = [
  {
    key: "submitted",
    label: "Student submits",
    detail: "Online request form with documents",
  },
  {
    key: "academic",
    label: "Academic review",
    detail: "Verify student record and approve or return",
  },
  {
    key: "accounts",
    label: "Accounts verification",
    detail: "Confirm payment receipt",
  },
  {
    key: "principal",
    label: "Principal approval",
    detail: "Final sign-off before processing",
  },
  {
    key: "completed",
    label: "Completed",
    detail: "Student notified; document prepared",
  },
];

const ROLE_INTROS: Record<Exclude<WorkflowStep, "submitted" | "completed">, string> = {
  academic:
    "You are the first reviewer. Open each request, check the student details and documents, then approve to send it to Accounts or return it to the student with a note.",
  accounts:
    "Requests here have passed Academic review. Verify the payment receipt, then approve to forward to the Principal or return with a note.",
  principal:
    "Requests here have verified payment. Give final approval to begin document preparation, or return with a note if something is wrong.",
};

export function RequestWorkflowGuide({
  highlight,
}: {
  highlight: "academic" | "accounts" | "principal";
}) {
  return (
    <div className="space-y-4 rounded border border-line bg-bg px-4 py-4">
      <div>
        <p className="text-sm font-medium text-ink">How document requests work</p>
        <p className="mt-2 text-sm leading-relaxed text-caption">
          {ROLE_INTROS[highlight]}
        </p>
      </div>
      <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
        {STEPS.map((step, index) => {
          const active = step.key === highlight;
          return (
            <li
              key={step.key}
              className={cn(
                "flex min-w-[9rem] flex-1 flex-col rounded border px-3 py-2 text-xs",
                active
                  ? "border-primary bg-primary/5 text-ink"
                  : "border-line bg-surface text-caption"
              )}
            >
              <span className="font-medium">
                {index + 1}. {step.label}
                {active ? " — your step" : null}
              </span>
              <span className="mt-1 leading-relaxed">{step.detail}</span>
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-caption">
        Click <strong className="font-medium text-ink">Review</strong> on a row
        to open the full request, read attachments, add notes, and change
        status.
      </p>
    </div>
  );
}
