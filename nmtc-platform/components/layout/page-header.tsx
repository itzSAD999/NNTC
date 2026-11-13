import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
 eyebrow?: string;
 title: string;
 description?: string;
 className?: string;
}

export function PageHeader({
 eyebrow,
 title,
 description,
 className,
}: PageHeaderProps) {
 return (
 <header className={cn("border-b border-line bg-white", className)}>
 <div className="section-grid py-12 md:py-16">
     <Reveal variant="fade" className="max-w-3xl">
 {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
 <h1
 className={cn(
 "font-serif text-display-lg leading-[1.1] md:text-display-xl",
 eyebrow && "mt-4"
 )}
 >
 {title}
 </h1>
 {description ? (
 <p className="mt-4 max-w-xl text-base leading-relaxed text-caption md:text-lg">
 {description}
 </p>
 ) : null}
     </Reveal>
   </div>
 </header>
 );
}
