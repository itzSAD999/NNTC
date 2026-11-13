import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type PageSectionSize = "default" | "narrow" | "article";

interface PageSectionProps {
 children: React.ReactNode;
 className?: string;
 /** Constrain content width for forms and reading pages. */
 size?: PageSectionSize;
 bordered?: boolean;
 as?: "div" | "section";
 /** Wrap in scroll reveal. Turn off when children already stagger. */
 reveal?: boolean;
}

const sizeClasses: Record<PageSectionSize, string> = {
 default: "",
 narrow: "max-w-3xl",
 article: "max-w-2xl",
};

export function PageSection({
 children,
 className,
 size = "default",
 bordered = true,
 as: Tag = "div",
 reveal = true,
}: PageSectionProps) {
 const classes = cn(
 "section-grid py-12 md:py-16",
 sizeClasses[size],
 bordered && "border-b border-line",
 className
 );

 if (!reveal) {
 return <Tag className={classes}>{children}</Tag>;
 }

 return (
 <Reveal
 as={Tag === "section" ? "section" : "div"}
 variant="up"
 className={classes}
 >
 {children}
 </Reveal>
 );
}
