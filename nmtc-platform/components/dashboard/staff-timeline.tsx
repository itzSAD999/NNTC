import { formatShortDate } from "@/lib/utils/format";
import { STAFF_EVENT_LABELS } from "@/lib/requests/status-labels";
import { cn } from "@/lib/utils";

interface StaffTimelineProps {
  items: {
    action: string;
    actor_label: string;
    note: string | null;
    created_at: string;
  }[];
  className?: string;
}

export function StaffTimeline({ items, className }: StaffTimelineProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-caption">No events recorded yet.</p>
    );
  }

  return (
    <ol className={cn("space-y-0", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const label = STAFF_EVENT_LABELS[item.action] ?? item.action;

        return (
          <li key={`${item.created_at}-${item.action}`} className="relative flex gap-4">
            {!isLast ? (
              <span
                className="absolute left-[7px] top-4 h-full w-px bg-line"
                aria-hidden
              />
            ) : null}
            <span
              className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary bg-surface"
              aria-hidden
            />
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p className="text-sm font-medium text-ink">{label}</p>
              <p className="mt-0.5 text-xs text-caption">
                {item.actor_label} ·{" "}
                <time dateTime={item.created_at} className="ref-mono">
                  {formatShortDate(item.created_at)}
                </time>
              </p>
              {item.note ? (
                <p className="mt-2 rounded border border-line bg-bg px-3 py-2 text-sm text-caption">
                  {item.note}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
