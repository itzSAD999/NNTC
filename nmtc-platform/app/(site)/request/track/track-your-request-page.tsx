import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/layout/page-header";
import { TrackForm } from "@/components/requests/track-form";
import { isAdminConfigured } from "@/lib/requests/reference";

export const metadata: Metadata = {
  title: "Track Your Request — NMTC",
  description:
    "Track the status of your NMTC transcript or attestation request using your reference number.",
};

export default function TrackYourRequestPage() {
  return (
    <>
      <PageHeader
        eyebrow="Document requests"
        title="Track your request"
        description="Enter the reference number from your confirmation email to see the current status of your document request."
      />
      <div className="section-grid max-w-2xl py-12 md:py-16">
        <Suspense fallback={<LoadingState label="Loading track form…" />}>
          <TrackForm supabaseReady={isAdminConfigured()} />
        </Suspense>
      </div>
    </>
  );
}
