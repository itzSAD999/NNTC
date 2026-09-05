import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function AdminMobileCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded border border-line bg-surface p-4 md:hidden",
        className
      )}
    >
      {children}
    </article>
  );
}

export function AdminListResults({
  table,
  cards,
}: {
  table: ReactNode;
  cards: ReactNode;
}) {
  return (
    <>
      <div className="hidden md:block">{table}</div>
      <div className="space-y-3 md:hidden">{cards}</div>
    </>
  );
}
