import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { ProgramDetail } from "@/lib/types/expansion";

function HtmlSection({
  title,
  html,
}: {
  title: string;
  html: string;
}) {
  if (!html?.trim()) return null;
  return (
    <section>
      <h2 className="font-serif text-display-sm">{title}</h2>
      <div
        className="prose-nmtc mt-4 text-ink"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}

export function ProgramDetailView({ program }: { program: ProgramDetail }) {
  return (
    <div className="section-grid max-w-3xl py-12 md:py-16">
      <Link href="/programs" className="text-sm text-primary hover:text-primary-deep">
        ← All programmes
      </Link>

      <header className="mt-6 border-b border-line pb-8">
        {program.department ? (
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            {program.department.name}
          </p>
        ) : null}
        <h1 className="mt-2 font-serif text-display-lg md:text-display-xl">
          {program.name}
        </h1>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-caption">Duration</dt>
            <dd className="mt-1 font-medium">{program.duration}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-caption">Qualification</dt>
            <dd className="mt-1 font-medium">{program.qualification}</dd>
          </div>
        </dl>
      </header>

      <div className="mt-10 space-y-10">
        <HtmlSection title="About this programme" html={program.description} />
        <HtmlSection title="Entry requirements" html={program.entry_requirements} />

        {program.modules.length > 0 ? (
          <section>
            <h2 className="font-serif text-display-sm">Curriculum by year</h2>
            <div className="mt-4 space-y-4">
              {program.modules.map((year) => (
                <div
                  key={year.id}
                  className="rounded border border-line bg-surface p-5"
                >
                  <h3 className="font-medium text-ink">{year.year_label}</h3>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-caption">
                    {year.modules.map((mod) => (
                      <li key={mod}>{mod}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <HtmlSection title="Career prospects" html={program.career_prospects} />

        {program.cutoff_points ? (
          <section className="rounded border border-line bg-bg p-5">
            <h2 className="font-serif text-lg">Cut-off points</h2>
            <p className="mt-2 text-sm text-caption">{program.cutoff_points}</p>
          </section>
        ) : null}

        <div className="rounded border border-primary/20 bg-primary/5 p-6">
          <h2 className="font-serif text-display-sm">Ready to apply?</h2>
          <p className="mt-2 text-sm text-caption">
            View admission requirements, download the application form, and learn
            about fees and financial aid.
          </p>
          <Button asChild className="mt-4">
            <Link href="/admissions">Apply for admission</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
