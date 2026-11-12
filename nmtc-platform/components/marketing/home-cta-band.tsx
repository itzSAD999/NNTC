import Link from "next/link";
import { ArrowRight, FileCheck, FileText, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeCtaBand() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden border-t border-line bg-primary-deep text-white py-16 md:py-24"
    >
      {/* Decorative ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />

      <div className="section-grid relative z-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Institutional Credential Portal</span>
            </div>

            <h2
              id="cta-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.15]"
            >
              Certified Academic Transcripts, Attestations &amp; Verifications
            </h2>

            <p className="max-w-2xl text-base sm:text-lg text-white/80 font-light leading-relaxed">
              Order official transcripts, letters of English proficiency, and introductory letters online. Employers and embassies can verify documents instantly via secure QR codes.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:justify-end">
            <Button asChild size="lg" className="w-full sm:w-auto bg-white text-ink hover:bg-white/90 shadow-xl">
              <Link href="/request" className="flex items-center justify-center gap-2 font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                <span>Request a Document</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white"
            >
              <Link href="/request/track" className="flex items-center justify-center gap-2">
                <Search className="h-4 w-4 text-white/80" />
                <span>Track Request</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
