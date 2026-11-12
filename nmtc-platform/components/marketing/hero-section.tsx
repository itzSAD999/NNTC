import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getStoragePublicUrl } from "@/lib/utils/format";
import type { Settings } from "@/types/database";

interface HeroSectionProps {
  settings: Settings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const logoUrl = getStoragePublicUrl(settings.logo_url) ?? "/images/nmtc-crest.svg";

  return (
    <section className="relative overflow-hidden border-b border-line bg-surface">
      <div className="absolute inset-0 lg:left-[42%]">
        <Image
          src="/images/campus-hero.jpg"
          alt="Nandom NMTC campus — nursing and midwifery students walking on campus"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-bg/95 via-bg/75 to-bg/35 lg:bg-gradient-to-r lg:from-bg lg:via-bg/45 lg:to-transparent"
          aria-hidden
        />
      </div>

      <div className="section-grid relative py-16 md:py-20 lg:py-28">
        <div className="max-w-2xl">
          <Image
            src={logoUrl}
            alt={`${settings.college_name} crest`}
            width={64}
            height={64}
            unoptimized={logoUrl.endsWith(".svg")}
            className="mb-6 h-16 w-16 rounded-lg object-contain shadow-sm"
            priority
          />

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
