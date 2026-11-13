import { Reveal } from "@/components/motion/reveal";

interface HighlightsStripProps {
  items: string[];
}

export function HighlightsStrip({ items }: HighlightsStripProps) {
  if (items.length === 0) return null;

  return (
    <section aria-label="College highlights" data-nav="light" className="border-b border-line bg-white">
      <div className="section-grid py-8">
        <ul className="grid gap-4 md:grid-cols-3">
          {items.map((item, index) => (
            <Reveal as="li" key={item} delay={index * 90}>
              <div className="rounded-none border border-line bg-white p-6 text-center">
                <span className="font-mono text-xs font-bold text-primary">0{index + 1}</span>
                <p className="mt-2 font-serif text-lg text-ink">{item}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
