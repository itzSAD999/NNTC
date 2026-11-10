"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, QrCode, Search, ShieldCheck } from "lucide-react";

import { PageHeader, PageSection } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VerifySearchPage() {
  const [reference, setReference] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = reference.trim();
    if (!clean) return;
    router.push(`/verify/${encodeURIComponent(clean)}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="Institutional Registry"
        title="Official Document Verification"
        description="Verify the authenticity of academic transcripts, attestations, recommendation letters, and certificates issued by the college."
      />

      <PageSection size="narrow" bordered={false}>
        <div className="institutional-card space-y-6 p-6 md:p-8">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-ink">
                Verify Document by Reference
              </h2>
              <p className="text-xs text-caption">
                Enter the unique reference printed on the document or beneath the QR code.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reference_no">Document Reference Number</Label>
              <div className="relative">
                <Input
                  id="reference_no"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. NMTC-TR-2026-0042"
                  className="ref-mono pr-10 text-sm uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal"
                  autoComplete="off"
                  required
                />
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              </div>
              <p className="text-xs text-caption">
                Reference numbers usually begin with the institutional code (e.g. NMTC-TR-...)
              </p>
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              Verify Authenticity
            </Button>
          </form>

          <div className="rounded border border-line bg-surface-muted/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              For Embassies, Regulatory Councils & Employers
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-caption">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <span>Instant verification against the official institutional registrar database.</span>
              </li>
              <li className="flex items-start gap-2">
                <QrCode className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span>Scanning the physical QR code on any issued document brings you directly to its signed verification record.</span>
              </li>
            </ul>
          </div>
        </div>
      </PageSection>
    </>
  );
}

