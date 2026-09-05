"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

function DeleteSubmit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="destructive"
      size="sm"
      disabled={pending}
    >
      {pending ? "Deleting…" : label}
    </Button>
  );
}

type DeleteConfirmFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage: string;
  buttonLabel: string;
  confirmButtonLabel?: string;
  hiddenFields: Record<string, string>;
  className?: string;
  children?: ReactNode;
};

export function DeleteConfirmForm({
  action,
  confirmMessage,
  buttonLabel,
  confirmButtonLabel = "Yes, delete",
  hiddenFields,
  className,
}: DeleteConfirmFormProps) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <DeleteSubmit label={buttonLabel} />
    </form>
  );
}

/** Two-step delete: click once to arm, click again to confirm. */
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
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Button type="submit" variant={variant} size="sm" className="text-danger">
        {buttonLabel}
      </Button>
    </form>
  );
}
