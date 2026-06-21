import type { PrincipalStats } from "@/lib/data/dashboard-requests";

interface PrincipalSummaryStripProps {
  stats: PrincipalStats;
}

export function PrincipalSummaryStrip({ stats }: PrincipalSummaryStripProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        { label: "Approved this week", value: stats.week },
        { label: "Approved this month", value: stats.month },
        { label: "Total approved", value: stats.total },
      ].map(({ label, value }) => (
        <div
          key={label}
          className="rounded border border-line bg-surface px-5 py-4"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-caption">
            {label}
          </p>
          <p className="ref-mono mt-2 text-2xl font-medium text-ink">{value}</p>
        </div>
      ))}
    </div>
  );
}
