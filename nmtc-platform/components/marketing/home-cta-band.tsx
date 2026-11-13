import Link from "next/link";
import { FileText, Search } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

export function HomeCtaBand() {
 return (
 <section
 aria-labelledby="cta-heading"
 data-nav="dark"
 className="bg-primary-deep py-16 text-white md:py-20"
 >
 <div className="section-grid grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
 <Reveal variant="fade">
 <div>
 <p className="section-eyebrow !bg-white/15 !text-white">Student services</p>
 <h2 id="cta-heading" className="mt-4 font-serif text-3xl text-white sm:text-4xl">
 Transcripts, letters, and QR verification
 </h2>
 </div>
 </Reveal>
 <Reveal variant="up" delay={80}>
 <div className="flex flex-wrap gap-3 lg:justify-end">
 <Link
 href="/request"
 className="inline-flex items-center gap-2 rounded-none bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-bg"
 >
 <FileText className="h-4 w-4 text-primary" />
 Request a document
 </Link>
 <Link
 href="/request/track"
 className="inline-flex items-center gap-2 rounded-none border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
 >
 <Search className="h-4 w-4" />
 Track request
 </Link>
 </div>
 </Reveal>
 </div>
 </section>
 );
}
