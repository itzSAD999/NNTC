"use client";

export function UnsavedChangesLabel({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="text-sm text-warning" role="status">
      Unsaved changes
    </span>
  );
}

/** Spread onto a form together with local setDirty state. */
export function createUnsavedFormProps(setDirty: (dirty: boolean) => void) {
  return {
    onInput: () => setDirty(true),
    onChange: () => setDirty(true),
  };
}
