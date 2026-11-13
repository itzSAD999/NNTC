import type { Metadata } from "next";

import { FacultyDirectory } from "@/components/marketing/faculty-directory";
import { PageHeader, PageSection } from "@/components/layout";
import { getDepartmentsForFilter, getPublishedStaff } from "@/lib/data/staff";
import { getSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
 const settings = await getSettings();
 return {
 title: `Staff & Lecturers — ${settings.college_name}`,
 description: `Meet the faculty and staff at ${settings.college_name}.`,
 };
}

export default async function FacultyPage() {
 const [staff, departments, settings] = await Promise.all([
 getPublishedStaff(),
 getDepartmentsForFilter(),
 getSettings(),
 ]);

 return (
 <>
 <PageHeader
 eyebrow="People"
 title="Staff & Lecturers"
 description="Tutors, lecturers, and college staff."
 />
 <PageSection bordered={false} reveal={false}>
 <FacultyDirectory staff={staff} departments={departments} />
 </PageSection>
 </>
 );
}
