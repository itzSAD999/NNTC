import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

/** Institutional page hero — Harvard editorial hierarchy + Yale feature framing. */
export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-line bg-surface",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(26,94,58,0.07)_0%,transparent_45%,rgba(251,251,249,0.9)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 w-1 bg-accent"
        aria-hidden
      />

      <div className="section-grid relative py-14 md:py-20">
        <div className="max-w-3xl border-l-2 border-primary/80 pl-6 md:pl-8">
          {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
          <h1
            className={cn(
              "font-serif text-display-lg leading-[1.1] md:text-display-xl",
              eyebrow && "mt-3"
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-caption">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
