import type { FeeWithProgram } from "@/lib/types/expansion";
import { EmptyState } from "@/components/ui/empty-state";

export function FeeTable({ fees }: { fees: FeeWithProgram[] }) {
  if (fees.length === 0) {
    return (
      <EmptyState message="Fee information will be published here. Contact the Finance Office for current rates." />
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-line bg-surface shadow-sm">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-surface">
          <tr className="border-b-2 border-ink text-left">
            <th
              scope="col"
              className="px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-caption"
            >
              Programme
            </th>
            <th
              scope="col"
              className="px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-caption"
            >
              Year
            </th>
            <th
              scope="col"
              className="px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-caption"
            >
              Fee type
            </th>
            <th
              scope="col"
              className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-[0.14em] text-caption"
            >
              Amount (GHS)
            </th>
            <th
              scope="col"
              className="hidden px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-caption sm:table-cell"
            >
              Due
            </th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee, index) => (
            <tr
              key={fee.id}
              className={`border-b border-line transition-colors last:border-0 hover:bg-bg/80 ${
                index % 2 === 1 ? "bg-bg/40" : "bg-surface"
              }`}
            >
              <td className="px-4 py-3.5 font-medium text-ink">
                {fee.program?.name ?? "All programmes"}
              </td>
              <td className="px-4 py-3.5 text-caption">{fee.year_label}</td>
              <td className="px-4 py-3.5 text-ink">{fee.fee_type}</td>
              <td className="px-4 py-3.5 text-right ref-mono text-base font-medium tabular-nums text-ink">
                {fee.amount.toFixed(2)}
              </td>
              <td className="hidden px-4 py-3.5 text-caption sm:table-cell">
                {fee.due_note || "—"}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-line bg-bg/60">
            <td
              colSpan={5}
              className="px-4 py-3 text-xs text-caption"
            >
              All amounts in Ghana cedis (GHS). Confirm current rates with the Finance Office before payment.
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
