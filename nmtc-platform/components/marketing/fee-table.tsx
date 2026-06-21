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
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-ink bg-surface text-left">
            <th
              scope="col"
              className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-caption"
            >
              Programme
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-caption"
            >
              Year
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-caption"
            >
              Fee type
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-widest text-caption"
            >
              Amount (GHS)
            </th>
            <th
              scope="col"
              className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-widest text-caption sm:table-cell"
            >
              Due
            </th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee, index) => (
            <tr
              key={fee.id}
              className={`border-b border-line last:border-0 ${
                index % 2 === 1 ? "bg-bg/60" : "bg-surface"
              }`}
            >
              <td className="px-4 py-3 font-medium text-ink">
                {fee.program?.name ?? "All programmes"}
              </td>
              <td className="px-4 py-3 text-caption">{fee.year_label}</td>
              <td className="px-4 py-3 text-ink">{fee.fee_type}</td>
              <td className="px-4 py-3 text-right ref-mono font-medium tabular-nums text-ink">
                {fee.amount.toFixed(2)}
              </td>
              <td className="hidden px-4 py-3 text-caption sm:table-cell">
                {fee.due_note || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
