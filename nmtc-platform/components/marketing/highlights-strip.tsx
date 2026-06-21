interface HighlightsStripProps {
  items: string[];
}

export function HighlightsStrip({ items }: HighlightsStripProps) {
  if (items.length === 0) return null;

  return (
    <section
      aria-label="College highlights"
      className="border-b border-line bg-primary-deep text-white"
    >
      <div className="section-grid">
        <ul className="grid divide-y divide-white/15 md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((item) => (
            <li
              key={item}
              className="px-0 py-6 text-center text-sm font-medium tracking-wide md:px-8 md:py-8"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
