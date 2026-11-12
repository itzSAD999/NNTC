import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, FileText, GraduationCap, ShieldCheck } from "lucide-react";
import { getStoragePublicUrl } from "@/lib/utils/format";
import type { Settings } from "@/types/database";

interface HeroSectionProps {
  settings: Settings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section className="relative min-h-[75vh] md:min-h-[82vh] flex items-center justify-center overflow-hidden bg-ink text-white">
      {/* Full-bleed Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/campus-hero.jpg"
          alt="Nandom Nursing and Midwifery Training College campus"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.80] contrast-[1.08]"
        />
        {/* Harvard-style Deep Cinematic Gradient & Vignette Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/65"
          aria-hidden
        />
        {/* Subtle Radial Vignette for Pure Text Contrast */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/30 to-black/75"
          aria-hidden
        />
      </div>

      {/* Hero Content — Clean, Reduced Text that Speaks Directly to the User */}
      <div className="section-grid relative z-10 py-16 sm:py-20 md:py-28 flex flex-col items-center text-center">
        {/* Direct, Inspiring Headline */}
        <h1 className="max-w-3xl font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.12] tracking-tight text-white drop-shadow-md">
          Your Calling in Healthcare Starts Here
        </h1>

        {/* Short, Punchy 1-Sentence Narrative */}
        <p className="mt-5 max-w-xl text-base sm:text-lg md:text-xl font-light leading-relaxed text-white/90 drop-shadow">
          Join an accredited training college dedicated to clinical discipline, compassionate healing, and saving lives across Ghana.
        </p>

        {/* Harvard-Style Circular Arrow CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/programs"
            className="group inline-flex items-center gap-3.5 text-base sm:text-lg font-medium text-white transition-all hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {/* White Circle with Right Arrow */}
            <span className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-transform duration-200 group-hover:scale-105 group-hover:bg-primary group-hover:text-white">
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
            <span className="underline decoration-white/40 underline-offset-4 group-hover:decoration-white">
              Explore programmes &amp; admissions
            </span>
          </Link>
        </div>

        {/* Square-Shape Institutional Quick Badges (Clean, Sharp Edges) */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl w-full border-t border-white/15 pt-6 text-left">
          <Link
            href="/request"
            className="group rounded-none border border-white/15 bg-black/40 p-3.5 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/60"
          >
            <div className="flex items-center gap-2 text-white/70">
              <FileText className="h-4 w-4" />
              <p className="text-[0.65rem] font-bold uppercase tracking-wider">
                Student Services
              </p>
            </div>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-white group-hover:text-primary-foreground flex items-center justify-between">
              <span>Request Documents</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>

          <Link
            href="/admissions"
            className="group rounded-none border border-white/15 bg-black/40 p-3.5 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/60"
          >
            <div className="flex items-center gap-2 text-white/70">
              <GraduationCap className="h-4 w-4" />
              <p className="text-[0.65rem] font-bold uppercase tracking-wider">
                Admissions 2026/27
              </p>
            </div>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-white group-hover:text-primary-foreground flex items-center justify-between">
              <span>Apply Online</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>

          <Link
            href="/verify"
            className="group rounded-none border border-white/15 bg-black/40 p-3.5 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/60"
          >
            <div className="flex items-center gap-2 text-white/70">
              <ShieldCheck className="h-4 w-4" />
              <p className="text-[0.65rem] font-bold uppercase tracking-wider">
                Instant Verification
              </p>
            </div>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-white group-hover:text-primary-foreground flex items-center justify-between">
              <span>Verify QR Code</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
