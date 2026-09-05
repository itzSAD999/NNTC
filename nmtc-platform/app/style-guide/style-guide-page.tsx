import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";

export const metadata: Metadata = {
  title: "Style Guide — NMTC",
  robots: { index: false, follow: false },
};

const COLOR_TOKENS = [
  { name: "Background", var: "--color-bg", hex: "#FBFBF9" },
  { name: "Surface", var: "--color-surface", hex: "#FFFFFF" },
  { name: "Ink", var: "--color-ink", hex: "#14241B" },
  { name: "Primary", var: "--color-primary", hex: "#1A5E3A" },
  { name: "Primary Deep", var: "--color-primary-deep", hex: "#0E3D26" },
  { name: "Accent", var: "--color-accent", hex: "#9A1B2F" },
  { name: "Muted", var: "--color-muted", hex: "#6B7A72" },
  { name: "Line", var: "--color-line", hex: "#E2E6E3" },
  { name: "Success", var: "--color-success", hex: "#1A7A4A" },
  { name: "Warning", var: "--color-warning", hex: "#B8860B" },
  { name: "Danger", var: "--color-danger", hex: "#9A1B2F" },
] as const;

const TYPE_SCALE = [
  { label: "Display XL · 3.0rem", className: "text-display-xl font-serif" },
  { label: "Display LG · 2.25rem", className: "text-display-lg font-serif" },
  { label: "Display MD · 1.75rem", className: "text-display-md font-serif" },
  { label: "Display SM · 1.375rem", className: "text-display-sm font-serif" },
  { label: "Large · 1.125rem", className: "text-lg" },
  { label: "Base · 1.0rem", className: "text-base" },
  { label: "Small · 0.875rem", className: "text-sm text-muted-foreground" },
  { label: "XS · 0.75rem", className: "text-xs text-muted-foreground" },
] as const;

const REQUEST_STATUSES = [
  { status: "submitted" as const, label: "Submitted" },
  { status: "returned" as const, label: "Returned" },
  { status: "academic_approved" as const, label: "Academic Approved" },
  { status: "payment_confirmed" as const, label: "Payment Confirmed" },
  { status: "approved" as const, label: "Approved" },
  { status: "collected" as const, label: "Collected" },
] as const;

function StyleSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-12">
      <div className="hairline-b pb-6">
        <h2 className="font-serif text-display-md">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="section-grid py-12 md:py-16">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            NMTC Design System
          </p>
          <h1 className="mt-3 font-serif text-display-lg md:text-display-xl">
            Style Guide
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Harvard/MIT institutional rigour with clinical nursing warmth —
            tokens, typography, and UI primitives for the NMTC platform.
          </p>
        </div>
      </header>

      <div className="section-grid pb-16">
        <StyleSection
          title="Colour tokens"
          description="Exact hex values from the global design prompt. Hairline rules use Line; accent crimson is used sparingly."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLOR_TOKENS.map(({ name, var: cssVar, hex }) => (
              <div
                key={cssVar}
                className="overflow-hidden rounded border border-line bg-surface"
              >
                <div
                  className="h-20 border-b border-line"
                  style={{ backgroundColor: `var(${cssVar})` }}
                />
                <div className="p-4">
                  <p className="font-medium text-ink">{name}</p>
                  <p className="ref-mono mt-1 text-muted-foreground">{hex}</p>
                  <p className="ref-mono mt-0.5 text-xs text-muted-foreground">
                    {cssVar}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </StyleSection>

        <StyleSection
          title="Type scale"
          description="Source Serif 4 for display headings; Inter for body; IBM Plex Mono for reference numbers and data."
        >
          <div className="space-y-6 rounded border border-line bg-surface p-6 md:p-8">
            {TYPE_SCALE.map(({ label, className }) => (
              <div key={label} className="hairline-b pb-6 last:border-0 last:pb-0">
                <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
                <p className={className}>
                  Nandom Nursing and Midwifery Training College
                </p>
              </div>
            ))}
            <div className="hairline pt-6">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                Mono · reference numbers
              </p>
              <p className="ref-mono text-ink">NMTC-A1B2C3D4E5F6</p>
              <p className="ref-mono mt-1 text-sm text-muted-foreground">
                21 Jun 2026 · 14:32 GMT
              </p>
            </div>
          </div>
        </StyleSection>

        <StyleSection
          title="Buttons"
          description="4px radius, restrained palette. Primary green for main actions; accent crimson for destructive emphasis only."
        >
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </StyleSection>

        <StyleSection
          title="Status pills"
          description="Dot + label pattern, colour-coded to the document request state machine."
        >
          <div className="flex flex-wrap gap-3">
            {REQUEST_STATUSES.map(({ status, label }) => (
              <StatusPill key={status} status={status} label={label} />
            ))}
          </div>
        </StyleSection>

        <StyleSection
          title="Sample card"
          description="Institutional card with hairline border, serif title, and disciplined spacing."
        >
          <div className="max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>Official Transcript Request</CardTitle>
                <CardDescription>
                  Submit your request online and track progress with a unique
                  reference number.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="ref-mono">NMTC-A1B2C3D4E5F6</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <StatusPill status="submitted" label="Submitted" />
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="sm">Track Request</Button>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          </div>
        </StyleSection>
      </div>
    </div>
  );
}
