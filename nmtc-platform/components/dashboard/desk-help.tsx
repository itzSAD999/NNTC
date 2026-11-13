"use client";

import { useEffect, useRef, useState } from "react";
import { Info, X } from "lucide-react";

export function DeskHelp({
  title = "How this desk works",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointer(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onPointer);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center border border-line bg-white text-caption hover:border-primary hover:text-primary"
        aria-expanded={open}
        aria-label={title}
        title={title}
      >
        <Info className="h-4 w-4" />
      </button>
      {open ? (
        <div
          role="dialog"
          className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] border border-line bg-white p-4 shadow-lg"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-caption">
              {title}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-caption hover:text-ink"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 text-sm leading-relaxed text-ink">{children}</div>
        </div>
      ) : null}
    </div>
  );
}
