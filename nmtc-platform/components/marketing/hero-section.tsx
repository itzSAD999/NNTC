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
    <section className="relative border-b border-line bg-surface">
      <div className="grid lg:grid-cols-2">
        <div className="section-grid flex flex-col justify-center py-16 lg:py-24 lg:pr-8">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`${settings.college_name} logo`}
              width={64}
              height={64}
              className="mb-6 h-16 w-16 object-contain"
              priority
            />
          ) : null}
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            {settings.college_name}
          </p>
          <h1 className="mt-4 max-w-xl font-serif text-display-lg md:text-display-xl">
            Training compassionate nurses and midwives for Ghana&apos;s
            healthcare future.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-caption">
            {settings.motto ||
              "An accredited institution combining clinical excellence with institutional rigour."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/request">Request a Document</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/news">View Announcements</Link>
            </Button>
          </div>
        </div>

        <div className="relative min-h-[280px] border-t border-line lg:min-h-[520px] lg:border-l lg:border-t-0">
          <Image
            src="/images/campus-hero.svg"
            alt="NMTC campus — documentary-style campus view"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent lg:bg-gradient-to-l lg:from-bg/30"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
