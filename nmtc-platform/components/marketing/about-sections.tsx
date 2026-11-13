import Image from "next/image";
import { Compass, Eye, Shield, Sparkles, ShieldCheck, Award, Heart, UserCheck } from "lucide-react";

import { MEDIA } from "@/lib/media";

import type { AboutContent } from "@/types/database";
import type { Accreditation } from "@/lib/data/about";
import type { OrgTreeNode } from "@/lib/data/org-units";
import { getStoragePublicUrl } from "@/lib/utils/format";
import { OrgChart } from "@/components/marketing/org-chart";
import { Reveal } from "@/components/motion/reveal";

interface AboutSectionsProps {
 about: AboutContent;
 accreditations: Accreditation[];
 orgTree?: OrgTreeNode[];
}

export function AboutSections({ about, accreditations, orgTree = [] }: AboutSectionsProps) {
 const principalPhoto = getStoragePublicUrl(about.principal_photo_url) ?? MEDIA.team;

 return (
 <div className="section-grid space-y-16 py-16 md:space-y-20 md:py-20">
 {/* SECTION 1: OUR HISTORY */}
 {about.history ? (
 <Reveal>
 <section aria-labelledby="history-heading" className="max-w-4xl">
 <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
 Our Heritage &amp; Foundation
 </p>
 <h2
 id="history-heading"
 className="mt-3 pb-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-ink border-b border-line"
 >
 History &amp; Purpose of NMTC
 </h2>
 <div
 className="prose-nmtc mt-6 text-base sm:text-lg leading-relaxed text-caption font-light"
 dangerouslySetInnerHTML={{ __html: about.history }}
 />
 </section>
 </Reveal>
 ) : null}

 {/* SECTION 2: VISION & MISSION CARDS */}
 <Reveal>
 <section
 aria-labelledby="vision-mission-heading"
 className="grid gap-8 md:grid-cols-2"
 >
 <div className="group relative overflow-hidden rounded-none border border-line bg-surface p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:p-10 ">
 <div className="absolute top-0 left-0 h-1.5 w-full bg-primary" />
 <div className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary mb-6">
 <Eye className="h-6 w-6" />
 </div>
 <h2
 id="vision-mission-heading"
 className="font-serif text-2xl sm:text-3xl font-medium text-ink tracking-tight"
 >
 Our Vision
 </h2>
 <p className="mt-4 text-base sm:text-lg leading-relaxed text-caption font-light">
 {about.vision || "To be a leading center of excellence in nursing and midwifery education, clinical research, and community healthcare leadership in Ghana and West Africa."}
 </p>
 </div>

 <div className="group relative overflow-hidden rounded-none border border-line bg-surface p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg sm:p-10 ">
 <div className="absolute top-0 left-0 h-1.5 w-full bg-accent" />
 <div className="flex h-12 w-12 items-center justify-center rounded-none bg-accent/10 text-accent mb-6">
 <Compass className="h-6 w-6" />
 </div>
 <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink tracking-tight">
 Our Mission
 </h2>
 <p className="mt-4 text-base sm:text-lg leading-relaxed text-caption font-light">
 {about.mission || "To educate, inspire, and develop clinically competent, ethically disciplined, and compassionate healthcare professionals who serve communities with unflinching integrity."}
 </p>
 </div>
 </section>
 </Reveal>

 {/* SECTION 3: CORE VALUES TILES */}
 {about.core_values.length > 0 ? (
 <Reveal>
 <section aria-labelledby="values-heading">
 <div className="border-b border-line pb-4">
 <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
 Institutional Pillars
 </p>
 <h2
 id="values-heading"
 className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
 >
 Our Core Values
 </h2>
 <div className="mt-3.5 mb-2 h-[3px] w-20 bg-primary" />
 <p className="mt-2 text-sm text-caption max-w-xl">
 The ethical and clinical tenets shaping healthcare education, student character, and dedicated clinical practice at Nandom NMTC.
 </p>
 </div>

 <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
 {about.core_values.map((value, idx) => {
 const key = value.toLowerCase();
 let meta = {
 subtitle: "Core Pillar",
 description: "A foundational institutional standard guiding healthcare training and community health service.",
 icon: Sparkles,
 };

 const theme = key.includes("excellence")
 ? {
 bar: "bg-[#9A1B2F]/40",
 barHover: "group-hover:bg-[#9A1B2F]",
 iconBox: "border-[#9A1B2F]/25 bg-[#9A1B2F]/10 text-[#9A1B2F]",
 iconBoxHover: "group-hover:bg-[#9A1B2F] group-hover:text-white group-hover:border-[#9A1B2F]",
 subtitle: "text-[#9A1B2F]",
 underline: "bg-[#9A1B2F]/30",
 underlineHover: "group-hover:bg-[#9A1B2F]",
 pillarBadge: "text-[#9A1B2F]",
 cardBorderHover: "hover:border-[#9A1B2F]",
 titleHover: "group-hover:text-[#9A1B2F]",
 }
 : key.includes("compassion")
 ? {
 bar: "bg-[#D99B00]/50",
 barHover: "group-hover:bg-[#D99B00]",
 iconBox: "border-[#D99B00]/30 bg-[#D99B00]/15 text-[#9A6D00]",
 iconBoxHover: "group-hover:bg-[#D99B00] group-hover:text-white group-hover:border-[#D99B00]",
 subtitle: "text-[#9A6D00]",
 underline: "bg-[#D99B00]/40",
 underlineHover: "group-hover:bg-[#D99B00]",
 pillarBadge: "text-[#9A6D00]",
 cardBorderHover: "hover:border-[#D99B00]",
 titleHover: "group-hover:text-[#9A6D00]",
 }
 : key.includes("professionalism")
 ? {
 bar: "bg-[#0D5C75]/40",
 barHover: "group-hover:bg-[#0D5C75]",
 iconBox: "border-[#0D5C75]/25 bg-[#0D5C75]/10 text-[#0D5C75]",
 iconBoxHover: "group-hover:bg-[#0D5C75] group-hover:text-white group-hover:border-[#0D5C75]",
 subtitle: "text-[#0D5C75]",
 underline: "bg-[#0D5C75]/30",
 underlineHover: "group-hover:bg-[#0D5C75]",
 pillarBadge: "text-[#0D5C75]",
 cardBorderHover: "hover:border-[#0D5C75]",
 titleHover: "group-hover:text-[#0D5C75]",
 }
 : {
 bar: "bg-[#1A5E3A]/40",
 barHover: "group-hover:bg-[#1A5E3A]",
 iconBox: "border-[#1A5E3A]/25 bg-[#1A5E3A]/10 text-[#1A5E3A]",
 iconBoxHover: "group-hover:bg-[#1A5E3A] group-hover:text-white group-hover:border-[#1A5E3A]",
 subtitle: "text-[#1A5E3A]",
 underline: "bg-[#1A5E3A]/30",
 underlineHover: "group-hover:bg-[#1A5E3A]",
 pillarBadge: "text-[#1A5E3A]",
 cardBorderHover: "hover:border-[#1A5E3A]",
 titleHover: "group-hover:text-[#1A5E3A]",
 };

 if (key.includes("integrity")) {
 meta = {
 subtitle: "Honesty & Ethics",
 description: "Upholding unyielding moral principles, honesty in academic study, and transparent accountability.",
 icon: ShieldCheck,
 };
 } else if (key.includes("excellence")) {
 meta = {
 subtitle: "Clinical Mastery",
 description: "Pursuing the highest benchmarks in patient care, rigorous training, and continuous professional growth.",
 icon: Award,
 };
 } else if (key.includes("compassion")) {
 meta = {
 subtitle: "Empathy & Dignity",
 description: "Treating every patient, mother, and child with genuine warmth, profound empathy, and dedicated care.",
 icon: Heart,
 };
 } else if (key.includes("professionalism")) {
 meta = {
 subtitle: "Discipline & Duty",
 description: "Exemplifying clinical discipline, respectful communication, and adherence to the Nursing & Midwifery Council code.",
 icon: UserCheck,
 };
 }

 const Icon = meta.icon;

 return (
 <Reveal as="div" key={value} delay={idx * 80}>
 <article className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-none border border-line bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${theme.cardBorderHover}`}>
 {/* Top Crest Accent Bar */}
 <div className={`absolute top-0 left-0 h-1 w-full transition-colors duration-300 ${theme.bar} ${theme.barHover}`} />

 <div>
 {/* Top Row: Icon + Numeral */}
 <div className="flex items-center justify-between mb-5">
 <div className={`flex h-11 w-11 items-center justify-center border transition-colors duration-300 ${theme.iconBox} ${theme.iconBoxHover}`}>
 <Icon className="h-5 w-5" />
 </div>
 <span className="font-mono text-xs font-bold tracking-widest text-caption uppercase">
 0{idx + 1}
 </span>
 </div>

 {/* Value Title */}
 <h3 className={`font-serif text-2xl font-bold tracking-tight text-ink transition-colors duration-200 ${theme.titleHover}`}>
 {value}
 </h3>

 {/* Subtitle */}
 <p className={`mt-1 text-xs font-semibold uppercase tracking-[0.16em] ${theme.subtitle}`}>
 {meta.subtitle}
 </p>

 {/* Underline */}
 <div className={`mt-3 mb-4 h-[2px] w-10 transition-all duration-300 group-hover:w-16 ${theme.underline} ${theme.underlineHover}`} />

 {/* Description */}
 <p className="text-sm leading-relaxed text-caption">
 {meta.description}
 </p>
 </div>

 {/* Bottom Footer Accent */}
 <div className="mt-6 pt-3.5 border-t border-line/60 flex items-center justify-between text-xs text-caption">
 <span className="font-medium text-ink/70">NNTC Pillar</span>
 <span className={`font-mono text-[11px] font-semibold ${theme.pillarBadge}`}>0{idx + 1}</span>
 </div>
 </article>
 </Reveal>
 );
 })}
 </div>
 </section>
 </Reveal>
 ) : null}

 {/* SECTION 4: ACCREDITATIONS */}
 {accreditations.length > 0 ? (
 <Reveal>
 <section aria-labelledby="accreditations-heading">
 <div className="border-b border-line pb-4">
 <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
 Statutory Oversight
 </p>
 <h2
 id="accreditations-heading"
 className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
 >
 Official Accreditations &amp; Affiliations
 </h2>
 </div>
 <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {accreditations.map((acc) => {
 const logo = getStoragePublicUrl(acc.logo_url);
 return (
 <li
 key={acc.id}
 className="flex items-start gap-4 rounded-none border border-line bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
 >
 <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-none border border-line bg-bg text-primary">
 <Shield className="h-7 w-7" />
 </div>
 <div>
 <p className="font-serif text-lg font-medium text-ink leading-snug">
 {acc.body_name}
 </p>
 <p className="mt-1 text-xs text-primary font-semibold">
 Full Accreditation &amp; Recognition
 </p>
 {acc.accreditation_no ? (
 <p className="ref-mono mt-1 text-xs text-caption">
 Ref: {acc.accreditation_no}
 </p>
 ) : null}
 </div>
 </li>
 );
 })}
 </ul>
 </section>
 </Reveal>
 ) : null}

 {/* SECTION 5: ORGANIZATIONAL STRUCTURE */}
 {orgTree.length > 0 ? (
 <Reveal>
 <section aria-labelledby="org-heading" className="pt-6">
 <div className="border-b border-line pb-4 mb-8">
 <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
 Governance &amp; Leadership
 </p>
 <h2
 id="org-heading"
 className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
 >
 Institutional Structure
 </h2>
 </div>
 <OrgChart tree={orgTree} />
 </section>
 </Reveal>
 ) : null}

 {/* SECTION 6: PRINCIPAL'S ADDRESS */}
 {(about.principal_message || about.principal_name) && (
 <Reveal variant="image">
 <section
 aria-labelledby="principal-heading"
 className="overflow-hidden rounded-none border border-line bg-surface p-8 shadow-sm sm:p-12"
 >
 <div className="grid gap-10 md:grid-cols-[240px_1fr] md:items-start">
 <div className="relative aspect-[4/5] overflow-hidden rounded-none border border-line bg-bg shadow-sm">
 <Image
 src={principalPhoto}
 alt={about.principal_name ? `Photo of ${about.principal_name}` : "Principal"}
 fill
 className="object-cover"
 sizes="(max-width: 768px) 100vw, 240px"
 />
 </div>
 <div>
 <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
 Executive Leadership
 </p>
 <h2
 id="principal-heading"
 className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
 >
 Message from the {about.principal_title ?? "Principal"}
 </h2>
 {about.principal_name ? (
 <p className="mt-2 text-base font-semibold text-primary">
 {about.principal_name}
 </p>
 ) : null}
 {about.principal_message ? (
 <div
 className="prose-nmtc mt-6 text-base leading-relaxed text-caption font-light"
 dangerouslySetInnerHTML={{ __html: about.principal_message }}
 />
 ) : null}
 </div>
 </div>
 </section>
 </Reveal>
 )}
 </div>
 );
}
