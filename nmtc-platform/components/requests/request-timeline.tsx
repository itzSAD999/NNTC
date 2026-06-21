import { formatShortDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface TimelineItem {
  label: string;
  at: string;
}

interface RequestTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function RequestTimeline({ items, className }: RequestTimelineProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-caption">
        Your request is being processed. Check back soon for updates.
      </p>
    );
  }

  return (
    <ol className={cn("space-y-0", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={`${item.at}-${item.label}`} className="relative flex gap-4">
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
              <p className="text-sm font-medium text-ink">{item.label}</p>
              <time
                dateTime={item.at}
                className="ref-mono mt-0.5 block text-xs text-caption"
              >
                {formatShortDate(item.at)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
