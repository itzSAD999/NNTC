"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Clock, ShieldCheck, Users } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

interface CounterStat {
 id: string;
 target: number;
 suffix: string;
 label: string;
 icon: typeof Award;
}

const STATS: CounterStat[] = [
 { id: "pass-rate", target: 100, suffix: "%", label: "Licensure pass rate", icon: ShieldCheck },
 { id: "clinical-hours", target: 2400, suffix: "+", label: "Clinical hours", icon: Clock },
 { id: "alumni", target: 1200, suffix: "+", label: "Graduates", icon: Users },
 { id: "heritage", target: 25, suffix: "+", label: "Years of training", icon: Award },
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
 if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
 setCurrent(target);
 return;
 }
 const startTime = performance.now();
 const duration = 1400;

 function animate(now: number) {
 const progress = Math.min((now - startTime) / duration, 1);
 const easeOut = 1 - Math.pow(1 - progress, 3);
 setCurrent(Math.floor(easeOut * target));
 if (progress < 1) requestAnimationFrame(animate);
 else setCurrent(target);
 }

 const id = requestAnimationFrame(animate);
 return () => cancelAnimationFrame(id);
 }, [inView, target]);

 return (
 <span className="font-serif text-4xl font-bold tabular-nums text-ink sm:text-5xl">
 {current.toLocaleString()}
 <span className="text-primary">{suffix}</span>
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
 ([entry]) => {
 if (entry?.isIntersecting) {
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
 <section ref={containerRef} aria-label="College statistics" data-nav="light" className="bg-white py-12 sm:py-16">
 <div className="section-grid">
 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
 {STATS.map((stat, i) => {
 const Icon = stat.icon;
 return (
          <Reveal key={stat.id} delay={i * 90}>
 <div className="rounded-none border border-line bg-white p-6">
 <span className="flex h-11 w-11 items-center justify-center rounded-none bg-[#f7f7f7] text-primary">
 <Icon className="h-5 w-5" />
 </span>
 <div className="mt-4">
 <AnimatedNumber target={stat.target} suffix={stat.suffix} inView={inView} />
 </div>
 <h3 className="mt-2 text-sm font-semibold text-ink">{stat.label}</h3>
 </div>
 </Reveal>
 );
 })}
 </div>
 </div>
 </section>
 );
}
