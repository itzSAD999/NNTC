import type { Metadata } from "next";
import Link from "next/link";

import { ProgramCard } from "@/components/marketing/program-card";
import { PageHeader } from "@/components/layout/page-header";
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
        description="Explore our accredited nursing and midwifery programmes — duration, qualifications, and curriculum."
      />

      <div className="section-grid py-12 md:py-16">
        {programs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
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
      </div>
    </>
  );
}
