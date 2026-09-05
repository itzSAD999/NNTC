import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ResubmitForm } from "@/components/requests/resubmit-form";
import { PageHeader, PageSection } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { getActiveDocumentTypes } from "@/lib/data/document-types";
import { getReturnedRequestForResubmit } from "@/lib/data/request-resubmit";
import { isAdminConfigured } from "@/lib/requests/reference";

export const metadata: Metadata = {
  title: "Resubmit Request — NMTC",
  description:
    "Resubmit a returned document request with corrections at NMTC.",
};

async function ResubmitContent({ reference }: { reference: string }) {
  if (!isAdminConfigured()) {
    return (
      <p className="text-sm text-caption">
        Resubmission requires Supabase to be connected.
      </p>
    );
  }

  const [request, documentTypes] = await Promise.all([
    getReturnedRequestForResubmit(reference),
    getActiveDocumentTypes(),
  ]);

  if (!request) {
    return (
      <div className="institutional-card space-y-4 p-6">
        <p className="font-serif text-display-sm text-ink">
          Cannot resubmit this request
        </p>
        <p className="text-sm text-caption">
          The reference number may be incorrect, or this request is not in
          &quot;returned&quot; status. Check your confirmation email or track
          your request first.
        </p>
        <Button asChild variant="outline">
          <Link href="/request/track">Track your request</Link>
        </Button>
      </div>
    );
  }

  return <ResubmitForm request={request} documentTypes={documentTypes} />;
}

export default async function ResubmitRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const sp = await searchParams;
  const reference = sp.ref?.trim() ?? "";

  return (
    <>
      <PageHeader
        eyebrow="Document requests"
        title="Resubmit your request"
        description="Correct the issues noted in your email and send your request back into the review queue."
      />
      <PageSection size="narrow" bordered={false}>
        {!reference ? (
          <div className="institutional-card space-y-4 p-6">
            <p className="text-sm text-caption">
              Open this page from the track screen when your request status is
              &quot;returned&quot;, or add{" "}
              <code className="ref-mono text-xs">?ref=YOUR-REFERENCE</code> to the
              URL.
            </p>
            <Button asChild>
              <Link href="/request/track">Track your request</Link>
            </Button>
          </div>
        ) : (
          <Suspense fallback={<LoadingState label="Loading request…" />}>
            <ResubmitContent reference={reference} />
          </Suspense>
        )}
      </PageSection>
    </>
  );
}
