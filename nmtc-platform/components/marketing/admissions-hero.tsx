import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, FileText, ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import type { Settings } from "@/types/database";

interface AdmissionsHeroProps {
  settings: Settings;
}

export function AdmissionsHero({ settings }: AdmissionsHeroProps) {
  const collegeName = settings.college_name || "NNTC";

  return (
    <div className="w-full bg-white border-b border-line">
      {/* Main Hero Banner with Student Cutout */}
      <div className="section-grid pt-10 sm:pt-14 md:pt-16 pb-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="md:col-span-7 lg:col-span-7 pb-8 md:pb-14">
            <Reveal variant="fade">
              {/* Category Kicker */}
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-[#4A5568]">
                Application Guide
              </p>

              {/* Red Accent Underline */}
              <div className="mt-3.5 mb-5 h-[3px] w-24 sm:w-36 bg-[#D32F2F]" />

              {/* Subtitle / Description */}
              <p className="max-w-xl text-base sm:text-lg text-[#64748B] leading-relaxed">
                A complete step-by-step guide for prospective {collegeName} students
              </p>

              {/* Status & Accreditation Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F8FAFC] border border-line text-xs font-medium text-ink">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Applications Open for 2025/2026 Academic Year
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F8FAFC] border border-line text-xs font-medium text-caption">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  Ministry of Health Certified
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right Cutout Student Photo Column */}
          <div className="md:col-span-5 lg:col-span-5 flex justify-center md:justify-end self-end">
            <div className="relative w-[280px] h-[310px] sm:w-[320px] sm:h-[350px] md:w-[360px] md:h-[390px] lg:w-[420px] lg:h-[440px]">
              <Image
                src="/images/admissions-guide-student.jpg"
                alt="Prospective student with laptop - NNTC Application Guide"
                fill
                priority
                className="object-contain object-bottom select-none pointer-events-none"
                sizes="(max-width: 768px) 300px, (max-width: 1024px) 380px, 440px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Section Title Strip */}
      <div className="w-full bg-[#EEF2F6] border-t border-line/80 py-4 sm:py-5">
        <div className="section-grid flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wide text-[#0B2545]">
            Admissions
          </h1>

          {/* In-page section anchors */}
          <nav
            aria-label="Admissions quick navigation"
            className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none text-xs font-semibold text-caption"
          >
            <a
              href="#steps-heading"
              className="hover:text-primary whitespace-nowrap transition-colors"
            >
              Process
            </a>
            <span className="text-line" aria-hidden>&bull;</span>
            <a
              href="#documents-heading"
              className="hover:text-primary whitespace-nowrap transition-colors"
            >
              Documents
            </a>
            <span className="text-line" aria-hidden>&bull;</span>
            <a
              href="#voucher-card"
              className="hover:text-primary whitespace-nowrap transition-colors"
            >
              Fee &amp; Voucher
            </a>
            <span className="text-line" aria-hidden>&bull;</span>
            <a
              href="#faqs-heading"
              className="hover:text-primary whitespace-nowrap transition-colors"
            >
              FAQs
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
