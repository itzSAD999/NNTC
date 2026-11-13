import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, Shield, Sparkles, Stethoscope } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { MEDIA } from "@/lib/media";
import type { CampusSection } from "@/lib/types/expansion";
import { getStoragePublicUrl } from "@/lib/utils/format";

// Map campus section keys to authentic campus photography
const SECTION_IMAGES: Record<string, string> = {
 overview: MEDIA.campus,
 accommodation: MEDIA.lecture,
 dining: MEDIA.clinical,
};

const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
 overview: Home,
 accommodation: Shield,
 dining: Stethoscope,
};

export function CampusLifeSections({ sections }: { sections: CampusSection[] }) {
 return (
 <div className="section-grid space-y-16 py-16 md:space-y-24 md:py-24">
 {sections.map((section, idx) => {
 const fallbackImage = SECTION_IMAGES[section.section_key] || MEDIA.campus;
 const image = getStoragePublicUrl(section.image_url) ?? fallbackImage;
 const IconComponent = SECTION_ICONS[section.section_key] || Sparkles;
 const isReversed = idx % 2 === 1;

 return (
 <Reveal key={section.id} variant={isReversed ? "right" : "left"}>
 <section
 id={section.section_key}
 aria-labelledby={`campus-${section.section_key}`}
 className="overflow-hidden rounded-none border border-line bg-surface p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-12"
 >
 <div
 className={`grid gap-10 md:grid-cols-2 md:items-center ${
 isReversed ? "md:grid-flow-dense" : ""
 }`}
 >
 <div className={isReversed ? "md:col-start-2" : ""}>
 <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary border border-primary/20 mb-4">
 <IconComponent className="h-3.5 w-3.5" />
 <span>Campus Life</span>
 </div>

 <h2
 id={`campus-${section.section_key}`}
 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
 >
 {section.title}
 </h2>

 <div className="prose-nmtc mt-5 whitespace-pre-wrap text-base sm:text-lg leading-relaxed text-caption font-light">
 {section.body}
 </div>

 <div className="mt-8 pt-6 border-t border-line/60 flex items-center gap-4">
 <Link
 href="/gallery"
 className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-deep transition-colors"
 >
 <span>View photo gallery</span>
 <ArrowRight className="h-4 w-4" />
 </Link>
 <span className="text-line">•</span>
 <Link
 href="/contact"
 className="text-sm font-medium text-caption hover:text-ink transition-colors"
 >
 Inquire about campus
 </Link>
 </div>
 </div>

 <div className={`card-photo group relative aspect-[16/10] overflow-hidden rounded-none border border-line bg-bg shadow-sm ${isReversed ? "md:col-start-1" : ""}`}>
 <Image
 src={image}
 alt={section.title}
 fill
 className="object-cover transition-transform duration-500 group-hover:scale-105"
 sizes="(max-width: 768px) 100vw, 50vw"
 />
                <div className="absolute inset-0 bg-black/40" />
 <span className="absolute bottom-3 left-3 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
 Campus
 </span>
 </div>
 </div>
 </section>
 </Reveal>
 );
 })}
 </div>
 );
}
