import type { Metadata } from "next";

import { AboutSections } from "@/components/marketing/about-sections";
import { PageHeader } from "@/components/layout/page-header";
import { getAboutContent, getAccreditations } from "@/lib/data/about";
import { buildOrgTree, getOrgUnits } from "@/lib/data/org-units";
import { getSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
 const settings = await getSettings();
 return {
 title: `About — ${settings.college_name}`,
 description: `Learn about ${settings.college_name} — our history, vision, mission, and leadership.`,
 };
}

export default async function AboutPage() {
 const [about, accreditations, orgUnits, settings] = await Promise.all([
 getAboutContent(),
 getAccreditations(),
 getOrgUnits(),
 getSettings(),
 ]);

 const orgTree = buildOrgTree(orgUnits);

 return (
 <>
 <PageHeader
 eyebrow="About us"
 title={settings.college_name}
 description="History, values, and leadership."
 />
 <AboutSections about={about} accreditations={accreditations} orgTree={orgTree} />
 </>
 );
}
