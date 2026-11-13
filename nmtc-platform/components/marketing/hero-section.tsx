import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import type { Settings } from "@/types/database";

interface HeroSectionProps {
  settings: Settings;
}

const ACTIONS = [
  { href: "/request", kicker: "Request", label: "Request a document" },
  { href: "/admissions", kicker: "Apply", label: "Apply online" },
  { href: "/verify", kicker: "Verify", label: "Verify a document" },
] as const;

export function HeroSection({ settings }: HeroSectionProps) {
  return (
    <>
      <section
        data-nav="hero"
        className="relative flex min-h-[72vh] items-center justify-center overflow-hidden bg-ink text-white md:min-h-[82vh]"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/campus-hero.jpg"
            alt={`${settings.college_name} campus`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.80] contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-black/55" aria-hidden />
        </div>

        <div className="section-grid relative z-10 flex flex-col items-center pb-16 pt-28 text-center sm:pb-20 sm:pt-32">
          <Reveal variant="fade">
            <h1 className="max-w-3xl font-serif text-3xl font-normal leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Your Calling in Healthcare Starts Here
            </h1>
          </Reveal>

          <Reveal variant="up" delay={90}>
            <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-white/90 sm:text-lg md:text-xl">
              Join an accredited training college dedicated to clinical
              discipline, compassionate healing, and saving lives across Ghana.
            </p>
          </Reveal>

          <Reveal variant="up" delay={180}>
            <div className="mt-8">
              <Link
                href="/programs"
                className="group inline-flex items-center gap-3.5 text-base font-medium text-white sm:text-lg"
              >
                <span className="flex h-11 w-11 items-center justify-center bg-white text-ink transition group-hover:bg-primary group-hover:text-white sm:h-12 sm:w-12">
                  <ArrowRight className="h-5 w-5" />
                </span>
                <span className="underline decoration-white/40 underline-offset-4 group-hover:decoration-white">
                  Explore programmes &amp; admissions
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <nav
        aria-label="Quick actions"
        data-nav="dark"
        className="border-y border-white/10 bg-[#111] text-white"
      >
        <Reveal>
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
        </Reveal>
      </nav>
    </>
  );
}
