"use client";

import { useState } from "react";
import {
  FileText,
  FileCheck2,
  Receipt,
  Award,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type WorkflowStep = "submitted" | "academic" | "accounts" | "principal" | "completed";

const STEPS: {
  key: WorkflowStep;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "submitted", label: "Application", icon: FileText },
  { key: "academic", label: "Academic Review", icon: FileCheck2 },
  { key: "accounts", label: "Accounts Check", icon: Receipt },
  { key: "principal", label: "Principal Sign", icon: Award },
  { key: "completed", label: "Issued", icon: CheckCircle2 },
];

const STEP_TIPS: Record<"academic" | "accounts" | "principal", string> = {
  academic:
    "Check student records & programme details. Approving forwards to Accounts for fee verification. Returning notifies the student with your notes.",
  accounts:
    "Verify Paystack / Mobile Money receipt and amount paid. Approving forwards to the Principal for executive sign-off.",
  principal:
    "Review verified applications for executive authorization, certificate signing, and digital issuance.",
};

export function RequestWorkflowGuide({
  highlight,
}: {
  highlight: "academic" | "accounts" | "principal";
}) {
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="rounded-xl border border-line bg-surface p-3 shadow-2xs">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Compact Stepper */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-0.5 text-xs">
          {STEPS.map((step, index) => {
            const isCurrent = step.key === highlight;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex items-center gap-1 sm:gap-2 shrink-0">
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                    isCurrent
                      ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                      : "text-caption bg-bg/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5",
                      isCurrent ? "text-primary" : "text-caption"
                    )}
                  />
                  <span>{step.label}</span>
                  {isCurrent && (
                    <span className="rounded bg-primary text-white text-[0.6rem] px-1.5 py-0.2 uppercase tracking-wider font-bold">
                      Your Desk
                    </span>
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-caption/40 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Compact Guidance Toggle */}
        <button
          type="button"
          onClick={() => setShowTips(!showTips)}
          className="inline-flex items-center gap-1.5 text-xs text-caption hover:text-ink shrink-0 transition-colors self-start sm:self-auto"
        >
          <HelpCircle className="h-3.5 w-3.5 text-primary" />
          <span>{showTips ? "Hide guidance" : "Desk guidance"}</span>
        </button>
      </div>

      {/* Expandable concise tip */}
      {showTips && (
        <div className="mt-2.5 border-t border-line/60 pt-2 text-xs text-caption flex items-start justify-between gap-3 bg-bg/40 rounded-lg p-2.5">
          <p className="leading-relaxed">{STEP_TIPS[highlight]}</p>
          <button
            type="button"
            onClick={() => setShowTips(false)}
            className="text-caption hover:text-ink shrink-0 p-0.5"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
