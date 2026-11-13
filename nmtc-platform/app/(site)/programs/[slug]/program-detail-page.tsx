import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProgramDetailView } from "@/components/marketing/program-detail";
import { getProgramBySlug } from "@/lib/data/programs";
import { getSettings } from "@/lib/data/settings";

interface ProgramDetailPageProps {
 params: Promise<{ slug: string }>;
}

export async function generateMetadata({
 params,
}: ProgramDetailPageProps): Promise<Metadata> {
 const { slug } = await params;
 const program = await getProgramBySlug(slug);
 const settings = await getSettings();

 if (!program) {
 return { title: `Programme not found — ${settings.college_name}` };
 }

 return {
 title: `${program.name} — ${settings.college_name}`,
 description: `${program.qualification} in ${program.name}. Duration: ${program.duration}.`,
 };
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
 const { slug } = await params;
 const program = await getProgramBySlug(slug);

 if (!program) {
 notFound();
 }

 return <ProgramDetailView program={program} />;
}
