import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getStoragePublicUrl } from "@/lib/utils/format";
import type { Settings } from "@/types/database";

interface HeroSectionProps {
  settings: Settings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const logoUrl = getStoragePublicUrl(settings.logo_url);

  return (
    <section className="relative overflow-hidden border-b border-line bg-surface">
      <div className="absolute inset-0 lg:left-[42%]">
        <Image
          src="/images/campus-hero.svg"
          alt="NMTC campus — documentary-style campus view"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-bg/95 via-bg/70 to-bg/30 lg:bg-gradient-to-r lg:from-bg lg:via-bg/88 lg:to-bg/20"
          aria-hidden
        />
      </div>

      <div className="section-grid relative py-16 md:py-20 lg:py-28">
        <div className="max-w-2xl">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`${settings.college_name} logo`}
              width={72}
              height={72}
              className="mb-8 h-[4.5rem] w-[4.5rem] object-contain"
              priority
            />
          ) : null}

          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
            {settings.college_name}
          </p>

          <h1 className="mt-5 font-serif text-display-lg leading-[1.08] md:text-[2.75rem] lg:text-display-xl">
            Excellence in nursing and midwifery training for Ghana&apos;s
            healthcare future.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-caption">
            {settings.motto ||
              "An accredited institution combining clinical rigour, compassionate care, and institutional discipline."}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/request">Request a Document</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/news">View Announcements</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
