import { ShieldCheck, Award, Heart, UserCheck, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

interface HighlightsStripProps {
  items?: string[];
}

interface CoreValueTheme {
  bar: string;
  barHover: string;
  iconBox: string;
  iconBoxHover: string;
  subtitle: string;
  underline: string;
  underlineHover: string;
  pillarBadge: string;
  cardBorderHover: string;
  titleHover: string;
}

interface CoreValueDef {
  name: string;
  subtitle: string;
  description: string;
  icon: typeof ShieldCheck;
  numeral: string;
  theme: CoreValueTheme;
}

const THEME_INTEGRITY: CoreValueTheme = {
  bar: "bg-[#1A5E3A]/40",
  barHover: "group-hover:bg-[#1A5E3A]",
  iconBox: "border-[#1A5E3A]/25 bg-[#1A5E3A]/10 text-[#1A5E3A]",
  iconBoxHover: "group-hover:bg-[#1A5E3A] group-hover:text-white group-hover:border-[#1A5E3A]",
  subtitle: "text-[#1A5E3A]",
  underline: "bg-[#1A5E3A]/30",
  underlineHover: "group-hover:bg-[#1A5E3A]",
  pillarBadge: "text-[#1A5E3A]",
  cardBorderHover: "hover:border-[#1A5E3A]",
  titleHover: "group-hover:text-[#1A5E3A]",
};

const THEME_EXCELLENCE: CoreValueTheme = {
  bar: "bg-[#9A1B2F]/40",
  barHover: "group-hover:bg-[#9A1B2F]",
  iconBox: "border-[#9A1B2F]/25 bg-[#9A1B2F]/10 text-[#9A1B2F]",
  iconBoxHover: "group-hover:bg-[#9A1B2F] group-hover:text-white group-hover:border-[#9A1B2F]",
  subtitle: "text-[#9A1B2F]",
  underline: "bg-[#9A1B2F]/30",
  underlineHover: "group-hover:bg-[#9A1B2F]",
  pillarBadge: "text-[#9A1B2F]",
  cardBorderHover: "hover:border-[#9A1B2F]",
  titleHover: "group-hover:text-[#9A1B2F]",
};

const THEME_COMPASSION: CoreValueTheme = {
  bar: "bg-[#D99B00]/50",
  barHover: "group-hover:bg-[#D99B00]",
  iconBox: "border-[#D99B00]/30 bg-[#D99B00]/15 text-[#9A6D00]",
  iconBoxHover: "group-hover:bg-[#D99B00] group-hover:text-white group-hover:border-[#D99B00]",
  subtitle: "text-[#9A6D00]",
  underline: "bg-[#D99B00]/40",
  underlineHover: "group-hover:bg-[#D99B00]",
  pillarBadge: "text-[#9A6D00]",
  cardBorderHover: "hover:border-[#D99B00]",
  titleHover: "group-hover:text-[#9A6D00]",
};

const THEME_PROFESSIONALISM: CoreValueTheme = {
  bar: "bg-[#0D5C75]/40",
  barHover: "group-hover:bg-[#0D5C75]",
  iconBox: "border-[#0D5C75]/25 bg-[#0D5C75]/10 text-[#0D5C75]",
  iconBoxHover: "group-hover:bg-[#0D5C75] group-hover:text-white group-hover:border-[#0D5C75]",
  subtitle: "text-[#0D5C75]",
  underline: "bg-[#0D5C75]/30",
  underlineHover: "group-hover:bg-[#0D5C75]",
  pillarBadge: "text-[#0D5C75]",
  cardBorderHover: "hover:border-[#0D5C75]",
  titleHover: "group-hover:text-[#0D5C75]",
};

const CORE_VALUE_MAP: Record<string, CoreValueDef> = {
  integrity: {
    name: "Integrity",
    subtitle: "Honesty & Ethical Practice",
    description:
      "Upholding unyielding moral principles, honesty in academic study, and transparent accountability in every clinical interaction.",
    icon: ShieldCheck,
    numeral: "01",
    theme: THEME_INTEGRITY,
  },
  excellence: {
    name: "Excellence",
    subtitle: "Clinical & Educational Rigor",
    description:
      "Pursuing the highest benchmarks in patient care, rigorous healthcare education, and continuous professional mastery.",
    icon: Award,
    numeral: "02",
    theme: THEME_EXCELLENCE,
  },
  compassion: {
    name: "Compassion",
    subtitle: "Empathy & Human Dignity",
    description:
      "Treating every patient, mother, and child with genuine warmth, profound empathy, dignity, and dedicated bedside care.",
    icon: Heart,
    numeral: "03",
    theme: THEME_COMPASSION,
  },
  professionalism: {
    name: "Professionalism",
    subtitle: "Discipline & Duty",
    description:
      "Exemplifying clinical discipline, respectful communication, and strict adherence to the Nursing and Midwifery Council code.",
    icon: UserCheck,
    numeral: "04",
    theme: THEME_PROFESSIONALISM,
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
          const theme =
            idx === 0
              ? THEME_INTEGRITY
              : idx === 1
                ? THEME_EXCELLENCE
                : THEME_COMPASSION;
          return {
            name: item,
            subtitle: "Core Value",
            description:
              "Dedicated commitment to health education, professional growth, and compassionate clinical service at Nandom NMTC.",
            icon: idx === 0 ? ShieldCheck : idx === 1 ? Award : Heart,
            numeral: `0${idx + 1}`,
            theme,
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
                <article
                  className={cn(
                    "group relative flex h-full flex-col justify-between overflow-hidden rounded-none border border-line bg-white p-7 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl",
                    val.theme.cardBorderHover
                  )}
                >
                  {/* Top Institutional Crest Accent Bar */}
                  <div
                    className={cn(
                      "absolute top-0 left-0 h-1 w-full transition-colors duration-300",
                      val.theme.bar,
                      val.theme.barHover
                    )}
                  />

                  <div>
                    {/* Top Row: Icon + Numeral */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center border transition-colors duration-300",
                          val.theme.iconBox,
                          val.theme.iconBoxHover
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-xs font-bold tracking-widest text-caption uppercase">
                        {val.numeral}
                      </span>
                    </div>

                    {/* Value Title */}
                    <h3
                      className={cn(
                        "font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink transition-colors duration-200",
                        val.theme.titleHover
                      )}
                    >
                      {val.name}
                    </h3>

                    {/* Subtitle */}
                    <p
                      className={cn(
                        "mt-1 text-xs font-semibold uppercase tracking-[0.16em]",
                        val.theme.subtitle
                      )}
                    >
                      {val.subtitle}
                    </p>

                    {/* Underline */}
                    <div
                      className={cn(
                        "mt-3.5 mb-4 h-[2px] w-12 transition-all duration-300 group-hover:w-20",
                        val.theme.underline,
                        val.theme.underlineHover
                      )}
                    />

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-caption">
                      {val.description}
                    </p>
                  </div>

                  {/* Bottom Footer Accent */}
                  <div className="mt-8 pt-4 border-t border-line/60 flex items-center justify-between text-xs text-caption">
                    <span className="font-medium text-ink/70">Nandom NMTC</span>
                    <span className={cn("font-mono text-[11px] font-semibold", val.theme.pillarBadge)}>
                      Pillar {val.numeral}
                    </span>
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
