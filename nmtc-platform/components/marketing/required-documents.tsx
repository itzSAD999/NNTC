import type { DocumentRequired } from "@/lib/types/expansion";

const DETAILS_BY_LABEL: Record<string, string> = {
  "Completed application form":
    "Complete the current intake form — either the college application or the Ministry of Health Health Training Institutions portal, as advertised for the year. Incomplete forms delay processing. Keep your voucher PIN and serial if you applied through the MoH portal.",
  "WASSCE results slip (certified copy)":
    "Submit a certified copy of your WASSCE (or equivalent SSCE) results slip. Diploma programmes typically ask for credit passes (A1–C6) in English Language, Mathematics, Integrated Science, and three relevant electives (Biology or Chemistry for General Nursing; Biology for Midwifery). Confirm the current intake aggregate with the Admissions Office — published cut-offs change by year and programme.",
  "Birth certificate or national ID":
    "Bring your original birth certificate or a valid Ghana Card, plus a photocopy. Names must match your WASSCE records. If they differ, include a gazette notice or affidavit as used by Ghanaian training institutions.",
  "Passport photographs (4)":
    "Four recent colour passport photographs, usually on a white background, from the same sitting. Write your full name lightly on the reverse. Follow any extra instructions on the current admission notice.",
  "Medical fitness report":
    "A medical fitness report from a licensed medical officer, preferably a government or accredited facility, confirming you are fit for nursing or midwifery training. Use the checklist in your admission letter if specific tests are requested for this intake.",
};

function detailsFor(doc: DocumentRequired) {
  const custom = doc.details?.trim();
  if (custom) return custom;
  return DETAILS_BY_LABEL[doc.label] ?? "";
}

export function RequiredDocuments({ documents }: { documents: DocumentRequired[] }) {
  const items =
    documents.length > 0
      ? documents
      : Object.keys(DETAILS_BY_LABEL).map((label, i) => ({
          id: `fallback-${i}`,
          label,
          details: DETAILS_BY_LABEL[label],
          sort_order: i + 1,
          created_at: "",
          updated_at: "",
        }));

  return (
    <div className="space-y-2">
      {items.map((doc) => {
        const details = detailsFor(doc);
        return (
          <details
            key={doc.id}
            className="group border border-line bg-white open:border-ink/20"
          >
            <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-3">
                <span>{doc.label}</span>
                <span
                  className="shrink-0 text-caption transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </span>
            </summary>
            {details ? (
              <p className="border-t border-line px-4 py-3 text-sm font-light leading-relaxed text-caption">
                {details}
              </p>
            ) : null}
          </details>
        );
      })}
    </div>
  );
}
