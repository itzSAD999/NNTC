import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title?: string;
  message: ReactNode;
  className?: string;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  message,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded border border-line bg-surface px-6 py-10 text-center sm:px-8",
        className
      )}
      role="status"
    >
      {icon ? (
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-caption">
          {icon}
        </div>
      ) : null}
      {title ? (
        <p className="font-serif text-display-sm text-ink">{title}</p>
      ) : null}
      <p
        className={cn(
          "text-sm text-caption",
          title ? "mt-2" : undefined
        )}
      >
        {message}
      </p>
    </div>
  );
}
