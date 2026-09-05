import Image from "next/image";

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
  const principalPhoto = getStoragePublicUrl(about.principal_photo_url);

  return (
    <div className="section-grid space-y-16 py-16 md:space-y-20 md:py-20">
      {about.history ? (
        <section aria-labelledby="history-heading">
          <h2
            id="history-heading"
            className="hairline-b pb-4 font-serif text-display-md"
          >
            Our history
          </h2>
          <div
            className="prose-nmtc mt-6 max-w-3xl text-base leading-relaxed text-caption"
            dangerouslySetInnerHTML={{ __html: about.history }}
          />
        </section>
      ) : null}

      <section
        aria-labelledby="vision-mission-heading"
        className="grid gap-10 md:grid-cols-2"
      >
        <div className="institutional-card p-6 md:p-8">
          <h2
            id="vision-mission-heading"
            className="font-serif text-display-sm text-primary"
          >
            Vision
          </h2>
          <p className="mt-4 text-caption">{about.vision}</p>
        </div>
        <div className="institutional-card p-6 md:p-8">
          <h2 className="font-serif text-display-sm text-primary">Mission</h2>
          <p className="mt-4 text-caption">{about.mission}</p>
        </div>
      </section>

      {about.core_values.length > 0 ? (
        <section aria-labelledby="values-heading">
          <h2
            id="values-heading"
            className="hairline-b pb-4 font-serif text-display-md"
          >
            Core values
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.core_values.map((value) => (
              <li
                key={value}
                className="border-l-2 border-primary px-4 py-2 text-sm font-medium text-ink"
              >
                {value}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {accreditations.length > 0 ? (
        <section aria-labelledby="accreditations-heading">
          <h2
            id="accreditations-heading"
            className="hairline-b pb-4 font-serif text-display-md"
          >
            Accreditations
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {accreditations.map((acc) => {
              const logo = getStoragePublicUrl(acc.logo_url);
              return (
                <li
                  key={acc.id}
                  className="flex items-start gap-4 rounded border border-line bg-surface p-5"
                >
                  {logo ? (
                    <Image
                      src={logo}
                      alt=""
                      width={48}
                      height={48}
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-line bg-bg text-xs font-semibold text-primary"
                      aria-hidden
                    >
                      {acc.body_name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-ink">{acc.body_name}</p>
                    {acc.accreditation_no ? (
                      <p className="ref-mono mt-1 text-xs text-caption">
                        {acc.accreditation_no}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {orgTree.length > 0 ? <OrgChart tree={orgTree} /> : null}

      {(about.principal_message || about.principal_name) && (
        <section
          aria-labelledby="principal-heading"
          className="grid gap-8 border border-line bg-surface p-6 md:grid-cols-[auto_1fr] md:p-10"
        >
          {principalPhoto ? (
            <Image
              src={principalPhoto}
              alt={
                about.principal_name
                  ? `Photo of ${about.principal_name}`
                  : "Principal"
              }
              width={160}
              height={200}
              className="h-48 w-40 rounded object-cover"
            />
          ) : (
            <div
              className="flex h-48 w-40 items-center justify-center rounded border border-line bg-bg text-caption"
              aria-hidden
            >
              Principal
            </div>
          )}
          <div>
            <h2
              id="principal-heading"
              className="font-serif text-display-md"
            >
              Message from the {about.principal_title ?? "Principal"}
            </h2>
            {about.principal_name ? (
              <p className="mt-2 text-sm font-medium text-primary">
                {about.principal_name}
              </p>
            ) : null}
            {about.principal_message ? (
              <div
                className="prose-nmtc mt-6 text-caption"
                dangerouslySetInnerHTML={{ __html: about.principal_message }}
              />
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}
