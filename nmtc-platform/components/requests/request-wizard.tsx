"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

import { DocumentJourney } from "@/components/requests/document-journey";
import { RequestForm } from "@/components/requests/request-form";
import type { DocumentType } from "@/types/database";
import { cn } from "@/lib/utils";

interface RequestWizardProps {
  documentTypes: DocumentType[];
  supabaseReady: boolean;
}

export function RequestWizard({
  documentTypes,
  supabaseReady,
}: RequestWizardProps) {
  const [step, setStep] = useState<"choose" | "form">("choose");

  // Check URL params on mount in case user arrived via ?action=new or #apply
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "new" || window.location.hash === "#form") {
        setStep("form");
      }
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Step Header & Progress Indicator */}
      <div className="border-b border-line pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                step === "choose"
                  ? "bg-primary text-white"
                  : "bg-primary/10 text-primary border border-primary/30"
              )}
            >
              1
            </span>
            <div className="min-w-0">
              <p className="text-[0.68rem] uppercase font-bold tracking-widest text-caption">
                Step 1 of 2
              </p>
              <p className="text-sm font-semibold text-ink">
                Choose Document Service
              </p>
            </div>
          </div>

          <div className="hidden sm:block h-[1px] w-12 bg-line" />

          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                step === "form"
                  ? "bg-primary text-white ring-2 ring-primary/20"
                  : "bg-surface text-caption border border-line"
              )}
            >
              2
            </span>
            <div className="min-w-0">
              <p className="text-[0.68rem] uppercase font-bold tracking-widest text-caption">
                Step 2 of 2
              </p>
              <p
                className={cn(
                  "text-sm font-semibold transition-colors",
                  step === "form" ? "text-ink" : "text-caption"
                )}
              >
                Student &amp; Document Details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: 3 Big Service Cards */}
      {step === "choose" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Student Records &amp; Certification Portal
            </p>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              What would you like to do today?
            </h2>
            <p className="mt-2 text-sm text-caption max-w-2xl">
              Select an option below to initiate an official application, track a previously submitted request, or verify issued institutional records.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* CARD 1: REQUEST A DOCUMENT */}
            <div
              onClick={() => {
                setStep("form");
                window.scrollTo({ top: 180, behavior: "smooth" });
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setStep("form");
                }
              }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-none border-2 border-primary bg-white p-6 sm:p-7 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer"
            >
              {/* Top Accent */}
              <div className="absolute top-0 left-0 h-1.5 w-full bg-primary" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-none border border-primary/30 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-bold tracking-wider text-primary uppercase">
                    Apply Now
                  </span>
                </div>

                <p className="text-[0.7rem] font-bold uppercase tracking-wider text-primary">
                  Option 01
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold tracking-tight text-ink group-hover:text-primary transition-colors">
                  Request a Document
                </h3>
                <p className="mt-2.5 text-xs text-primary font-semibold uppercase tracking-wider">
                  Official Transcripts &amp; Letters
                </p>

                <p className="mt-3 text-sm leading-relaxed text-caption">
                  Apply online for official academic transcripts, introductory letters, attestation documents, or English proficiency certificates.
                </p>

                <ul className="mt-5 space-y-2 text-xs text-ink/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Instant unique reference tracking code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Secure online Paystack or bank slip</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>3-tier institutional endorsement flow</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-line">
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-xs font-semibold text-white shadow-sm transition-colors group-hover:bg-primary-hover"
                >
                  <span>Start Application</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* CARD 2: TRACK YOUR REQUEST */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-none border border-line bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ink hover:shadow-xl">
              {/* Top Accent */}
              <div className="absolute top-0 left-0 h-1.5 w-full bg-line group-hover:bg-ink transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-none border border-line bg-surface text-ink transition-colors group-hover:bg-ink group-hover:text-white">
                    <Search className="h-6 w-6" />
                  </div>
                  <span className="rounded bg-surface px-2 py-0.5 font-mono text-[11px] font-bold tracking-wider text-caption uppercase border border-line">
                    Live Status
                  </span>
                </div>

                <p className="text-[0.7rem] font-bold uppercase tracking-wider text-caption">
                  Option 02
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold tracking-tight text-ink group-hover:text-primary transition-colors">
                  Track Request
                </h3>
                <p className="mt-2.5 text-xs text-caption font-semibold uppercase tracking-wider">
                  Live Stage &amp; Clearance
                </p>

                <p className="mt-3 text-sm leading-relaxed text-caption">
                  Already submitted an application? Follow its live processing stage through Academic verification, Bursary clearance, and Principal signature.
                </p>

                <ul className="mt-5 space-y-2 text-xs text-caption">
                  <li className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-caption shrink-0" />
                    <span>Real-time milestone progress log</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-caption shrink-0" />
                    <span>View staff notes &amp; queries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-caption shrink-0" />
                    <span>Dispatched collection instructions</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-line">
                <Link
                  href="/request/track"
                  className="inline-flex w-full items-center justify-center gap-2 border border-line bg-white px-4 py-3 text-xs font-semibold text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white"
                >
                  <span>Track Application</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* CARD 3: VERIFY DOCUMENT */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-none border border-line bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#1A5E3A] hover:shadow-xl">
              {/* Top Accent */}
              <div className="absolute top-0 left-0 h-1.5 w-full bg-[#1A5E3A]/40 group-hover:bg-[#1A5E3A] transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-none border border-[#1A5E3A]/20 bg-[#1A5E3A]/10 text-[#1A5E3A] transition-colors group-hover:bg-[#1A5E3A] group-hover:text-white">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <span className="rounded bg-[#1A5E3A]/10 px-2 py-0.5 font-mono text-[11px] font-bold tracking-wider text-[#1A5E3A] uppercase">
                    Registry Check
                  </span>
                </div>

                <p className="text-[0.7rem] font-bold uppercase tracking-wider text-[#1A5E3A]">
                  Option 03
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold tracking-tight text-ink group-hover:text-[#1A5E3A] transition-colors">
                  Verify Document
                </h3>
                <p className="mt-2.5 text-xs text-[#1A5E3A] font-semibold uppercase tracking-wider">
                  Employer &amp; University Verification
                </p>

                <p className="mt-3 text-sm leading-relaxed text-caption">
                  Validate the institutional authenticity of NMTC transcripts, certificates, and release letters using cryptographic security references.
                </p>

                <ul className="mt-5 space-y-2 text-xs text-caption">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#1A5E3A] shrink-0" />
                    <span>Instant security hash validation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#1A5E3A] shrink-0" />
                    <span>Direct registry verification check</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#1A5E3A] shrink-0" />
                    <span>Protects against document tampering</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-line">
                <Link
                  href="/verify"
                  className="inline-flex w-full items-center justify-center gap-2 border border-line bg-white px-4 py-3 text-xs font-semibold text-ink transition-colors group-hover:border-[#1A5E3A] group-hover:bg-[#1A5E3A] group-hover:text-white"
                >
                  <span>Verify Authenticity</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: The Document Request Form */}
      {step === "form" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-surface p-4 border border-line">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-widest text-primary">
                Application Mode
              </p>
              <h2 className="font-serif text-lg font-bold text-ink">
                Fill Your Request Details
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep("choose");
                window.scrollTo({ top: 100, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline self-start sm:self-auto"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to service selection</span>
            </button>
          </div>

          <DocumentJourney />

          <div className="mt-6">
            <RequestForm
              documentTypes={documentTypes}
              supabaseReady={supabaseReady}
            />
          </div>
        </div>
      )}
    </div>
  );
}
