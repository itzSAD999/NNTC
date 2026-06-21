import type { Metadata } from "next";

import { CampusLifeSections } from "@/components/marketing/campus-life-sections";
import { PageHeader } from "@/components/layout/page-header";
import { getCampusSections } from "@/lib/data/campus";
import { getSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `Campus Life — ${settings.college_name}`,
    description: `Accommodation, dining, student life, and facilities at ${settings.college_name}.`,
  };
}

export default async function CampusLifePage() {
  const [sections, settings] = await Promise.all([
    getCampusSections(),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Student life"
        title="Campus life"
        description={`Life at ${settings.college_name} — accommodation, welfare, clubs, and more.`}
      />
      <CampusLifeSections sections={sections} />
    </>
  );
}
