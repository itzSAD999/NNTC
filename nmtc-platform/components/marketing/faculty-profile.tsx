import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import type { StaffProfileWithDepartment } from "@/lib/types/expansion";
import { getStoragePublicUrl } from "@/lib/utils/format";

export function FacultyProfileView({
 profile,
}: {
 profile: StaffProfileWithDepartment;
}) {
 const photo = getStoragePublicUrl(profile.photo_url);

 return (
 <Reveal className="section-grid py-12 md:py-16">
 <div className="grid gap-10 md:grid-cols-[240px_1fr]">
 <div>
 {photo ? (
 <Image
 src={photo}
 alt={profile.full_name}
 width={240}
 height={300}
 className="rounded object-cover"
 />
 ) : (
 <div className="flex h-72 w-full items-center justify-center rounded border border-line bg-bg font-serif text-3xl text-caption">
 {profile.full_name
 .split(" ")
 .map((w) => w[0])
 .join("")
 .slice(0, 2)}
 </div>
 )}
 </div>
 <div>
 {profile.department ? (
 <p className="text-xs font-medium uppercase tracking-widest text-primary">
 {profile.department.name}
 </p>
 ) : null}
 <h1 className="mt-2 font-serif text-display-md">{profile.full_name}</h1>
 <p className="mt-2 text-lg text-caption">{profile.job_title}</p>
 {profile.qualification ? (
 <p className="mt-4 text-sm">
 <span className="font-medium text-ink">Specialisation: </span>
 <span className="text-caption">{profile.qualification}</span>
 </p>
 ) : null}
 {profile.work_email ? (
 <p className="mt-4">
 <a
 href={`mailto:${profile.work_email}`}
 className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-deep"
 >
 <Mail className="h-4 w-4" aria-hidden />
 {profile.work_email}
 </a>
 </p>
 ) : null}
 {profile.bio ? (
 <div
 className="prose-nmtc mt-8 max-w-3xl text-caption"
 dangerouslySetInnerHTML={{ __html: profile.bio }}
 />
 ) : null}
 <p className="mt-10">
 <Link href="/faculty" className="text-sm font-medium text-primary hover:underline">
 ← Back to directory
 </Link>
 </p>
 </div>
 </div>
 </Reveal>
 );
}
