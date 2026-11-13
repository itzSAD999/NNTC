import type { Metadata } from "next";

import { PageHeader, PageSection } from "@/components/layout";
import { RequestWizard } from "@/components/requests/request-wizard";
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
        eyebrow="Student Registry &amp; Certification"
        title="Document Requests &amp; Records"
        description="Submit an official request, track live verification, or verify an issued credential."
      />
      <PageSection size="default" bordered={false}>
        <RequestWizard
          documentTypes={documentTypes}
          supabaseReady={isAdminConfigured()}
        />
      </PageSection>
    </>
  );
}
