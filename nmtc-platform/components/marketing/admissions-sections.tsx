import Link from "next/link";
import { Download } from "lucide-react";

import type { AdmissionsPageData } from "@/lib/data/admissions";
import type { Settings } from "@/types/database";
import { getStoragePublicUrl } from "@/lib/utils/format";

function ProseBlock({ title, content }: { title: string; content: string }) {
  if (!content?.trim()) return null;
  return (
    <section>
      <h2 className="font-serif text-display-sm">{title}</h2>
      <div className="prose-nmtc mt-4 whitespace-pre-wrap text-ink">{content}</div>
    </section>
  );
}

export function AdmissionsSections({
  data,
  settings,
}: {
  data: AdmissionsPageData;
  settings: Settings;
}) {
  const { content, documents, faqs } = data;
  const formUrl = getStoragePublicUrl(content.application_form_url);

  return (
    <div className="section-grid max-w-3xl space-y-12 py-12 md:space-y-16 md:py-16">
      {content.process_steps.length > 0 ? (
        <section>
          <h2 className="font-serif text-display-sm">How to apply</h2>
          <ol className="mt-6 space-y-4">
            {content.process_steps.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded border border-line bg-surface p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-medium text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm text-caption">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <ProseBlock title="Selection criteria" content={content.selection_criteria} />
      <ProseBlock title="Academic calendar" content={content.academic_calendar} />

      <section className="rounded border border-line bg-surface p-6">
        <h2 className="font-serif text-display-sm">Application fee</h2>
        {content.application_fee != null ? (
          <p className="mt-3 ref-mono text-2xl font-medium text-ink">
            GHS {content.application_fee.toFixed(2)}
          </p>
        ) : (
          <p className="mt-3 text-sm text-caption">Contact Admissions for current fees.</p>
        )}
        {content.payment_instructions ? (
          <p className="mt-4 text-sm text-caption">{content.payment_instructions}</p>
        ) : null}
        {formUrl ? (
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download application form
          </a>
        ) : null}
      </section>

      {documents.length > 0 ? (
        <section>
          <h2 className="font-serif text-display-sm">Required documents</h2>
          <ul className="mt-4 divide-y divide-line rounded border border-line bg-surface">
            {documents.map((doc) => (
              <li key={doc.id} className="px-5 py-3 text-sm text-ink">
                {doc.label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section>
          <h2 className="font-serif text-display-sm">Frequently asked questions</h2>
          <dl className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="rounded border border-line bg-surface p-5">
                <dt className="font-medium text-ink">{faq.question}</dt>
                <dd className="mt-2 text-sm text-caption">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="rounded border border-line bg-bg p-6">
        <h2 className="font-serif text-display-sm">Admissions contact</h2>
        <p className="mt-3 text-sm text-caption">
          {settings.phone_admissions ? (
            <>
              Phone:{" "}
              <a
                href={`tel:${settings.phone_admissions}`}
                className="text-primary hover:underline"
              >
                {settings.phone_admissions}
              </a>
              <br />
            </>
          ) : null}
          {settings.email_admissions ? (
            <>
              Email:{" "}
              <a
                href={`mailto:${settings.email_admissions}`}
                className="text-primary hover:underline"
              >
                {settings.email_admissions}
              </a>
            </>
          ) : null}
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Send a message →
        </Link>
      </section>
    </div>
  );
}
