import Link from "next/link";
import {
 AlertTriangle,
 Award,
 CheckCircle2,
 Clock,
 ExternalLink,
 ShieldAlert,
 ShieldCheck,
} from "lucide-react";

import { PageHeader, PageSection } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { verifyDocumentByReference } from "@/lib/data/document-verification";
import { formatDate } from "@/lib/utils/format";

export default async function VerifyResultPage({
 reference,
}: {
 reference: string;
}) {
 const result = await verifyDocumentByReference(reference);

 return (
 <>
 <PageHeader
 eyebrow="Verify"
 title="Result"
 description={reference.toUpperCase()}
 />

 <PageSection size="narrow" bordered={false}>
 {result.found && result.isVerified ? (
 <div className="institutional-card space-y-6 border-2 border-success/40 bg-surface p-6 sm:p-8">
 <div className="flex flex-col items-center justify-center text-center">
 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
 <ShieldCheck className="h-9 w-9" />
 </div>
 <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-success">
 <CheckCircle2 className="h-3.5 w-3.5" />
 Officially Verified & Issued
 </span>
 <h2 className="mt-4 font-serif text-2xl font-bold text-ink">
 Authentic Institutional Document
 </h2>
 <p className="mt-1 text-sm text-caption">
 Issued by {result.collegeName}
 </p>
 </div>

 <div className="rounded-lg border border-line bg-surface-muted/30 p-5">
 <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
 <div>
 <dt className="text-xs font-medium text-caption">Reference Number</dt>
 <dd className="ref-mono mt-1 text-sm font-bold tracking-wide text-ink">
 {result.referenceNo}
 </dd>
 </div>

 <div>
 <dt className="text-xs font-medium text-caption">Document Type</dt>
 <dd className="mt-1 text-sm font-semibold text-ink">
 {result.documentType}
 </dd>
 </div>

 <div>
 <dt className="text-xs font-medium text-caption">Student / Graduate Name</dt>
 <dd className="mt-1 text-sm font-semibold text-ink">
 {result.studentName}
 </dd>
 </div>

 <div>
 <dt className="text-xs font-medium text-caption">Date Issued</dt>
 <dd className="mt-1 text-sm font-semibold text-ink">
 {result.issuedAt ? formatDate(result.issuedAt) : "On Record"}
 </dd>
 </div>
 </dl>
 </div>

 <div className="rounded border border-line/80 bg-surface-muted/20 p-4 text-xs text-caption">
 <div className="flex items-start gap-2.5">
 <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
 <p>
 <strong>Security Declaration:</strong> This digital verification record confirms
 that the official document bearing reference{" "}
 <code className="ref-mono font-bold text-ink">{result.referenceNo}</code> was
 duly processed, vetted by the Academic & Accounts Offices, and approved by the
 Principal of {result.collegeName}.
 </p>
 </div>
 </div>

 <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
 <Button asChild variant="outline" size="sm">
 <Link href="/verify">Verify another document</Link>
 </Button>
 <Button asChild variant="ghost" size="sm">
 <Link href="/contact" className="gap-1.5">
 Report discrepancy <ExternalLink className="h-3.5 w-3.5" />
 </Link>
 </Button>
 </div>
 </div>
 ) : result.found && result.isPending ? (
 <div className="institutional-card space-y-6 border-2 border-warning/40 bg-surface p-6 sm:p-8">
 <div className="flex flex-col items-center justify-center text-center">
 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/15 text-warning">
 <Clock className="h-9 w-9" />
 </div>
 <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-warning">
 In Review / Not Yet Issued
 </span>
 <h2 className="mt-4 font-serif text-2xl font-bold text-ink">
 Document In Processing
 </h2>
 <p className="mt-1 max-w-md text-sm text-caption">
 A request matching reference{" "}
 <code className="ref-mono font-bold text-ink">{result.referenceNo}</code> exists in
 the registry, but it is currently in processing and has not been formally released.
 </p>
 </div>

 <div className="flex justify-center gap-3 border-t border-line pt-4">
 <Button asChild variant="outline">
 <Link href="/verify">Check another reference</Link>
 </Button>
 <Button asChild>
 <Link href={`/request/track?ref=${encodeURIComponent(result.referenceNo)}`}>
 Track request progress
 </Link>
 </Button>
 </div>
 </div>
 ) : (
 <div className="institutional-card space-y-6 border-2 border-danger/40 bg-surface p-6 sm:p-8">
 <div className="flex flex-col items-center justify-center text-center">
 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/15 text-danger">
 <ShieldAlert className="h-9 w-9" />
 </div>
 <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-danger">
 Unverified Reference
 </span>
 <h2 className="mt-4 font-serif text-2xl font-bold text-ink">
 Record Not Found
 </h2>
 <p className="mt-2 max-w-md text-sm text-caption">
 No official document matching reference{" "}
 <code className="ref-mono font-bold text-ink">{reference}</code> was found in the
 institutional archives.
 </p>
 </div>

 <div className="rounded border border-danger/20 bg-danger/5 p-4 text-xs text-danger/90">
 <div className="flex items-start gap-2.5">
 <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
 <p>
 <strong>Notice to Verifiers:</strong> If you are reviewing a physical document
 carrying this reference, it may have an invalid code or may not have originated
 from the college registrar. Please contact the administration directly.
 </p>
 </div>
 </div>

 <div className="flex justify-center gap-3 border-t border-line pt-4">
 <Button asChild variant="outline">
 <Link href="/verify">Try another reference</Link>
 </Button>
 <Button asChild>
 <Link href="/contact">Contact Academic Registry</Link>
 </Button>
 </div>
 </div>
 )}
 </PageSection>
 </>
 );
}

