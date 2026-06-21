import { Download } from "lucide-react";

import type { Resource } from "@/lib/types/expansion";
import { getStoragePublicUrl } from "@/lib/utils/format";

export function ResourcesSections({
  groups,
}: {
  groups: { category: string; items: Resource[] }[];
}) {
  return (
    <div className="section-grid space-y-12 py-12 md:space-y-16 md:py-16">
      {groups.map(({ category, items }) => (
        <section key={category} aria-labelledby={`res-${category}`}>
          <h2
            id={`res-${category}`}
            className="hairline-b pb-4 font-serif text-display-md"
          >
            {category}
          </h2>
          <ul className="mt-6 divide-y divide-line rounded border border-line bg-surface">
            {items.map((item) => {
              const fileUrl = getStoragePublicUrl(item.file_url);
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-ink">{item.title}</p>
                    {item.description ? (
                      <p className="mt-1 text-sm text-caption">{item.description}</p>
                    ) : null}
                  </div>
                  {fileUrl ? (
                    <a
                      href={fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-2 rounded border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      <Download className="h-4 w-4" aria-hidden />
                      Download
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
