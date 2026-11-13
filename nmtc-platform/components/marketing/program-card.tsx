import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { MEDIA } from "@/lib/media";
import type { ProgramWithDepartment } from "@/lib/types/expansion";

const PROGRAM_IMAGES: Record<string, string> = {
 "diploma-in-registered-general-nursing": MEDIA.theatre,
 "registered-midwifery-post-nurse": MEDIA.clinical,
};

export function ProgramCard({ program }: { program: ProgramWithDepartment }) {
 const photo = PROGRAM_IMAGES[program.slug] || MEDIA.lecture;

 return (
 <article className="group flex flex-col overflow-hidden rounded-none border border-line bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
 <Link href={`/programs/${program.slug}`} className="card-photo relative aspect-[16/9] block">
 <Image
 src={photo}
 alt={program.name}
 fill
 className="object-cover transition-transform duration-700 group-hover:scale-105"
 sizes="(max-width: 768px) 100vw, 50vw"
 />
 {program.department ? (
 <span className="absolute left-3 top-3 z-10 rounded-none bg-gold px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-ink">
 {program.department.name}
 </span>
 ) : null}
 </Link>

 <div className="flex flex-1 flex-col p-6">
 <h2 className="font-serif text-2xl font-medium tracking-tight text-ink group-hover:text-primary">
 <Link href={`/programs/${program.slug}`}>{program.name}</Link>
 </h2>
 <p className="mt-3 flex items-center gap-2 text-sm text-caption">
 <Clock className="h-4 w-4 text-primary" />
 {program.duration || "3 years"} · {program.qualification || "Diploma"}
 </p>
 <Link
 href={`/programs/${program.slug}`}
 className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
 >
 View programme
 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
 </Link>
 </div>
 </article>
 );
}
