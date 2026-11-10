"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signInStaff, type AuthFormState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(signInStaff, {} as AuthFormState);

  return (
    <div className="rounded border border-line bg-surface p-6 md:p-8">
      <h1 className="font-serif text-display-md">Staff login</h1>
      <p className="mt-2 text-sm text-caption">
        Sign in with your NMTC staff credentials to access dashboards.
      </p>

      <form action={formAction} className="mt-8 space-y-5" noValidate>
        {state?.error ? (
          <p role="alert" className="rounded border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {state.error}
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
