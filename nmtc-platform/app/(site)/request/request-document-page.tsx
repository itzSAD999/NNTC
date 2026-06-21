import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
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
        description="Submit your transcript or attestation request online. Upload your payment receipt and receive a reference number to track progress."
      />
      <div className="section-grid max-w-3xl py-12 md:py-16">
        <RequestForm
          documentTypes={documentTypes}
          supabaseReady={isAdminConfigured()}
        />
        <p className="mt-8 text-sm text-caption">
          Already submitted?{" "}
          <Link href="/request/track" className="text-primary hover:underline">
            Track your request
          </Link>
        </p>
      </div>
    </>
  );
}
