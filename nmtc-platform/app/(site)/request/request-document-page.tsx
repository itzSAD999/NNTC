import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader, PageSection } from "@/components/layout";
import { DocumentJourney } from "@/components/requests/document-journey";
import { RequestForm } from "@/components/requests/request-form";
import { getActiveDocumentTypes } from "@/lib/data/document-types";
import { isAdminConfigured } from "@/lib/requests/reference";

export const metadata: Metadata = {
 title: "Request a Document — NMTC",
 description:
 "Submit an online request for an official transcript or attestation letter from NMTC.",
};

export default async function RequestDocumentPage() {
 const documentTypes = await getActiveDocumentTypes();

 return (
 <>
 <PageHeader
 eyebrow="Document requests"
 title="Request a document"
 description="Submit a transcript or letter request online."
 />
    <PageSection size="narrow" bordered={false}>
      <DocumentJourney />
      <p className="mt-3 text-sm text-caption">
        Already submitted?{" "}
        <Link href="/request/track" className="font-medium text-primary underline underline-offset-2">
          Track request
        </Link>
        {" · "}
        <Link href="/verify" className="font-medium text-primary underline underline-offset-2">
          Verify a document
        </Link>
      </p>
      <div className="mt-8">
        <RequestForm
          documentTypes={documentTypes}
          supabaseReady={isAdminConfigured()}
        />
      </div>
    </PageSection>
 </>
 );
}
