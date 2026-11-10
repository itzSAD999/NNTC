import type { Metadata } from "next";
import VerifyResultPage from "./verify-result-page";

interface VerifyPageProps {
  params: Promise<{ ref: string }>;
}

export async function generateMetadata({
  params,
}: VerifyPageProps): Promise<Metadata> {
  const { ref } = await params;
  return {
    title: `Verify ${ref.toUpperCase()} — NMTC`,
    description: `Official verification record for document reference ${ref.toUpperCase()}`,
    robots: { index: false, follow: false },
  };
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { ref } = await params;
  return <VerifyResultPage reference={ref} />;
}

