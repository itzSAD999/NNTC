"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Award,
  Heart,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { Settings } from "@/types/database";

interface HeroSectionProps {
  settings: Settings;
}

const ROTATING_WORDS = [
  "Healthcare",
  "Nursing",
  "Midwifery",
  "Clinical Care",
  "Saving Lives",
];

const ACTIONS = [
  { href: "/request", kicker: "Request", label: "Request a document" },
  { href: "/admissions", kicker: "Apply", label: "Apply online" },
  { href: "/verify", kicker: "Verify", label: "Verify a document" },
] as const;

export function HeroSection({ settings }: HeroSectionProps) {
  const [wordIdx, setWordIdx] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    // Respect user motion preferences
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setWordIdx((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsFlipping(false);
      }, 280);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section
        data-nav="hero"
        className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-ink text-white md:min-h-[85vh]"
      >
        {/* Background Image with Cinematic Gentle Zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="relative h-full w-full animate-ken-burns">
            <Image
              src="/images/campus-hero.jpg"
              alt={`${settings.college_name} campus`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[0.78] contrast-[1.10]"
            />
          </div>
          {/* Subtle gradient vignette to maximize text readability */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/75"
            aria-hidden
          />
        </div>

        {/* Hero Content Container */}
        <div className="section-grid relative z-10 flex flex-col items-center pb-16 pt-28 text-center sm:pb-24 sm:pt-36">
          {/* Eyebrow Institutional Badge */}
          <div className="animate-hero-badge mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 backdrop-blur-md shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/95 sm:text-xs">
              Nandom Nursing &amp; Midwifery Training College
            </span>
          </div>

          {/* Animated Headline with Dynamic Words */}
          <div className="animate-hero-title max-w-4xl">
            <h1 className="font-serif text-3xl font-normal leading-[1.16] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              <span>Your Calling in </span>
              <span className="relative inline-block whitespace-nowrap">
                <span
                  className={cn(
                    "inline-block font-medium text-emerald-300 drop-shadow-md transition-all duration-300 ease-out",
                    isFlipping
                      ? "-translate-y-3 opacity-0 scale-95 blur-[2px]"
                      : "translate-y-0 opacity-100 scale-100 blur-0"
                  )}
                >
                  {ROTATING_WORDS[wordIdx]}
                </span>
                {/* Golden Emerald Accent Underline */}
                <span
                  aria-hidden
                  className="absolute -bottom-1 sm:-bottom-2 left-0 h-[3px] w-full bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 animate-draw-line shadow-sm"
                />
              </span>
              <span className="block mt-1 sm:mt-2">Starts Here</span>
            </h1>
          </div>

          {/* Subtitle with Staggered Entrance */}
          <div className="animate-hero-sub mt-6 max-w-2xl">
            <p className="text-base font-light leading-relaxed text-white/90 sm:text-lg md:text-xl drop-shadow-sm">
              Join an accredited training college dedicated to clinical
              discipline, compassionate healing, and saving lives across Ghana.
            </p>
          </div>

          {/* Call to Actions with Staggered Entrance */}
          <div className="animate-hero-actions mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/programs"
              className="group inline-flex items-center gap-3.5 bg-primary px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-xl transition-all duration-300 hover:bg-primary-hover hover:scale-[1.02] hover:shadow-2xl"
            >
              <span>Explore Programmes &amp; Admissions</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/request"
              className="group inline-flex items-center gap-2 border border-white/30 bg-black/35 px-5 py-3.5 text-sm sm:text-base font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              <span>Request a Document</span>
              <ChevronRight className="h-4 w-4 text-white/60 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
            </Link>
          </div>

          {/* Institutional Highlights Pill Strip */}
          <div className="animate-hero-stats mt-10 hidden sm:flex flex-wrap items-center justify-center gap-8 border-t border-white/15 pt-6 text-white/85">
            <div className="flex items-center gap-2 text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>NMC &amp; Ministry of Health Accredited</span>
            </div>
            <div className="h-3 w-[1px] bg-white/20" />
            <div className="flex items-center gap-2 text-xs">
              <Award className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Top Licensure Examination Pass Rate</span>
            </div>
            <div className="h-3 w-[1px] bg-white/20" />
            <div className="flex items-center gap-2 text-xs">
              <Heart className="h-4 w-4 text-rose-400 shrink-0" />
              <span>Supervised Clinical Ward Postings</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Navigation Strip */}
      <nav
        aria-label="Quick actions"
        data-nav="dark"
        className="border-y border-white/10 bg-[#111] text-white"
      >
        <div className="section-grid grid md:grid-cols-3">
          {ACTIONS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between gap-4 py-5 transition hover:bg-white/[0.04] md:px-6 ${
                i > 0 ? "border-t border-white/10 md:border-t-0 md:border-l" : ""
              }`}
            >
              <span>
                <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/50">
                  {item.kicker}
                </span>
                <span className="mt-1 block text-sm font-medium text-white sm:text-base">
                  {item.label}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-white/45" />
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
