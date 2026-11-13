import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FacultyProfileView } from "@/components/marketing/faculty-profile";
import { getStaffBySlug } from "@/lib/data/staff";
import { getSettings } from "@/lib/data/settings";

interface StaffProfilePageProps {
 params: Promise<{ slug: string }>;
}

export async function generateMetadata({
 params,
}: StaffProfilePageProps): Promise<Metadata> {
 const { slug } = await params;
 const profile = await getStaffBySlug(slug);
 const settings = await getSettings();

 if (!profile) {
 return { title: `Profile not found — ${settings.college_name}` };
 }

 return {
 title: `${profile.full_name} — ${settings.college_name}`,
 description: `${profile.job_title} at ${settings.college_name}.`,
 };
}

export default async function StaffProfilePage({ params }: StaffProfilePageProps) {
 const { slug } = await params;
 const profile = await getStaffBySlug(slug);

 if (!profile) {
 notFound();
 }

 return <FacultyProfileView profile={profile} />;
}
