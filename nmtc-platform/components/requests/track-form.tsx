"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { trackByReference } from "@/lib/actions/requests";
import { STATUS_LABELS } from "@/lib/requests/status-labels";
import {
  trackFormSchema,
  type TrackFormValues,
} from "@/lib/validation/request";
import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { ReferenceDisplay } from "@/components/requests/reference-display";
import { RequestTimeline } from "@/components/requests/request-timeline";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RequestStatus } from "@/lib/constants";

interface TrackFormProps {
  supabaseReady: boolean;
}

export function TrackForm({ supabaseReady }: TrackFormProps) {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") ?? "";
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof trackByReference>
  > | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackFormValues>({
    resolver: zodResolver(trackFormSchema),
    defaultValues: { reference_no: initialRef },
  });

  useEffect(() => {
    if (initialRef && supabaseReady && turnstileToken) {
      startTransition(async () => {
        setResult(await trackByReference(initialRef, turnstileToken));
      });
    }
  }, [initialRef, supabaseReady, turnstileToken]);

  const onSubmit = (values: TrackFormValues) => {
    setResult(null);
    startTransition(async () => {
      setResult(await trackByReference(values.reference_no, turnstileToken));
    });
  };

  return (
    <div className="space-y-8">
      {!supabaseReady ? (
        <p
          role="status"
          className="rounded border border-warning/40 bg-warning/5 px-4 py-3 text-sm text-ink"
        >
          Tracking requires Supabase to be connected. Add your project keys to{" "}
          <code className="ref-mono text-xs">.env.local</code>.
        </p>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="reference_no">Reference number</Label>
          <Input
            id="reference_no"
            {...register("reference_no")}
            placeholder="NMTC-A1B2C3D4E5F6"
            className="ref-mono uppercase"
            aria-invalid={!!errors.reference_no}
          />
          {errors.reference_no ? (
            <p className="text-xs text-danger">{errors.reference_no.message}</p>
          ) : null}
        </div>
        <TurnstileWidget
          onToken={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
        />
        <Button type="submit" disabled={pending || !supabaseReady}>
          {pending ? "Looking up…" : "Track request"}
        </Button>
      </form>

      {result && !result.ok ? (
        <div
          role="alert"
          className="rounded border border-line bg-surface p-6"
        >
          <p className="font-serif text-display-sm text-ink">Not found</p>
          <p className="mt-2 text-sm text-caption">{result.error}</p>
        </div>
      ) : null}

      {result?.ok ? (
        <div className="rounded border border-line bg-surface p-6 md:p-8">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Request status
          </p>
          <ReferenceDisplay
            referenceNo={result.reference_no}
            size="lg"
            className="mt-3"
          />
          <p className="mt-2 text-sm text-caption">{result.document_type}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-caption">Current status:</span>
            <StatusPill
              status={result.status as RequestStatus}
              label={STATUS_LABELS[result.status as RequestStatus]}
            />
          </div>

          {result.status === "returned" ? (
            <div className="mt-6 rounded border border-warning/40 bg-warning/5 p-5">
              <p className="text-sm text-ink">
                Staff returned this request for corrections. Check your email for
                details, then resubmit with updated information.
              </p>
              <Button asChild className="mt-4">
                <Link
                  href={`/request/resubmit?ref=${encodeURIComponent(result.reference_no)}`}
                >
                  Resubmit corrections
                </Link>
              </Button>
            </div>
          ) : null}

          <div className="hairline mt-8 pt-8">
            <h2 className="font-serif text-display-sm">Progress</h2>
            <div className="mt-6">
              <RequestTimeline items={result.timeline} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
