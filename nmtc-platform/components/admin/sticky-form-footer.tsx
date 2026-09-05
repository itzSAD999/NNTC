"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function StickyFormFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 -mx-4 mt-8 border-t border-line bg-bg/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
