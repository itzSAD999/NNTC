import { ArrowDownToLine, FileText } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import type { Resource } from "@/lib/types/expansion";
import { getStoragePublicUrl } from "@/lib/utils/format";

export function ResourcesSections({
 groups,
}: {
 groups: { category: string; items: Resource[] }[];
}) {
 return (
 <div className="section-grid space-y-12 py-16 md:py-20">
 {groups.map(({ category, items }) => (
 <Reveal key={category}>
 <section aria-labelledby={`res-${category}`}>
 <div className="border-b border-line pb-4 mb-8">
 <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
 Student Library
 </p>
 <h2
 id={`res-${category}`}
 className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink"
 >
 {category}
 </h2>
 </div>

 <div className="grid gap-6 sm:grid-cols-2">
 {items.map((item) => {
 const fileUrl = getStoragePublicUrl(item.file_url);
 return (
 <div
 key={item.id}
 className="group flex flex-col justify-between rounded-none border border-line bg-surface p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:p-7 "
 >
 <div>
 <div className="flex items-center justify-between mb-4">
 <div className="flex h-11 w-11 items-center justify-center rounded-none bg-red-50 text-red-700 border border-red-200 shadow-sm">
 <FileText className="h-6 w-6" />
 </div>
 <span className="rounded-none bg-primary/10 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-primary border border-primary/20">
 Official PDF
 </span>
 </div>

 <h3 className="font-serif text-xl font-medium text-ink transition-colors group-hover:text-primary">
 {item.title}
 </h3>

 {item.description ? (
 <p className="mt-2 text-sm leading-relaxed text-caption font-light">
 {item.description}
 </p>
 ) : null}
 </div>

 <div className="mt-6 pt-5 border-t border-line/60 flex items-center justify-between">
 <span className="text-xs text-caption">PDF</span>

 {fileUrl ? (
 <a
 href={fileUrl}
 download
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-deep"
 >
 <ArrowDownToLine className="h-4 w-4" />
 <span>Download PDF</span>
 </a>
 ) : (
 <span className="text-xs text-caption italic">
 Available on campus
 </span>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </section>
 </Reveal>
 ))}
 </div>
 );
}
