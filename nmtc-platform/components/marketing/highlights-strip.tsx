import { Award, CheckCircle2, ShieldCheck } from "lucide-react";

interface HighlightsStripProps {
  items: string[];
}

export function HighlightsStrip({ items }: HighlightsStripProps) {
  if (items.length === 0) return null;

  return (
    <section
      aria-label="College institutional highlights"
      className="border-b border-line bg-primary-deep text-white"
    >
      <div className="section-grid">
        <ul className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((item, index) => (
            <li
              key={item}
              className="flex flex-col items-center px-4 py-8 text-center md:px-8 md:py-10 group"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  0{index + 1}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span className="text-[0.68rem] uppercase tracking-widest text-white/60 font-medium">
                  Institutional Pillar
                </span>
              </div>
              <p className="max-w-xs font-serif text-lg md:text-xl font-medium leading-snug tracking-tight text-white group-hover:text-primary-foreground transition-colors">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
