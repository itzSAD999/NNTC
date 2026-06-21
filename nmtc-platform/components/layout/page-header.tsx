import type { Settings } from "@/types/database";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="section-grid py-12 md:py-16">
        {eyebrow ? (
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className={`font-serif text-display-lg md:text-display-xl ${eyebrow ? "mt-3" : ""}`}>
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg text-caption">{description}</p>
        ) : null}
      </div>
    </header>
  );
}

export type { Settings };
