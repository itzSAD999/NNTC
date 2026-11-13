"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck } from "lucide-react";

import { PageHeader, PageSection } from "@/components/layout";
import { DocumentJourney } from "@/components/requests/document-journey";
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
 eyebrow="Verify"
 title="Check a document"
 description="Enter the reference printed on the certificate or QR code."
 />

    <PageSection size="narrow" bordered={false}>
      <DocumentJourney />
      <div className="institutional-card mt-8 space-y-6 p-6 md:p-8">
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
 </div>

 <Button type="submit" className="w-full sm:w-auto">
 Verify
 </Button>
 </form>
 </div>
 </PageSection>
 </>
 );
}

