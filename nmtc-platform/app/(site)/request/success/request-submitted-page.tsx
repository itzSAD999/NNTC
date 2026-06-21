import type { Metadata } from "next";
import Link from "next/link";

import { ReferenceDisplay } from "@/components/requests/reference-display";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Request Submitted — NMTC",
  description: "Your document request has been submitted. Save your reference number.",
};

interface RequestSubmittedPageProps {
  searchParams: { ref?: string };
}

export default function RequestSubmittedPage({
  searchParams,
}: RequestSubmittedPageProps) {
  const referenceNo = searchParams.ref?.trim();

  return (
    <div className="section-grid max-w-2xl py-16 md:py-24">
      <p className="text-sm font-medium uppercase tracking-widest text-primary">
        Submission confirmed
      </p>
      <h1 className="mt-3 font-serif text-display-lg">Request submitted</h1>

      {referenceNo ? (
        <>
          <p className="mt-4 text-caption">
            Your request has been received. Save this reference number — you
            will need it to track your document.
          </p>

          <div className="mt-8 rounded border border-line bg-surface p-6 md:p-8">
            <p className="text-xs font-medium uppercase tracking-widest text-caption">
              Your reference number
            </p>
            <ReferenceDisplay
              referenceNo={referenceNo}
              size="lg"
              className="mt-3"
            />
          </div>

          <p className="mt-6 text-sm text-caption">
            A confirmation email has been sent if email delivery is configured.
            You can check status anytime on the track page.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link
                href={`/request/track?ref=${encodeURIComponent(referenceNo)}`}
              >
                Track this request
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-4 text-caption">
            If you were redirected here after submitting, your reference number
            should appear above. If not, check your confirmation email or contact
            the college.
          </p>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/request/track">Go to track page</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
