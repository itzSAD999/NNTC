import {
  Banknote,
  Building,
  ExternalLink,
  GraduationCap,
  Smartphone,
} from "lucide-react";

import type { FinancialAidPageData } from "@/lib/data/fees";
import { PREVIEW_SCHOLARSHIPS } from "@/lib/data/preview-expansion";
import type { Settings } from "@/types/database";
import { FeeTable } from "@/components/marketing/fee-table";
import { Reveal } from "@/components/motion/reveal";

const HTI_PORTAL = "https://register.healthtraining.gov.gh";
const HTI_LABEL = "register.healthtraining.gov.gh";
const PLACEHOLDER_PHONE = /24\s*000\s*0001/;

function assistancePhone(settings: Settings) {
  const candidates = [
    settings.phone_admissions,
    settings.phone_main,
    settings.phone_finance,
  ];
  return (
    candidates.find(
      (value) => value && value.trim() && !PLACEHOLDER_PHONE.test(value)
    ) ?? null
  );
}

export function FinancialAidSections({
  data,
  settings,
}: {
  data: FinancialAidPageData;
  settings: Settings;
}) {
  const { fees, paymentMethods, scholarships } = data;
  const helpPhone = assistancePhone(settings);

  const base =
    scholarships && scholarships.length > 0
      ? scholarships
      : PREVIEW_SCHOLARSHIPS;
  const canonicalHub = PREVIEW_SCHOLARSHIPS.find((item) =>
    item.name.toLowerCase().includes("scholarship hub")
  );
  const canonicalSecretariat = PREVIEW_SCHOLARSHIPS.find((item) =>
    item.name.toLowerCase().includes("secretariat")
  );
  const aligned = base.map((item) => {
    const n = item.name.toLowerCase();
    if (canonicalHub && n.includes("hub") && !n.includes("secretariat")) {
      return {
        ...item,
        name: canonicalHub.name,
        eligibility: canonicalHub.eligibility,
        how_to_apply: canonicalHub.how_to_apply,
        external_url: canonicalHub.external_url,
      };
    }
    if (
      canonicalSecretariat &&
      n.includes("secretariat") &&
      !n.includes("hub")
    ) {
      return {
        ...item,
        name: canonicalSecretariat.name,
        eligibility: canonicalSecretariat.eligibility,
        how_to_apply: canonicalSecretariat.how_to_apply,
        external_url: canonicalSecretariat.external_url,
      };
    }
    return item;
  });
  const extras = [canonicalHub, canonicalSecretariat].filter(
    (item): item is NonNullable<typeof item> =>
      Boolean(item) &&
      !aligned.some((existing) => {
        const n = existing.name.toLowerCase();
        const source = item?.name ? item.name.toLowerCase() : "";
        return source.includes("hub")
          ? n.includes("hub")
          : n.includes("secretariat");
      })
  );
  const displayScholarships = extras.length ? [...extras, ...aligned] : aligned;

  return (
    <div className="section-grid space-y-16 py-16 md:space-y-20 md:py-20">
      <Reveal>
        <section aria-labelledby="fee-schedule-heading">
          <div className="mb-8 max-w-2xl border-b border-line pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Tuition &amp; Levies
            </p>
            <h2
              id="fee-schedule-heading"
              className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl"
            >
              Approved Fee Schedule
            </h2>
            <p className="mt-3 text-sm text-caption">
              Amounts in Ghana Cedis (GHS), with each levy listed under the fee.
            </p>
          </div>
          <FeeTable fees={fees} />
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="voucher-heading">
          <div className="border border-line bg-white p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Application voucher
            </p>
            <h2
              id="voucher-heading"
              className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink"
            >
              Official MoH / NMTC voucher
            </h2>
            <p className="mt-2 font-mono text-3xl font-bold text-ink">GHS 150</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-caption">
              Pay on the Health Training Institutions (HTI) Portal with Mobile
              Money or card. Keep your PIN and serial number secure.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={HTI_PORTAL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-deep"
              >
                Buy voucher / start application
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={HTI_PORTAL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary underline underline-offset-2"
              >
                {HTI_LABEL}
              </a>
            </div>
            {helpPhone ? (
              <p className="mt-5 text-sm text-caption">
                Need assistance?{" "}
                <a
                  href={`tel:${helpPhone.replace(/\s+/g, "")}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {helpPhone}
                </a>
              </p>
            ) : null}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="payment-methods-heading">
          <div className="mb-8 border-b border-line pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Billing &amp; Settlement
            </p>
            <h2
              id="payment-methods-heading"
              className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl"
            >
              Official Payment Methods
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex flex-col justify-between border border-line bg-surface p-6 sm:p-7"
                >
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center bg-primary/10 text-primary">
                      <Building className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-xl font-medium text-ink">
                      {method.method}
                    </h3>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-caption">
                      {method.details}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="border border-line bg-surface p-7">
                  <Building className="mb-5 h-6 w-6 text-primary" />
                  <h3 className="font-serif text-xl font-medium text-ink">
                    Bank Branch Deposit
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-caption">
                    Ghana Commercial Bank (GCB) or Agricultural Development Bank
                    (ADB). State student name and index/voucher number on the
                    deposit slip.
                  </p>
                </div>
                <div className="border border-line bg-surface p-7">
                  <Smartphone className="mb-5 h-6 w-6 text-primary" />
                  <h3 className="font-serif text-xl font-medium text-ink">
                    Mobile Money (MoMo)
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-caption">
                    Pay directly through the official MoH Health Training
                    Institutions merchant code or official NMTC Bursary MoMo
                    wallet.
                  </p>
                </div>
                <div className="border border-line bg-surface p-7">
                  <Banknote className="mb-5 h-6 w-6 text-primary" />
                  <h3 className="font-serif text-xl font-medium text-ink">
                    Campus Bursary Cashier
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-caption">
                    Visit the Accounts Office in the Administration Block during
                    working hours (Mon–Fri, 8:00 AM – 4:00 PM) for receipt
                    issuance.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="scholarships-heading">
          <div className="mb-8 border-b border-line pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Student Support &amp; Grants
            </p>
            <h2
              id="scholarships-heading"
              className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl"
            >
              Scholarships &amp; Financial Aid
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-caption">
              Ghana Scholarship Hub is a listing website for finding and applying
              to scholarships. The Ghana Scholarships Secretariat is a separate
              government body with its own application process.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {displayScholarships.map((s) => {
              const name = s.name.toLowerCase();
              const isHub =
                name.includes("scholarship hub") && !name.includes("secretariat");
              const isSecretariat =
                name.includes("secretariat") && !name.includes("hub");
              const badge = isHub
                ? "Scholarship website"
                : isSecretariat
                  ? "Government body"
                  : "Financial support";
              const buttonLabel = isHub
                ? "Open Ghana Scholarship Hub"
                : isSecretariat
                  ? "Open Secretariat portal"
                  : "Open portal";

              return (
                <article
                  key={s.id}
                  className="flex flex-col justify-between border border-line bg-white p-6 sm:p-8"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="border border-line bg-[#f7f7f7] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-caption">
                        {badge}
                      </span>
                      <GraduationCap className="h-5 w-5 text-caption" />
                    </div>

                    <h3 className="font-serif text-xl font-bold text-ink sm:text-2xl">
                      {s.name}
                    </h3>

                    {s.eligibility ? (
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-caption">
                          Eligibility
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-ink">
                          {s.eligibility}
                        </p>
                      </div>
                    ) : null}

                    {s.how_to_apply ? (
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-caption">
                          How to apply
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-caption">
                          {s.how_to_apply}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-6 space-y-3 border-t border-line pt-5">
                    {s.external_url ? (
                      <>
                        <a
                          href={s.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-deep"
                        >
                          {buttonLabel}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <p className="text-xs text-caption">
                          <a
                            href={s.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline underline-offset-2"
                          >
                            {s.external_url.replace(/^https?:\/\//, "")}
                          </a>
                        </p>
                      </>
                    ) : (
                      <span className="text-xs text-caption">
                        Ask the Finance Office
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
