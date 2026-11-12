"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Clock, Users, GraduationCap, ShieldCheck } from "lucide-react";

interface CounterStat {
  id: string;
  target: number;
  suffix: string;
  label: string;
  sublabel: string;
  icon: typeof Award;
}

const STATS: CounterStat[] = [
  {
    id: "pass-rate",
    target: 100,
    suffix: "%",
    label: "NMC Licensure Pass Rate",
    sublabel: "Exemplary performance across Ghana Nursing & Midwifery Council exams",
    icon: ShieldCheck,
  },
  {
    id: "clinical-hours",
    target: 2400,
    suffix: "+",
    label: "Clinical Practicum Hours",
    sublabel: "Direct bedside care rotations at St. Theresa's Hospital & district clinics",
    icon: Clock,
  },
  {
    id: "alumni",
    target: 1200,
    suffix: "+",
    label: "Nurses & Midwives Graduated",
    sublabel: "Healthcare practitioners serving nationwide and international health systems",
    icon: Users,
  },
  {
    id: "heritage",
    target: 25,
    suffix: "+",
    label: "Years of Healthcare Heritage",
    sublabel: "Educating compassionate caregivers in the Upper West Region",
    icon: Award,
  },
];

function AnimatedNumber({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 1600; // ms
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(easeOut * target);

      setCurrent(val);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrent(target);
      }
    }

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [inView, target]);

  return (
    <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink tabular-nums">
      {current.toLocaleString()}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

export function ImpactStatsStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      aria-label="Institutional Key Statistics"
      className="border-b border-line bg-surface py-12 sm:py-16 transition-colors"
    >
      <div className="section-grid">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="relative rounded-none border border-line bg-bg/50 p-6 sm:p-7 transition-all duration-300 hover:border-ink/30 hover:bg-surface hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-none border border-line bg-surface text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-caption">
                    Accredited
                  </span>
                </div>

                <div className="mb-2">
                  <AnimatedNumber
                    target={stat.target}
                    suffix={stat.suffix}
                    inView={inView}
                  />
                </div>

                <h3 className="font-sans font-bold text-sm sm:text-base text-ink leading-snug">
                  {stat.label}
                </h3>
                <p className="mt-1.5 text-xs text-caption leading-relaxed">
                  {stat.sublabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

