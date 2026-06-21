import Link from "next/link";

import type { ProgramWithDepartment } from "@/lib/types/expansion";

export function ProgramCard({ program }: { program: ProgramWithDepartment }) {
  return (
    <article className="flex flex-col rounded border border-line bg-surface transition-shadow hover:shadow-sm">
      <div className="border-b border-line px-5 py-4 md:px-6">
        {program.department ? (
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            {program.department.name}
          </p>
        ) : null}
        <h2 className="mt-2 font-serif text-xl text-ink md:text-2xl">
          <Link href={`/programs/${program.slug}`} className="hover:text-primary">
            {program.name}
          </Link>
        </h2>
      </div>
      <dl className="grid flex-1 gap-3 px-5 py-4 text-sm md:grid-cols-2 md:px-6 md:py-5">
        <div>
          <dt className="text-xs uppercase tracking-wider text-caption">Duration</dt>
          <dd className="mt-1 font-medium text-ink">{program.duration}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-caption">Qualification</dt>
          <dd className="mt-1 font-medium text-ink">{program.qualification}</dd>
        </div>
      </dl>
      <div className="mt-auto border-t border-line px-5 py-4 md:px-6">
        <Link
          href={`/programs/${program.slug}`}
          className="text-sm font-medium text-primary hover:text-primary-deep"
        >
          View programme details →
        </Link>
      </div>
    </article>
  );
}
