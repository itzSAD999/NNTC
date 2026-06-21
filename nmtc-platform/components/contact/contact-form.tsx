"use client";

import { useFormState, useFormStatus } from "react-dom";

import { submitContactMessage } from "@/lib/actions/contact";
import { CONTACT_SUBJECTS } from "@/lib/validation/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending…" : "Send message"}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactMessage, {});

  if (state.success) {
    return (
      <div
        role="status"
        className="rounded border border-line bg-surface p-6"
      >
        <p className="font-serif text-display-sm text-primary">
          Message sent
        </p>
        <p className="mt-2 text-sm text-caption">
          Thank you for contacting NMTC. We will respond as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.error ? (
        <p role="alert" className="rounded border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name *</Label>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            aria-invalid={!!state.fieldErrors?.name}
            aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          />
          {state.fieldErrors?.name ? (
            <p id="name-error" className="text-xs text-danger">
              {state.fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={!!state.fieldErrors?.email}
          />
          {state.fieldErrors?.email ? (
            <p className="text-xs text-danger">{state.fieldErrors.email}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+233 XX XXX XXXX"
            aria-invalid={!!state.fieldErrors?.phone}
          />
          {state.fieldErrors?.phone ? (
            <p className="text-xs text-danger">{state.fieldErrors.phone}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <select
            id="subject"
            name="subject"
            required
            defaultValue=""
            className="flex h-10 w-full rounded border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-invalid={!!state.fieldErrors?.subject}
          >
            <option value="" disabled>
              Select a subject
            </option>
            {CONTACT_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {state.fieldErrors?.subject ? (
            <p className="text-xs text-danger">{state.fieldErrors.subject}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          aria-invalid={!!state.fieldErrors?.message}
        />
        {state.fieldErrors?.message ? (
          <p className="text-xs text-danger">{state.fieldErrors.message}</p>
        ) : null}
      </div>

      <SubmitButton />
    </form>
  );
}
