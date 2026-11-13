import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { DocumentJourney } from "@/components/requests/document-journey";
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
 description="Enter your reference number to see status."
 />
    <Reveal className="section-grid max-w-2xl space-y-8 py-12 md:py-16">
      <DocumentJourney />
      <Suspense fallback={<LoadingState label="Loading track form…" />}>
        <TrackForm supabaseReady={isAdminConfigured()} />
      </Suspense>
    </Reveal>
 </>
 );
}
