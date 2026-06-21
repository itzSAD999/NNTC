import type { Metadata } from "next";

import { AdmissionsSections } from "@/components/marketing/admissions-sections";
import { PageHeader } from "@/components/layout/page-header";
import { getAdmissionsPageData } from "@/lib/data/admissions";
import { getSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `Admissions — ${settings.college_name}`,
    description: `How to apply to ${settings.college_name} — requirements, fees, documents, and FAQs.`,
  };
}

export default async function AdmissionsPage() {
  const [data, settings] = await Promise.all([
    getAdmissionsPageData(),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Apply"
        title="Admissions"
        description="Everything you need to apply — process steps, required documents, fees, and how to reach the Admissions Office."
      />
      <AdmissionsSections data={data} settings={settings} />
    </>
  );
}
