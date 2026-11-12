import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, FileText, GraduationCap, ShieldCheck } from "lucide-react";
import { getStoragePublicUrl } from "@/lib/utils/format";
import type { Settings } from "@/types/database";

interface HeroSectionProps {
  settings: Settings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const logoUrl = getStoragePublicUrl(settings.logo_url) ?? "/images/nmtc-crest.svg";

  return (
    <section className="relative min-h-[82vh] md:min-h-[88vh] flex items-center justify-center overflow-hidden bg-ink text-white">
      {/* Full-bleed Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/campus-hero.jpg"
          alt="Nandom Nursing and Midwifery Training College campus"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.82] contrast-[1.08]"
        />
        {/* Harvard-style Deep Cinematic Gradient & Vignette Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/70"
          aria-hidden
        />
        {/* Subtle Radial Vignette for Pure Text Contrast */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/35 to-black/80"
          aria-hidden
        />
      </div>

      {/* Hero Content — Centered Harvard Editorial Architecture */}
      <div className="section-grid relative z-10 py-20 sm:py-24 md:py-32 flex flex-col items-center text-center">
        {/* Subtitle / Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-md mb-6 sm:mb-8">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span>{settings.college_name || "Nandom NMTC"}</span>
        </div>

        {/* Grand Centered Editorial Serif Headline */}
        <h1 className="max-w-4xl font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.12] tracking-tight text-white drop-shadow-md">
          Training Ghana’s Healthcare Leaders
        </h1>

        {/* Narrative Subtitle */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl font-light leading-relaxed text-white/90 drop-shadow">
          {settings.motto
            ? `${settings.motto} — for over two decades, Nandom NMTC has prepared compassionate, clinically disciplined nurses and midwives serving communities across Ghana and beyond.`
            : "For over two decades, Nandom NMTC has combined clinical discipline, ethical practice, and compassionate care to prepare nurses and midwives who transform patient outcomes across Ghana."}
        </p>

        {/* Exact Harvard-Style Circular Arrow CTA */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/programs"
            className="group inline-flex items-center gap-3.5 text-base sm:text-lg font-medium text-white transition-all hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {/* White Circle with Right Arrow */}
            <span className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-transform duration-200 group-hover:scale-105 group-hover:bg-primary group-hover:text-white">
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
            <span className="underline decoration-white/40 underline-offset-4 group-hover:decoration-white">
              Explore our programmes &amp; admissions
            </span>
          </Link>
        </div>

        {/* Secondary Harvard-style Institutional Badges Bar */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl w-full border-t border-white/15 pt-6 text-left">
          <Link
            href="/request"
            className="group rounded border border-white/15 bg-black/40 p-4 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/60"
          >
            <div className="flex items-center gap-2 text-white/70">
              <FileText className="h-4 w-4" />
              <p className="text-[0.68rem] font-bold uppercase tracking-wider">
                Student Services
              </p>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-white group-hover:text-primary-foreground flex items-center justify-between">
              <span>Request Documents</span>
              <ChevronRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>

          <Link
            href="/admissions"
            className="group rounded border border-white/15 bg-black/40 p-4 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/60"
          >
            <div className="flex items-center gap-2 text-white/70">
              <GraduationCap className="h-4 w-4" />
              <p className="text-[0.68rem] font-bold uppercase tracking-wider">
                Admissions 2026/27
              </p>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-white group-hover:text-primary-foreground flex items-center justify-between">
              <span>Apply Online</span>
              <ChevronRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>

          <Link
            href="/verify"
            className="group rounded border border-white/15 bg-black/40 p-4 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/60"
          >
            <div className="flex items-center gap-2 text-white/70">
              <ShieldCheck className="h-4 w-4" />
              <p className="text-[0.68rem] font-bold uppercase tracking-wider">
                Instant Verification
              </p>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-white group-hover:text-primary-foreground flex items-center justify-between">
              <span>Verify QR Code</span>
              <ChevronRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
