"use client";

import { useTransition } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type DeleteConfirmFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage: string;
  buttonLabel: string;
  confirmButtonLabel?: string;
  hiddenFields: Record<string, string>;
  className?: string;
  children?: ReactNode;
};

function buildFormData(hiddenFields: Record<string, string>) {
  const formData = new FormData();
  Object.entries(hiddenFields).forEach(([name, value]) => {
    formData.append(name, value);
  });
  return formData;
}

/** Standalone delete control — never renders a nested <form>. */
export function DeleteConfirmForm({
  action,
  confirmMessage,
  buttonLabel,
  hiddenFields,
  className,
}: DeleteConfirmFormProps) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      className={className}
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          await action(buildFormData(hiddenFields));
        });
      }}
    >
      {pending ? "Deleting…" : buttonLabel}
    </Button>
  );
}

/** Same as DeleteConfirmForm; safe to place inside another form. */
export function DeleteConfirmButton({
  action,
  confirmMessage,
  buttonLabel,
  hiddenFields,
  className,
  variant = "outline",
}: DeleteConfirmFormProps & {
  variant?: "outline" | "destructive" | "ghost";
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      className={className ?? "text-danger"}
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          await action(buildFormData(hiddenFields));
        });
      }}
    >
      {pending ? "Deleting…" : buttonLabel}
    </Button>
  );
}
