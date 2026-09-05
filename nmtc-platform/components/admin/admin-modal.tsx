"use client";

import { useEffect, type ReactNode } from "react";

export function AdminModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className="relative z-10 w-full max-w-md rounded border border-line bg-surface p-6 shadow-lg"
      >
        <h2 id="admin-modal-title" className="font-serif text-display-sm">
          {title}
        </h2>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
