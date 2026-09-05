interface HighlightsStripProps {
  items: string[];
}

export function HighlightsStrip({ items }: HighlightsStripProps) {
  if (items.length === 0) return null;

  return (
    <section
      aria-label="College highlights"
      className="border-b border-line bg-primary text-white"
    >
      <div className="section-grid">
        <ul className="grid divide-y divide-white/15 md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((item, index) => (
            <li
              key={item}
              className="flex flex-col items-center px-0 py-8 text-center md:px-8 md:py-10"
            >
              <span
                aria-hidden
                className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-white/60"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="max-w-xs text-sm font-medium leading-relaxed tracking-wide md:text-base">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
