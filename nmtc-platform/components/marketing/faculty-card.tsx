import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { StaffProfileWithDepartment } from "@/lib/types/expansion";
import { getStoragePublicUrl } from "@/lib/utils/format";

export function FacultyCard({ profile }: { profile: StaffProfileWithDepartment }) {
 const photo = getStoragePublicUrl(profile.photo_url);
 const initials = profile.full_name
 .split(" ")
 .map((w) => w[0])
 .join("")
 .slice(0, 2);

 return (
 <article className="group flex flex-col overflow-hidden rounded-none border border-line bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
 <Link href={`/faculty/${profile.slug}`} className="relative aspect-[4/5] overflow-hidden bg-bg">
 {photo ? (
 <Image
 src={photo}
 alt={profile.full_name}
 fill
 className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
 />
 ) : (
          <div className="flex h-full flex-col items-center justify-center bg-primary/10">
 <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white font-serif text-2xl font-bold text-primary shadow-md">
 {initials}
 </div>
 </div>
 )}
 {profile.department ? (
 <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary">
 {profile.department.name}
 </span>
 ) : null}
 </Link>

 <div className="flex flex-1 flex-col p-5">
 <h3 className="font-serif text-xl text-ink group-hover:text-primary">
 <Link href={`/faculty/${profile.slug}`}>{profile.full_name}</Link>
 </h3>
 <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">
 {profile.job_title}
 </p>
 <Link
 href={`/faculty/${profile.slug}`}
 className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary"
 >
 Profile
 <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
 </Link>
 </div>
 </article>
 );
}
