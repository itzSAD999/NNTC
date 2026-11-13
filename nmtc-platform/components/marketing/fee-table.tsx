import type { FeeWithProgram } from "@/lib/types/expansion";
import { EmptyState } from "@/components/ui/empty-state";

function formatGhs(amount: number) {
  return `GHS ${amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}`;
}

export function FeeTable({ fees }: { fees: FeeWithProgram[] }) {
  if (fees.length === 0) {
    return (
      <EmptyState message="Fee information will be published here. Contact the Finance Office for current rates." />
    );
  }

  return (
    <div className="space-y-4">
      {fees.map((fee) => {
        const components = fee.components?.filter((item) => item.name) ?? [];
        return (
          <article key={fee.id} className="border border-line bg-white">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3">
              <div>
                <p className="font-medium text-ink">
                  {fee.program?.name ?? "All programmes"}
                </p>
                <p className="mt-0.5 text-sm text-caption">
                  {fee.year_label}
                  {fee.fee_type ? ` · ${fee.fee_type}` : ""}
                </p>
              </div>
              <p className="font-medium tabular-nums text-ink">
                {formatGhs(fee.amount)}
              </p>
            </div>
            {components.length > 0 ? (
              <ul>
                {components.map((item) => (
                  <li
                    key={`${fee.id}-${item.name}`}
                    className="flex items-center justify-between gap-4 border-b border-line px-4 py-2 text-sm last:border-b-0"
                  >
                    <span className="text-ink">{item.name}</span>
                    <span className="shrink-0 tabular-nums text-caption">
                      {formatGhs(item.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-3 text-sm text-caption">
                No itemized breakdown published for this fee.
              </p>
            )}
            {fee.due_note ? (
              <p className="border-t border-line px-4 py-2 text-xs text-caption">
                {fee.due_note}
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
