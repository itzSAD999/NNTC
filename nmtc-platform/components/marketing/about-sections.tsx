import Image from "next/image";
import { Award, Compass, Eye, Heart, Shield, Sparkles } from "lucide-react";

import type { AboutContent } from "@/types/database";
import type { Accreditation } from "@/lib/data/about";
import type { OrgTreeNode } from "@/lib/data/org-units";
import { getStoragePublicUrl } from "@/lib/utils/format";
import { OrgChart } from "@/components/marketing/org-chart";

interface AboutSectionsProps {
  about: AboutContent;
  accreditations: Accreditation[];
  orgTree?: OrgTreeNode[];
}

export function AboutSections({ about, accreditations, orgTree = [] }: AboutSectionsProps) {
  const principalPhoto = getStoragePublicUrl(about.principal_photo_url) ?? "/images/healthcare-team.jpg";

  return (
    <div className="section-grid space-y-16 py-16 md:space-y-24 md:py-24">
      {/* SECTION 1: OUR HISTORY */}
      {about.history ? (
        <section aria-labelledby="history-heading" className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Our Heritage &amp; Foundation
          </p>
          <h2
            id="history-heading"
            className="mt-3 pb-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-ink border-b border-line"
          >
            History &amp; Purpose of NMTC
          </h2>
          <div
            className="prose-nmtc mt-6 text-base sm:text-lg leading-relaxed text-caption font-light"
            dangerouslySetInnerHTML={{ __html: about.history }}
          />
        </section>
      ) : null}

      {/* SECTION 2: VISION & MISSION CARDS */}
      <section
        aria-labelledby="vision-mission-heading"
        className="grid gap-8 md:grid-cols-2"
      >
        <div className="group rounded-none border border-line bg-surface p-8 sm:p-10 shadow-sm transition-all hover:shadow-md hover:border-primary/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1.5 w-full bg-primary" />
          <div className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary mb-6">
            <Eye className="h-6 w-6" />
          </div>
          <h2
            id="vision-mission-heading"
            className="font-serif text-2xl sm:text-3xl font-medium text-ink tracking-tight"
          >
            Our Vision
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-caption font-light">
            {about.vision || "To be a leading center of excellence in nursing and midwifery education, clinical research, and community healthcare leadership in Ghana and West Africa."}
          </p>
        </div>

        <div className="group rounded-none border border-line bg-surface p-8 sm:p-10 shadow-sm transition-all hover:shadow-md hover:border-accent/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1.5 w-full bg-accent" />
          <div className="flex h-12 w-12 items-center justify-center rounded-none bg-accent/10 text-accent mb-6">
            <Compass className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink tracking-tight">
            Our Mission
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-caption font-light">
            {about.mission || "To educate, inspire, and develop clinically competent, ethically disciplined, and compassionate healthcare professionals who serve communities with unflinching integrity."}
          </p>
        </div>
      </section>

      {/* SECTION 3: CORE VALUES TILES */}
      {about.core_values.length > 0 ? (
        <section aria-labelledby="values-heading">
          <div className="border-b border-line pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Institutional Pillars
            </p>
            <h2
              id="values-heading"
              className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
            >
              Our Core Values
            </h2>
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {about.core_values.map((value, idx) => (
              <li
                key={value}
                className="group rounded-none border border-line bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
                    0{idx + 1}
                  </span>
                  <Sparkles className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-medium text-ink">
                  {value}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-caption">
                  Embedded in our daily clinical ward rotations, classroom ethics, and institutional discipline.
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* SECTION 4: ACCREDITATIONS */}
      {accreditations.length > 0 ? (
        <section aria-labelledby="accreditations-heading">
          <div className="border-b border-line pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Statutory Oversight
            </p>
            <h2
              id="accreditations-heading"
              className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
            >
              Official Accreditations &amp; Affiliations
            </h2>
          </div>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {accreditations.map((acc) => {
              const logo = getStoragePublicUrl(acc.logo_url);
              return (
                <li
                  key={acc.id}
                  className="flex items-start gap-4 rounded-none border border-line bg-surface p-6 shadow-sm hover:border-primary/30 transition-colors"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-none border border-line bg-bg text-primary">
                    <Shield className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-medium text-ink leading-snug">
                      {acc.body_name}
                    </p>
                    <p className="mt-1 text-xs text-primary font-semibold">
                      Full Accreditation &amp; Recognition
                    </p>
                    {acc.accreditation_no ? (
                      <p className="ref-mono mt-1 text-xs text-caption">
                        Ref: {acc.accreditation_no}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* SECTION 5: ORGANIZATIONAL STRUCTURE */}
      {orgTree.length > 0 ? (
        <section aria-labelledby="org-heading" className="pt-6">
          <div className="border-b border-line pb-4 mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Governance &amp; Leadership
            </p>
            <h2
              id="org-heading"
              className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
            >
              Institutional Structure
            </h2>
          </div>
          <OrgChart tree={orgTree} />
        </section>
      ) : null}

      {/* SECTION 6: PRINCIPAL'S ADDRESS */}
      {(about.principal_message || about.principal_name) && (
        <section
          aria-labelledby="principal-heading"
          className="rounded-none border border-line bg-surface p-8 sm:p-12 shadow-sm overflow-hidden"
        >
          <div className="grid gap-10 md:grid-cols-[240px_1fr] md:items-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-none border border-line bg-bg shadow-sm">
              <Image
                src={principalPhoto}
                alt={about.principal_name ? `Photo of ${about.principal_name}` : "Principal"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 240px"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Executive Leadership
              </p>
              <h2
                id="principal-heading"
                className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
              >
                Message from the {about.principal_title ?? "Principal"}
              </h2>
              {about.principal_name ? (
                <p className="mt-2 text-base font-semibold text-primary">
                  {about.principal_name}
                </p>
              ) : null}
              {about.principal_message ? (
                <div
                  className="prose-nmtc mt-6 text-base leading-relaxed text-caption font-light"
                  dangerouslySetInnerHTML={{ __html: about.principal_message }}
                />
              ) : null}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
