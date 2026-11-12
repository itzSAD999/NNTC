import Link from "next/link";
import {
  Banknote,
  Building,
  CreditCard,
  DollarSign,
  GraduationCap,
  HelpCircle,
  Phone,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Award,
} from "lucide-react";

import type { FinancialAidPageData } from "@/lib/data/fees";
import { PREVIEW_SCHOLARSHIPS } from "@/lib/data/preview-expansion";
import type { Settings } from "@/types/database";
import { FeeTable } from "@/components/marketing/fee-table";

const PAYMENT_METHOD_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  bank: Building,
  mobile: Smartphone,
  cash: Banknote,
};

export function FinancialAidSections({
  data,
  settings,
}: {
  data: FinancialAidPageData;
  settings: Settings;
}) {
  const { fees, paymentMethods, scholarships, content } = data;

  return (
    <div className="section-grid space-y-16 py-16 md:space-y-24 md:py-24">
      {/* SECTION 1: OFFICIAL FEE SCHEDULE */}
      <section aria-labelledby="fee-schedule-heading">
        <div className="border-b border-line pb-4 mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Tuition &amp; Levies
          </p>
          <h2
            id="fee-schedule-heading"
            className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
          >
            Approved Fee Schedule
          </h2>
          <p className="mt-3 text-base text-caption font-light">
            All amounts are approved by the Ministry of Health (MoH) and Nursing &amp; Midwifery Council (NMC) Ghana. Stated in Ghana Cedis (GHS).
          </p>
        </div>

        <div className="mt-6">
          <FeeTable fees={fees} />
        </div>
      </section>

      {/* SECTION 2: PAYMENT METHODS CARDS */}
      <section aria-labelledby="payment-methods-heading">
        <div className="border-b border-line pb-4 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Billing &amp; Settlement
          </p>
          <h2
            id="payment-methods-heading"
            className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
          >
            Official Payment Methods
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <div
                key={method.id}
                className="group flex flex-col justify-between rounded-none border border-line bg-surface p-6 sm:p-7 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary mb-5">
                    <Building className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-ink">
                    {method.method}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-caption font-light whitespace-pre-wrap">
                    {method.details}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line/60 text-xs font-semibold text-primary">
                  Official NMTC Account
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="rounded-none border border-line bg-surface p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-none bg-emerald-50 text-emerald-800 border border-emerald-200 mb-5">
                  <Building className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-ink">Bank Branch Deposit</h3>
                <p className="mt-3 text-sm leading-relaxed text-caption font-light">
                  Ghana Commercial Bank (GCB) or Agricultural Development Bank (ADB). State student name and index/voucher number on the deposit slip.
                </p>
              </div>

              <div className="rounded-none border border-line bg-surface p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-none bg-amber-50 text-amber-800 border border-amber-200 mb-5">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-ink">Mobile Money (MoMo)</h3>
                <p className="mt-3 text-sm leading-relaxed text-caption font-light">
                  Pay directly through the official MoH Health Training Institutions Merchant Code or official NMTC Bursary MoMo wallet.
                </p>
              </div>

              <div className="rounded-none border border-line bg-surface p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-none bg-blue-50 text-blue-800 border border-blue-200 mb-5">
                  <Banknote className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-ink">Campus Bursary Cashier</h3>
                <p className="mt-3 text-sm leading-relaxed text-caption font-light">
                  Visit the Accounts Office in the Administration Block during working hours (Mon–Fri, 8:00 AM – 4:00 PM) for receipt issuance.
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* SECTION 3: SCHOLARSHIPS & FINANCIAL AID */}
      {(() => {
        const displayScholarships =
          scholarships && scholarships.length > 0
            ? scholarships
            : PREVIEW_SCHOLARSHIPS;

        return (
          <section aria-labelledby="scholarships-heading">
            <div className="border-b border-line pb-4 mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Student Support &amp; Grants
              </p>
              <h2
                id="scholarships-heading"
                className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
              >
                Scholarships &amp; Financial Aid
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-caption font-light max-w-2xl">
                Government scholarships, statutory trainee allowances, and tertiary student loans available to students enrolled at Nandom NMTC.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {displayScholarships.map((s) => {
                const isHub =
                  s.name.toLowerCase().includes("scholarship hub") ||
                  s.name.toLowerCase().includes("secretariat");

                return (
                  <article
                    key={s.id}
                    className={`group flex flex-col justify-between rounded-none border p-6 sm:p-8 shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${
                      isHub
                        ? "border-primary/60 bg-primary/[0.02] hover:border-primary hover:shadow-md"
                        : "border-line bg-surface hover:border-primary/40 hover:shadow-md"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`rounded-none px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider border ${
                            isHub
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-bg text-caption border-line"
                          }`}
                        >
                          {isHub ? "Official Government Hub" : "Financial Support"}
                        </span>
                        {isHub ? (
                          <Award className="h-5 w-5 text-primary" />
                        ) : (
                          <GraduationCap className="h-5 w-5 text-caption" />
                        )}
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink transition-colors group-hover:text-primary">
                        {s.name}
                      </h3>

                      {s.eligibility ? (
                        <div className="mt-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-caption">
                            Eligibility
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-ink font-medium">
                            {s.eligibility}
                          </p>
                        </div>
                      ) : null}

                      {s.how_to_apply ? (
                        <div className="mt-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-caption">
                            Application Procedure
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-caption font-light">
                            {s.how_to_apply}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-6 pt-5 border-t border-line/60 flex items-center justify-between">
                      <span className="text-xs text-caption">
                        {isHub ? "scholarshipgh.com" : "Accredited Scheme"}
                      </span>
                      {s.external_url ? (
                        <a
                          href={s.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                        >
                          <span>{isHub ? "Open Scholarship Hub" : "Portal Link"}</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })()}
    </div>
  );
}
