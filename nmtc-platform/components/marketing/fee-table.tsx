"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Layers, Calendar, CheckCircle } from "lucide-react";

import type { FeeWithProgram } from "@/lib/types/expansion";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

function formatGhs(amount: number) {
  return `GHS ${amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}`;
}

export function FeeTable({ fees }: { fees: FeeWithProgram[] }) {
  // Track open/collapsed state per fee item
  const [openFees, setOpenFees] = useState<Record<string | number, boolean>>(() => {
    const initial: Record<string | number, boolean> = {};
    // Open all or first fee by default
    fees.forEach((fee, idx) => {
      initial[fee.id] = idx === 0;
    });
    return initial;
  });

  const toggleFee = (id: string | number) => {
    setOpenFees((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAll = (open: boolean) => {
    const next: Record<string | number, boolean> = {};
    fees.forEach((f) => {
      next[f.id] = open;
    });
    setOpenFees(next);
  };

  if (fees.length === 0) {
    return (
      <EmptyState message="Fee information will be published here. Contact the Finance Office for current rates." />
    );
  }

  const allOpen = fees.every((f) => openFees[f.id]);

  return (
    <div className="space-y-4">
      {/* Controls to Expand / Collapse All */}
      <div className="flex items-center justify-between pb-1 text-xs text-caption">
        <span className="font-medium text-ink">
          Showing {fees.length} fee schedule{fees.length === 1 ? "" : "s"}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleAll(!allOpen)}
            className="font-semibold text-primary hover:underline"
          >
            {allOpen ? "Collapse all breakdowns" : "Expand all breakdowns"}
          </button>
        </div>
      </div>

      {fees.map((fee) => {
        const components = fee.components?.filter((item) => item.name) ?? [];
        const isOpen = !!openFees[fee.id];

        return (
          <article
            key={fee.id}
            className={cn(
              "overflow-hidden rounded-none border bg-white transition-all duration-200",
              isOpen ? "border-primary/50 shadow-sm" : "border-line hover:border-line/80"
            )}
          >
            {/* Clickable Header */}
            <div
              onClick={() => toggleFee(fee.id)}
              className="flex cursor-pointer flex-wrap items-center justify-between gap-4 p-4 sm:p-5 hover:bg-surface/50 transition-colors select-none"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleFee(fee.id);
                }
              }}
              aria-expanded={isOpen}
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-serif text-lg font-medium text-ink">
                    {fee.program?.name ?? "All programmes"}
                  </p>
                  {fee.fee_type ? (
                    <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-surface border border-line text-caption">
                      {fee.fee_type}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-caption font-medium">
                  {fee.year_label}
                  {components.length > 0 ? ` · ${components.length} itemized components` : ""}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs uppercase tracking-wider text-caption block">Total Approved</span>
                  <span className="font-mono text-xl sm:text-2xl font-bold tabular-nums text-ink text-primary">
                    {formatGhs(fee.amount)}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={isOpen ? "Collapse breakdown" : "Expand breakdown"}
                  className="flex h-8 w-8 items-center justify-center border border-line bg-surface text-ink transition-colors hover:bg-white"
                >
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-primary" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-caption" />
                  )}
                </button>
              </div>
            </div>

            {/* Collapsible Breakdown Content */}
            {isOpen ? (
              <div className="border-t border-line/80 bg-surface/30">
                <div className="px-4 py-2 bg-surface/80 border-b border-line flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-caption">
                  <span>Fee Component / Levy</span>
                  <span>Amount</span>
                </div>

                {components.length > 0 ? (
                  <ul className="divide-y divide-line/60 bg-white">
                    {components.map((item, idx) => (
                      <li
                        key={`${fee.id}-${item.name}-${idx}`}
                        className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm transition-colors hover:bg-surface/50"
                      >
                        <span className="text-ink font-normal">{item.name}</span>
                        <span className="shrink-0 font-mono font-medium tabular-nums text-ink">
                          {formatGhs(item.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-4 text-sm text-caption bg-white">
                    No itemized breakdown published for this fee schedule.
                  </p>
                )}

                {fee.due_note ? (
                  <div className="flex items-start gap-2 border-t border-line bg-surface px-4 py-2.5 text-xs text-caption">
                    <Calendar className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                    <span>{fee.due_note}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
