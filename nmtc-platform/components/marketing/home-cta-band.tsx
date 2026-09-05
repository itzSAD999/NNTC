import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HomeCtaBand() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="border-t border-line bg-surface"
    >
      <div className="section-grid py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Document requests
            </p>
            <h2
              id="cta-heading"
              className="mt-3 font-serif text-display-md md:text-display-lg"
            >
              Official transcripts and certificates, handled with care
            </h2>
            <p className="mt-4 max-w-xl text-base text-caption">
              Submit a request online, upload payment evidence securely, and
              track progress with your reference number — the same rigour you
              expect from an accredited training college.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto lg:w-full xl:w-auto">
              <Link href="/request">Request a document</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto lg:w-full xl:w-auto"
            >
              <Link href="/request/track">Track your request</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
