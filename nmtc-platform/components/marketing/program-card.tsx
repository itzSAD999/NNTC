import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Calendar, Clock, Stethoscope } from "lucide-react";

import type { ProgramWithDepartment } from "@/lib/types/expansion";

const PROGRAM_IMAGES: Record<string, string> = {
  "diploma-in-registered-general-nursing": "/images/clinical-theatre.jpg",
  "registered-midwifery-post-nurse": "/images/clinical-care.jpg",
};

export function ProgramCard({ program }: { program: ProgramWithDepartment }) {
  const photo = PROGRAM_IMAGES[program.slug] || "/images/lecture-hall.jpg";

  return (
    <article className="group flex flex-col overflow-hidden rounded-none border border-line bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
      {/* Photo Header with Department Badge */}
      <Link href={`/programs/${program.slug}`} className="relative aspect-[16/9] overflow-hidden bg-bg block rounded-none">
        <Image
          src={photo}
          alt={program.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {program.department ? (
          <span className="absolute top-3.5 left-3.5 rounded-none bg-primary/95 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
            {program.department.name}
          </span>
        ) : null}

        <span className="absolute bottom-3 right-3 rounded-none bg-black/60 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
          NMC Ghana Accredited
        </span>
      </Link>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-ink transition-colors group-hover:text-primary">
          <Link href={`/programs/${program.slug}`}>{program.name}</Link>
        </h2>

        {/* Programme Metric Badges */}
        <div className="mt-5 grid grid-cols-2 gap-3.5 rounded-none border border-line/60 bg-bg/50 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-primary/10 text-primary">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-caption">Duration</p>
              <p className="text-xs font-semibold text-ink">{program.duration || "3 Years"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-primary/10 text-primary">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-caption">Award</p>
              <p className="text-xs font-semibold text-ink">{program.qualification || "Diploma"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-primary/10 text-primary">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-caption">Intake</p>
              <p className="text-xs font-semibold text-ink">Annual (October)</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-primary/10 text-primary">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-caption">Practicum</p>
              <p className="text-xs font-semibold text-ink">St. Theresa&apos;s Hosp.</p>
            </div>
          </div>
        </div>

        {/* Action Link Footer */}
        <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between">
          <span className="text-xs font-medium text-caption">
            Ministry of Health / NMC Ghana
          </span>
          <Link
            href={`/programs/${program.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary group-hover:text-primary-deep"
          >
            <span>View Curriculum</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
