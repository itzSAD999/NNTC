import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  FileText,
  GraduationCap,
  HelpCircle,
  Mail,
  Phone,
  ShieldAlert,
} from "lucide-react";

import type { AdmissionsPageData } from "@/lib/data/admissions";
import type { Settings } from "@/types/database";
import { getStoragePublicUrl } from "@/lib/utils/format";

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
    <div className="section-grid space-y-16 py-16 md:space-y-24 md:py-24">
      {/* SECTION 1: HOW TO APPLY STEPS (4 COLORED UNIVERSITY CARDS) */}
      {content.process_steps.length > 0 ? (
        <section aria-labelledby="steps-heading">
          <div className="border-b border-line pb-4 mb-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Admission Procedure
            </p>
            <h2
              id="steps-heading"
              className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
            >
              Application Process &amp; Milestones
            </h2>
            <p className="mt-3 text-base text-caption font-light">
              Follow these standard Ministry of Health Ghana stages to complete your enrollment.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.process_steps.map((step, i) => (
              <div
                key={step.title}
                className="group relative flex flex-col justify-between rounded-none border border-line bg-surface p-6 sm:p-7 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-none bg-primary text-sm font-bold text-white shadow-sm">
                      0{i + 1}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-caption">
                      Step {i + 1}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-ink transition-colors group-hover:text-primary">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-caption font-light">
                    {step.body}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-line/60 text-xs text-primary font-semibold">
                  Phase {i + 1} of 4
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* SECTION 2: REQUIRED DOCUMENTS & ELIGIBILITY */}
      <section className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Required Documents Checklist (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border-b border-line pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Documentation Checklist
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
              Required Application Documents
            </h2>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
            <ul className="divide-y divide-line/60">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <li key={doc.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-3.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm sm:text-base font-medium text-ink">{doc.label}</p>
                      <p className="text-xs text-caption mt-0.5">
                        Must be a certified true copy or verified printout.
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <>
                  <li className="py-3 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-ink">WASSCE / SSCCE Official Result Slip</span>
                  </li>
                  <li className="py-3 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-ink">Certified Birth Certificate or Ghana Card</span>
                  </li>
                  <li className="py-3 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-ink">Two Recent Passport-sized Photographs (White background)</span>
                  </li>
                  <li className="py-3 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-ink">NMC Nursing Certificate (For Post-Nurse Midwifery applicants)</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Application Fee & Voucher Purchase Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-surface to-bg p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 h-2 w-full bg-primary" />
            <div className="flex items-center gap-3 text-primary mb-4">
              <Banknote className="h-6 w-6" />
              <p className="text-xs font-bold uppercase tracking-widest">
                Application Fee
              </p>
            </div>

            <div className="mt-2">
              <span className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                GHS {content.application_fee ? content.application_fee.toFixed(2) : "150.00"}
              </span>
              <p className="text-xs text-caption mt-1">Official MoH / NMTC Voucher</p>
            </div>

            <div className="mt-6 pt-6 border-t border-line/80 space-y-3 text-xs sm:text-sm text-caption font-light leading-relaxed">
              <p>{content.payment_instructions || "Purchase via MoH Health Training Institutions Portal using Mobile Money or authorized bank branches (GCB, ADB)."}</p>
              <p className="font-medium text-ink">Keep your voucher PIN and Serial Number secure.</p>
            </div>

            {formUrl ? (
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-none bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-deep"
              >
                <Download className="h-4 w-4" />
                <span>Download Application Form</span>
              </a>
            ) : null}

            <div className="mt-6 pt-5 border-t border-line/60 flex items-center justify-between text-xs">
              <span className="text-caption">Need assistance?</span>
              <a
                href={`tel:${settings.phone_admissions || settings.phone_main}`}
                className="font-semibold text-primary hover:underline"
              >
                {settings.phone_admissions || settings.phone_main}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FREQUENTLY ASKED QUESTIONS ACCORDION */}
      {faqs.length > 0 ? (
        <section aria-labelledby="faqs-heading" className="max-w-4xl">
          <div className="border-b border-line pb-4 mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Inquiries &amp; Answers
            </p>
            <h2
              id="faqs-heading"
              className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="rounded-none border border-line bg-surface p-6 shadow-sm hover:border-primary/30 transition-colors"
              >
                <h3 className="font-serif text-lg sm:text-xl font-medium text-ink flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="mt-3 pl-8 text-sm sm:text-base leading-relaxed text-caption font-light">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
