import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Building2, Mail, User } from "lucide-react";

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
    <article className="group flex flex-col overflow-hidden rounded-none border border-line bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <Link href={`/faculty/${profile.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-bg">
        {photo ? (
          <Image
            src={photo}
            alt={profile.full_name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-bg to-primary/20 p-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-none border-2 border-primary/30 bg-surface text-2xl font-serif font-bold text-primary shadow-sm">
              {initials}
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-caption">
              Faculty Profile
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {profile.department ? (
          <span className="absolute bottom-3 left-3 rounded-none bg-surface/95 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-sm border border-line/50">
            {profile.department.name}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl font-medium tracking-tight text-ink transition-colors group-hover:text-primary">
          <Link href={`/faculty/${profile.slug}`}>{profile.full_name}</Link>
        </h3>
        
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {profile.job_title}
        </p>

        {profile.qualification ? (
          <div className="mt-3 flex items-start gap-1.5 text-xs text-caption">
            <Award className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <span className="line-clamp-2">{profile.qualification}</span>
          </div>
        ) : null}

        <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between">
          <span className="text-xs text-caption">Nandom NMTC</span>
          <Link
            href={`/faculty/${profile.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary group-hover:text-primary-deep"
          >
            <span>View Profile</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
