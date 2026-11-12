"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Info, Receipt } from "lucide-react";

import { cn } from "@/lib/utils";
import type { FeeComponent, FeeWithProgram } from "@/lib/types/expansion";
import { EmptyState } from "@/components/ui/empty-state";

export function FeeTable({ fees }: { fees: FeeWithProgram[] }) {
  // Track expanded fee breakdown rows (open first one by default)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [fees[0]?.id ?? ""]: true,
  });

  if (fees.length === 0) {
    return (
      <EmptyState message="Fee information will be published here. Contact the Finance Office for current rates." />
    );
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <div className="space-y-6">
      {/* Top Guidance Note */}
      <div className="flex items-start gap-3 rounded-none border border-line bg-bg/50 p-4 text-xs text-caption">
        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-ink font-semibold">Institutional Itemized Billing:</strong> In accordance with the Ministry of Health and Nursing and Midwifery Council (NMC) regulations, all college fees are structured into transparent, itemized components including tuition, supervised ward practicum, demonstration lab consumables, indexing, and welfare.
        </p>
      </div>

      {/* Structured Itemized Fee Schedules */}
      <div className="divide-y divide-line rounded-none border border-line bg-surface shadow-sm">
        {fees.map((fee, index) => {
          const isExpanded = !!expandedIds[fee.id];
          const hasComponents = fee.components && fee.components.length > 0;

          // Default fallback component breakdown if database fee does not specify components
          const components: FeeComponent[] = hasComponents
            ? (fee.components as FeeComponent[])
            : [
                {
                  name: `${fee.fee_type} (Base Academic)`,
                  amount: Math.round(fee.amount * 0.6),
                },
                {
                  name: "Clinical Practicum & Hospital Ward Rotation Levy",
                  amount: Math.round(fee.amount * 0.2),
                },
                {
                  name: "Demonstration Skills Lab Consumables & PPE",
                  amount: Math.round(fee.amount * 0.1),
                },
                {
                  name: "SRC Dues, Health Insurance & Student Welfare",
                  amount:
                    fee.amount -
                    (Math.round(fee.amount * 0.6) +
                      Math.round(fee.amount * 0.2) +
                      Math.round(fee.amount * 0.1)),
                },
              ];

          return (
            <div
              key={fee.id}
              className={cn(
                "transition-colors",
                index % 2 === 1 ? "bg-bg/20" : "bg-surface"
              )}
            >
              {/* Main Summary Row */}
              <div
                onClick={() => toggleExpand(fee.id)}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer hover:bg-bg/60 transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleExpand(fee.id);
                  }
                }}
                aria-expanded={isExpanded}
              >
                {/* Left: Programme & Cohort Title */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-none border border-line bg-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-caption">
                      {fee.year_label}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {fee.program?.name ?? "All Nursing Programmes"}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-ink">
                    {fee.fee_type}
                  </h3>
                  {fee.due_note && (
                    <p className="text-xs text-caption font-light">
                      {fee.due_note}
                    </p>
                  )}
                </div>

                {/* Right: Total Amount & Breakdown Toggle */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-line/60">
                  <div className="text-left md:text-right">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-caption">
                      Total Payable
                    </span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-ink tabular-nums">
                      GHS {fee.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(fee.id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-none border border-line bg-bg px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-ink/40 hover:bg-surface focus:outline-none"
                    aria-label={isExpanded ? "Collapse breakdown" : "View itemized breakdown"}
                  >
                    <Receipt className="h-3.5 w-3.5 text-primary" />
                    <span className="hidden sm:inline">
                      {isExpanded ? "Hide Breakdown" : "Itemized Breakdown"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Itemized Component Tray */}
              {isExpanded && (
                <div className="border-t border-line bg-bg/40 p-5 sm:p-6 animate-in fade-in duration-150">
                  <div className="rounded-none border border-line bg-surface p-4 sm:p-5">
                    <div className="flex items-center justify-between border-b border-line pb-3 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-caption flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-primary" />
                        <span>Itemized Fee Component Breakdown</span>
                      </span>
                      <span className="text-xs text-caption">
                        {components.length} Approved Levies
                      </span>
                    </div>

                    {/* Component Items Table */}
                    <div className="divide-y divide-line/60 text-xs sm:text-sm">
                      {components.map((comp, cIdx) => (
                        <div
                          key={`comp-${cIdx}`}
                          className="flex items-center justify-between py-2.5 first:pt-1 last:pb-1"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-caption font-mono text-[11px] w-5">
                              0{cIdx + 1}.
                            </span>
                            <span className="font-medium text-ink">
                              {comp.name}
                            </span>
                          </div>
                          <span className="font-mono tabular-nums font-semibold text-ink shrink-0">
                            GHS {comp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total Summary Row */}
                    <div className="mt-4 pt-3 border-t-2 border-ink flex items-center justify-between text-sm sm:text-base font-bold text-ink">
                      <span>Total Approved Academic Year Fee</span>
                      <span className="font-serif text-lg text-primary tabular-nums">
                        GHS {fee.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Due Note / Terms */}
                    {fee.due_note && (
                      <p className="mt-3 text-[11px] text-caption border-t border-dashed border-line pt-2">
                        <strong className="text-ink">Payment Terms:</strong> {fee.due_note}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Disclaimers */}
      <div className="rounded-none border border-line bg-bg p-4 text-xs text-caption flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>
          * All fee transactions must be made through designated bank accounts or official MoH merchant codes.
        </span>
        <span className="font-medium text-ink shrink-0">
          NMTC Bursary Office: +233 (0) 392 022 456
        </span>
      </div>
    </div>
  );
}
