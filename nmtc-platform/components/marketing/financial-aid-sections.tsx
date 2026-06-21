import Link from "next/link";

import type { FinancialAidPageData } from "@/lib/data/fees";
import type { Settings } from "@/types/database";
import { FeeTable } from "@/components/marketing/fee-table";

function ProseSection({ title, body }: { title: string; body: string }) {
  if (!body?.trim()) return null;
  return (
    <section>
      <h2 className="font-serif text-display-sm">{title}</h2>
      <div className="prose-nmtc mt-4 whitespace-pre-wrap text-ink">{body}</div>
    </section>
  );
}

export function FinancialAidSections({
  data,
  settings,
}: {
  data: FinancialAidPageData;
  settings: Settings;
}) {
  const { fees, paymentMethods, scholarships, content } = data;

  return (
    <div className="section-grid space-y-12 py-12 md:space-y-16 md:py-16">
      <section>
        <h2 className="font-serif text-display-sm">Fee schedule</h2>
        <p className="mt-2 max-w-2xl text-sm text-caption">
          All amounts in Ghana Cedis (GHS). Programme-specific fees are shown where
          applicable; otherwise fees apply to all programmes.
        </p>
        <div className="mt-6">
          <FeeTable fees={fees} />
        </div>
      </section>

      <ProseSection title="Payment schedule" body={content.payment_schedule} />

      {paymentMethods.length > 0 ? (
        <section>
          <h2 className="font-serif text-display-sm">Payment methods</h2>
          <div className="mt-4 overflow-x-auto rounded border border-line bg-surface">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-ink bg-surface text-left text-xs uppercase tracking-widest text-caption">
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {paymentMethods.map((method) => (
                  <tr key={method.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{method.method}</td>
                    <td className="px-4 py-3 text-caption">{method.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {scholarships.length > 0 ? (
        <section>
          <h2 className="font-serif text-display-sm">Scholarships & bursaries</h2>
          <div className="mt-4 space-y-4">
            {scholarships.map((s) => (
              <article
                key={s.id}
                className="rounded border border-line bg-surface p-5"
              >
                <h3 className="font-medium text-ink">{s.name}</h3>
                {s.eligibility ? (
                  <p className="mt-2 text-sm text-caption">
                    <span className="font-medium text-ink">Eligibility: </span>
                    {s.eligibility}
                  </p>
                ) : null}
                {s.how_to_apply ? (
                  <p className="mt-2 text-sm text-caption">
                    <span className="font-medium text-ink">How to apply: </span>
                    {s.how_to_apply}
                  </p>
                ) : null}
                {s.external_url ? (
                  <a
                    href={s.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    Learn more
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <ProseSection title="Student Loan Trust Fund (SLTF)" body={content.sltf_info} />
      <ProseSection title="Hardship policy" body={content.hardship_policy} />

      <section className="rounded border border-line bg-bg p-6">
        <h2 className="font-serif text-display-sm">Finance office</h2>
        <p className="mt-3 text-sm text-caption">
          {settings.phone_finance ? (
            <>
              Phone:{" "}
              <a
                href={`tel:${settings.phone_finance}`}
                className="text-primary hover:underline"
              >
                {settings.phone_finance}
              </a>
              <br />
            </>
          ) : null}
          {settings.email_finance ? (
            <>
              Email:{" "}
              <a
                href={`mailto:${settings.email_finance}`}
                className="text-primary hover:underline"
              >
                {settings.email_finance}
              </a>
            </>
          ) : null}
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Contact us →
        </Link>
      </section>
    </div>
  );
}
