import Image from "next/image";
import Link from "next/link";

import type { CampusSection } from "@/lib/types/expansion";
import { getStoragePublicUrl } from "@/lib/utils/format";

export function CampusLifeSections({ sections }: { sections: CampusSection[] }) {
  return (
    <div className="section-grid space-y-16 py-12 md:space-y-20 md:py-16">
      {sections.map((section) => {
        const image = getStoragePublicUrl(section.image_url);
        return (
          <section
            key={section.id}
            id={section.section_key}
            aria-labelledby={`campus-${section.section_key}`}
            className="grid gap-8 md:grid-cols-2 md:items-start"
          >
            <div>
              <h2
                id={`campus-${section.section_key}`}
                className="hairline-b pb-4 font-serif text-display-md"
              >
                {section.title}
              </h2>
              <div className="prose-nmtc mt-6 whitespace-pre-wrap text-caption">
                {section.body}
              </div>
            </div>
            {image ? (
              <Link
                href="/gallery"
                className="relative block aspect-[4/3] overflow-hidden rounded border border-line bg-bg"
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover transition-transform hover:scale-[1.02]"
                  sizes="50vw"
                />
                <span className="absolute bottom-3 right-3 rounded bg-surface/90 px-2 py-1 text-xs text-caption">
                  View gallery →
                </span>
              </Link>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
