import Image from "next/image";
import Link from "next/link";

import type { StaffProfileWithDepartment } from "@/lib/types/expansion";
import { getStoragePublicUrl } from "@/lib/utils/format";

export function FacultyCard({ profile }: { profile: StaffProfileWithDepartment }) {
  const photo = getStoragePublicUrl(profile.photo_url);

  return (
    <article className="flex flex-col overflow-hidden rounded border border-line bg-surface transition-shadow hover:shadow-sm">
      <Link href={`/faculty/${profile.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-bg">
          {photo ? (
            <Image
              src={photo}
              alt={profile.full_name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl font-serif text-caption">
              {profile.full_name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {profile.department ? (
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            {profile.department.name}
          </p>
        ) : null}
        <h2 className="mt-2 font-serif text-lg text-ink">
          <Link href={`/faculty/${profile.slug}`} className="hover:text-primary">
            {profile.full_name}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-caption">{profile.job_title}</p>
        {profile.qualification ? (
          <p className="mt-2 text-xs text-caption">{profile.qualification}</p>
        ) : null}
      </div>
    </article>
  );
}
