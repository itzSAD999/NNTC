import { ShieldCheck, Award, Heart, UserCheck, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

interface HighlightsStripProps {
  items?: string[];
}

interface CoreValueDef {
  name: string;
  subtitle: string;
  description: string;
  icon: typeof ShieldCheck;
  numeral: string;
}

const CORE_VALUE_MAP: Record<string, CoreValueDef> = {
  integrity: {
    name: "Integrity",
    subtitle: "Honesty & Ethical Practice",
    description:
      "Upholding unyielding moral principles, honesty in academic study, and transparent accountability in every clinical interaction.",
    icon: ShieldCheck,
    numeral: "01",
  },
  excellence: {
    name: "Excellence",
    subtitle: "Clinical & Educational Rigor",
    description:
      "Pursuing the highest benchmarks in patient care, rigorous healthcare education, and continuous professional mastery.",
    icon: Award,
    numeral: "02",
  },
  compassion: {
    name: "Compassion",
    subtitle: "Empathy & Human Dignity",
    description:
      "Treating every patient, mother, and child with genuine warmth, profound empathy, dignity, and dedicated bedside care.",
    icon: Heart,
    numeral: "03",
  },
  professionalism: {
    name: "Professionalism",
    subtitle: "Discipline & Duty",
    description:
      "Exemplifying clinical discipline, respectful communication, and strict adherence to the Nursing and Midwifery Council code.",
    icon: UserCheck,
    numeral: "04",
  },
};

const DEFAULT_CORE_VALUES: CoreValueDef[] = [
  CORE_VALUE_MAP.integrity,
  CORE_VALUE_MAP.excellence,
  CORE_VALUE_MAP.compassion,
];

export function HighlightsStrip({ items }: HighlightsStripProps) {
  // If custom items are passed, match them to core values or use defaults
  const valuesToRender: CoreValueDef[] =
    items && items.length > 0
      ? items.slice(0, 3).map((item, idx) => {
          const key = item.toLowerCase();
          for (const [k, def] of Object.entries(CORE_VALUE_MAP)) {
            if (key.includes(k)) return def;
          }
          return {
            name: item,
            subtitle: "Core Value",
            description:
              "Dedicated commitment to health education, professional growth, and compassionate clinical service at Nandom NMTC.",
            icon: idx === 0 ? ShieldCheck : idx === 1 ? Award : Heart,
            numeral: `0${idx + 1}`,
          };
        })
      : DEFAULT_CORE_VALUES;

  return (
    <section
      aria-label="College Core Values"
      data-nav="light"
      className="border-b border-line bg-[#FAFCFB] py-16 sm:py-20"
    >
      <div className="section-grid">
        {/* Section Header */}
        <Reveal variant="fade" className="max-w-2xl mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Institutional Foundation
          </p>
          <h2 className="mt-2.5 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink">
            Our Core Values
          </h2>
          <div className="mt-3.5 mb-4 h-[3px] w-20 bg-primary" />
          <p className="text-sm sm:text-base text-caption leading-relaxed">
            The ethical pillars that guide academic rigor, maternal and general healthcare training, and student mentorship at Nandom.
          </p>
        </Reveal>

        {/* 3-Column Values Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valuesToRender.map((val, index) => {
            const Icon = val.icon;
            return (
              <Reveal key={val.name} delay={index * 100}>
                <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-none border border-line bg-white p-7 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:bg-primary/[0.015] hover:shadow-xl">
                  {/* Top Green Accent Bar */}
                  <div className="absolute top-0 left-0 h-1 w-full bg-primary/40 transition-colors duration-300 group-hover:bg-primary" />

                  <div>
                    {/* Top Row: Icon + Numeral */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center border border-primary/20 bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-xs font-bold tracking-widest text-caption uppercase">
                        {val.numeral}
                      </span>
                    </div>

                    {/* Value Title */}
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink transition-colors duration-200 group-hover:text-primary">
                      {val.name}
                    </h3>

                    {/* Subtitle */}
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {val.subtitle}
                    </p>

                    {/* Underline */}
                    <div className="mt-3.5 mb-4 h-[2px] w-12 bg-primary/30 transition-all duration-300 group-hover:w-20 group-hover:bg-primary" />

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-caption">
                      {val.description}
                    </p>
                  </div>

                  {/* Bottom Footer Accent */}
                  <div className="mt-8 pt-4 border-t border-line/60 flex items-center justify-between text-xs text-caption">
                    <span className="font-medium text-ink/70">Nandom NMTC</span>
                    <span className="font-mono text-[11px] text-primary font-semibold">Pillar {val.numeral}</span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
