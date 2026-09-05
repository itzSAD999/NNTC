import { cn } from "@/lib/utils";

type PageSectionSize = "default" | "narrow" | "article";

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Constrain content width for forms and reading pages. */
  size?: PageSectionSize;
  bordered?: boolean;
  as?: "div" | "section";
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
}: PageSectionProps) {
  return (
    <Tag
      className={cn(
        "section-grid py-12 md:py-16",
        sizeClasses[size],
        bordered && "border-b border-line",
        className
      )}
    >
      {children}
    </Tag>
  );
}
