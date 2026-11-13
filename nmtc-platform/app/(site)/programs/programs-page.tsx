import type { Metadata } from "next";
import Link from "next/link";

import { ProgramsDirectory } from "@/components/marketing/programs-directory";
import { PageHeader, PageSection } from "@/components/layout";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublishedPrograms } from "@/lib/data/programs";
import { getSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
 const settings = await getSettings();
 return {
 title: `Programmes — ${settings.college_name}`,
 description: `Nursing and midwifery programmes offered at ${settings.college_name}.`,
 };
}

export default async function ProgramsPage() {
 const programs = await getPublishedPrograms();

 return (
 <>
 <PageHeader
 eyebrow="Academics"
 title="Programmes"
 description="Accredited nursing and midwifery pathways."
 />

 <PageSection bordered={false} reveal={false}>
    {programs.length > 0 ? (
 <ProgramsDirectory programs={programs} />
 ) : (
 <EmptyState
 title="Programmes coming soon"
 message={
 <>
 Programme details are being updated.{" "}
 <Link href="/contact" className="text-primary hover:underline">
 Contact admissions
 </Link>{" "}
 for enquiries.
 </>
 }
 />
 )}
 </PageSection>
 </>
 );
}
